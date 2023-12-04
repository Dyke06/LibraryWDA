import { http } from "./config";

export default{
    listar:() =>{
        return http.get('rent')
    },
    listar_Pendente:() =>{
        return http.get('rent/count-pendentes')
    },
    listar_Prazo:() =>{
        return http.get('rent/count-no-prazo')
    },
    listar_Atrasado:() =>{
        return http.get('rent/count-atrasados')
    },

    salvar:(aluguel) => {
        return http.post('rent', aluguel)
    },

    atualizar:(id) =>{
        return http.put(`rent/${id}`)
    },

    apagar:(aluguel) =>{
        return http.delete('aluguel', {data: aluguel})
    }
}