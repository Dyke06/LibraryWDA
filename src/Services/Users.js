import { http } from "./config";

export default{
    listar:() =>{
        return http.get('Users')
    },

    salvar:(produto) => {
        return http.post('Users', produto)
        .then(response => {
            // A resposta do servidor deve conter o ID atribuído à editora
            const novoID = response.data.id;

            // Atualize o objeto 'editora' com o novo ID
            produto.id = novoID;

            // Retorne o objeto 'editora' atualizado
            return produto;
        })
        .catch(error => {
            console.error('Erro ao salvar a editora: ' + error);
            throw error;
        });
  },

    atualizar:(id, produto) =>{
        return http.put(`Users/${id}`, produto)
    },

    apagar:(id) =>{
        return http.delete(`Users/${id}`)
    }
}