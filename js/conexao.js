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
  

document.addEventListener('DOMContentLoaded',async ()=>{
    // Exemplo de uso:
    const apiService = new ApiService('http://localhost:5000');

    // Obter todas as comunicações
    var dados = await apiService.getAll('comunicacoes')
        .then(data => transformarEmListaDeListas(data))
        .catch(error => console.error('Error:', error))


    popula_tbody_paginacao('paginacao','dadosCi',dados,{},1,20,false,false)
})




// // Obter uma comunicação por ID
// apiService.getById('comunicacao', 1)
//     .then(data => console.log(data))
//     .catch(error => console.error('Error:', error));

// // Criar uma nova comunicação
// const newComunicacao = {
//     destinatario: "João",
//     manifesto_numero: "12345",
//     motorista: "Carlos",
//     valor_frete: 150.0,
//     percurso: "São Paulo - Rio",
//     data: "2024-05-20",
//     observacao: "Entrega urgente",
//     isca_1: "Sim",
//     isca_2: "Não"
// };
// apiService.create('comunicacao', newComunicacao)
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
