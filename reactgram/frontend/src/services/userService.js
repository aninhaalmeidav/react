import { api, requestConfig } from '../utils/config'

//get user details - obter detalhes do usuário
//obtém perfil do usuário logado para tela de edição
const profile = async (data, token) => {
    const config = requestConfig("GET", data, token)//config da requisição passando a função requestConfig recebendo método get e os dados e o token

    try {

        const res = await fetch(api + "/users/profile", config)//perfil do usuário logado(baseado no token)
            .then((res) => res.json())//será transformada em obj javascript
            .catch((err) => err)//se houver algum erro

        return res
    } catch (error) {
        console.log(error)
    }
}

//Update user details - Atualizar detalhes do usuário
const updateProfile = async (data, token) => {//token-permite a autenticação/data-preciso de dados para atualização do usuário

    const config = requestConfig("PUT", data, token, true)//config requisição//put: atualização completa de um registro//true: req. pode conter imagens

    try {

        const res = await fetch(api + "/users/", config)//espera resposta de um await fecth api + url(/users/-barra na frente pois está trabalhando com atualização)+config(configs necessárias para atualizar com sucesso)
            .then((res) => res.json())
            .catch((err) => err)

    } catch (error) {
        console.log(error)
    }
}

const userService = {
    profile,
    updateProfile
}

export default userService