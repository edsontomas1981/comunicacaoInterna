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
            method: 'DELETE'
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

  isca1.value = dados.isca_1
  isca2.value = dados.isca_2
  manifesto.value = dados.manifesto_numero
  destinatario.value = dados.destinatario
  frete.value = dados.valor_frete
  motorista.value = dados.motorista
  dataCi.value = dados.data
  observacao.value = dados.observacao
  rota.value = dados.percurso
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
    // Exemplo de uso:
    const apiService = new ApiService('http://localhost:5000');

    const carregaTbody = async ()=>{

        let botoes={
            print: {
                classe: "btn btn-danger text-white",
                texto: 'Apagar',
                // callback: btnRemoveMotorista
              }
          }; 

        // Obter todas as comunicações
        var dados = await apiService.getAll('comunicacoes')
        .then(data => transformarEmListaDeListas(data))
        .catch(error => console.error('Error:', error))

        popula_tbody_paginacao('paginacao','dadosCi',dados,{},1,20,false)

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

// // Deletar uma comunicação
// apiService.delete('comunicacao', 1)
//     .then(data => console.log(data))
//     .catch(error => console.error('Error:', error));
