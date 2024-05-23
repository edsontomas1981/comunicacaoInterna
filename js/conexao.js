class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async getAll(endpoint) {
        const response = await fetch(`${this.baseUrl}/${endpoint}`);
        return this.handleResponse(response);
    }

    async getById(endpoint, id) {
        const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`);
        return this.handleResponse(response);
    }

    async create(endpoint, data) {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return this.handleResponse(response);
    }

    async update(endpoint, id, data) {
        const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return this.handleResponse(response);
    }

    async delete(endpoint, id) {
        const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return this.handleResponse(response);
    }

    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }
        return response.json();
    }
}


const formataDataPtBr = (dataString)=>{
  
    const dataObj = new Date(dataString);
    // Usando 'pt-BR' para obter o formato brasileiro
    const formatoBrasileiro = new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  
    return formatoBrasileiro.format(dataObj);
  }

const BASEURL = "https://comunicacao-interna.vercel.app/";

class Conn {
    constructor(url, data) {
        this.url = BASEURL + url;
        this.data = data;
    }

    getCSRFToken = async () => {
        try {
            const response = await fetch(BASEURL+'/produtos/api/get_csrf_token/', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.csrf_token;
        } catch (error) {
            console.error(error);
            return null;
        }
    };
    

    async sendPostRequest(url, data) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

function transformarEmListaDeListas(data) {
    // Criar uma lista vazia para armazenar as listas de objetos
    const listaDeListas = [];
  
    // Iterar sobre cada objeto na lista de dados
    for (const objeto of data) {
      // Criar uma nova lista para armazenar as propriedades do objeto
      const listaDePropriedades = [];
  
      // Iterar sobre cada chave do objeto
      for (const chave in objeto) {
        // Adicionar o valor da chave à lista de propriedades
        listaDePropriedades.push(objeto[chave]);
      }
  
      // Adicionar a lista de propriedades à lista de listas
      listaDeListas.push(listaDePropriedades);
    }
  
    // Retornar a lista de listas
    return listaDeListas;
  }
  

function formatarData(dataString) {
    const partesData = dataString.split('/');
    const dia = partesData[0];
    const mes = partesData[1];
    const ano = partesData[2];
    return `${ano}-${mes}-${dia}`;
}

const populaCi = (dados)=>{
  let isca1 = document.getElementById('isca1')
  let isca2 = document.getElementById('isca2')
  let manifesto = document.getElementById('numManifesto')
  let frete = document.getElementById('freteValor')
  let destinatario = document.getElementById('destinatario')
  let motorista = document.getElementById('motorista')
  let dataCi = document.getElementById('dataCi')
  let observacao = document.getElementById('observacao')
  let rota = document.getElementById('rota')
  let idNumCi = document.getElementById('idCiNum')

  isca1.value = dados.isca_1
  isca2.value = dados.isca_2
  manifesto.value = dados.manifesto_numero
  destinatario.value = dados.destinatario
  frete.value = dados.valor_frete.toFixed(2)
  motorista.value = dados.motorista
  dataCi.value = formatarData(dados.data)
  observacao.value = dados.observacao
  rota.value = dados.percurso
  idNumCi.value = dados.ci_num
}

const limpaForm = ()=>{
    let isca1 = document.getElementById('isca1')
    let isca2 = document.getElementById('isca2')
    let manifesto = document.getElementById('numManifesto')
    let frete = document.getElementById('freteValor')
    let destinatario = document.getElementById('destinatario')
    let motorista = document.getElementById('motorista')
    let dataCi = document.getElementById('dataCi')
    let observacao = document.getElementById('observacao')
    let rota = document.getElementById('rota')
    
    isca1.value = ''
    isca2.value = ''
    manifesto.value = ''
    destinatario.value = ''
    frete.value = ''
    motorista.value = ''
    dataCi.value = ''
    observacao.value = ''
    rota.value = ''
}

document.addEventListener('DOMContentLoaded',async ()=>{

    const imprimirCi = async(element)=>{
        apiService.getById('comunicacao', element)
        .then(data => reportCi(data))
        .catch(error => console.error('Error:', error));

        // let conexao = new Conn('/print_comunicacao',{'ci_num':element})
        // let dados = await conexao.sendPostRequest()
        // console.log(dados)
    } 


    // Exemplo de uso:
    const apiService = new ApiService('http://localhost:5000');

    const carregaTbody = async ()=>{

        let botoes={
            print:{
                classe: "btn btn-info text-white",
                texto: '<i class="fa fa-print" aria-hidden="true"></i>',
                callback: imprimirCi
              }
            }
         ; 

        // Obter todas as comunicações
        var dados = await apiService.getAll('comunicacoes')
        .then(data => transformarEmListaDeListas(data))
        .catch(error => console.error('Error:', error))

        popula_tbody_paginacao('paginacao','dadosCi',dados,botoes,1,20,false)

    }

    carregaTbody()

    let btnBuscar = document.getElementById('buscar')
    btnBuscar.addEventListener('click',()=>{
      // Obter uma comunicação por ID
      apiService.getById('comunicacao', document.getElementById('ciNum').value)
        .then(data => populaCi(data))
        .catch(error => console.error('Error:', error));
    })

    const verificaSalvar= (dados)=>{
        console.log(dados)
        carregaTbody()
        limpaForm()
    }

    document.getElementById('excluir').addEventListener('click',()=>{
        // Deletar uma comunicação
        apiService.delete(document.getElementById('idCiNum').value, 1)
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));

    })

    let btnSalvar = document.getElementById('salvar')
    btnSalvar.addEventListener('click',()=>{

      let isca1 = document.getElementById('isca1')
      let isca2 = document.getElementById('isca2')
      let manifesto = document.getElementById('numManifesto')
      let frete = document.getElementById('freteValor')
      let destinatario = document.getElementById('destinatario')
      let motorista = document.getElementById('motorista')
      let dataCi = document.getElementById('dataCi')
      let observacao = document.getElementById('observacao')
      let rota = document.getElementById('rota')
      // Criar uma nova comunicação
      const newComunicacao = {
          destinatario: destinatario.value,
          manifesto_numero: manifesto.value,
          motorista: motorista.value,
          valor_frete: frete.value,
          percurso: rota.value,
          data: dataCi.value,
          observacao: observacao.value,
          isca_1: isca1.value,
          isca_2: isca2.value
      };
    apiService.create('comunicacao', newComunicacao)
        .then(data => verificaSalvar(data))
        .catch(error => console.error('Error:', error));
    })
})







// // Obter uma comunicação por ID
// apiService.getById('comunicacao', 1)
//     .then(data => console.log(data))
//     .catch(error => console.error('Error:', error));



// // Atualizar uma comunicação existente
// const updatedComunicacao = {
//     destinatario: "Maria",
//     manifesto_numero: "12345",
//     motorista: "José",
//     valor_frete: 200.0,
//     percurso: "Rio - São Paulo",
//     data: "2024-05-21",
//     observacao: "Entrega normal",
//     isca_1: "Não",
//     isca_2: "Sim"
// };
// apiService.update('comunicacao', 1, updatedComunicacao)
//     .then(data => console.log(data))
//     .catch(error => console.error('Error:', error));


