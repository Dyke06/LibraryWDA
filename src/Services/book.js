import { http } from "./config";

export default{
    listar:() =>{
        return http.get('book')
    },

    salvar: (book) => {
        return http.post('book', book)
          .then(response => {
            // A resposta do servidor deve conter o ID atribuído ao livro
            const novoID = response.data.id;
            const novoEditora = response.data.publisherId;
            const novoTotalAlugado = response.data.totalRent;
    
            // Atualize o objeto 'book' com o novo ID, o novo ID da editora e o novo totalAlugado
            book.id = novoID;
            book.publisherId = novoEditora;
            book.totalRent = novoTotalAlugado;
    
            // Agora, atualize a editora no mesmo objeto 'book'
            // Para garantir que as informações da editora sejam refletidas
            book.publisher = response.data.publisher;
    
            // Retorne o objeto 'book' atualizado
            return book;
          })
          .catch(error => {
            console.error('Erro ao salvar o livro: ' + error);
            throw error;
          });
      },

    atualizar:(id, book) =>{
        return http.put(`book/${id}`, book)
    },

    apagar:(id) =>{
        return http.delete(`book/${id}`)
    },

    alugados:(book) =>{
        return http.get('book/most-rented', book)
    }
}