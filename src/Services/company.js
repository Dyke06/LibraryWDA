import { http } from "./config";

export default {
  listar: () => {
    return http.get('publisher');
  },

  salvar: (editora) => {
    return http.post('publisher', editora)
      .then(response => {
        // A resposta do servidor deve conter o ID atribuído à editora
        const novoID = response.data.id;

        // Atualize o objeto 'editora' com o novo ID
        editora.id = novoID;

        // Retorne o objeto 'editora' atualizado
        return editora;
      })
      .catch(error => {
        console.error('Erro ao salvar a editora: ' + error);
        throw error;
      });
  },

  atualizar: (id, editora) => {
    return http.put(`publisher/${id}`, editora);
  },

  apagar: (id) => {
    return http.delete(`publisher/${id}`);
  }
}
