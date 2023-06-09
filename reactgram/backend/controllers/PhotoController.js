const Photo = require("../models/Photo")
const User = require("../models/User")
const mongoose = require("mongoose")//configs bd

//Insert a photo, with an user related to it - Insira uma foto, com um usuário relacionado a ela
const insertPhoto = async (req, res) => {
    const { title } = req.body
    const image = req.file.filename

    const reqUser = req.user

    const user = await User.findById(reqUser._id)//busca de user por id

    //Create a phot
    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name
    })

    //If photo was created successfully, return data - Se a foto foi criada com sucesso, retorne os dados
    if (!newPhoto) {
        res.status(422).json({ errors: ["Houve um problema, por favor tente novamente mais tarde."] })
        return
    }

    res.status(201).json(newPhoto)
}

//Remove a photo from DB - Remover uma foto do BD
const deletePhoto = async (req, res) => {

    const { id } = req.params
    const reqUser = req.user

    try {
        const photo = await Photo.findById(id)//extraindo foto do model

        //Check if photo exists - Verificando se a foto existe
        if (!photo) {
            res.status(404).json({ errors: ["Foto não encontrada!"] })
            return//quando um erro é gerado, o ideal é retornar para evitar uma possível continuação da função
        }

        //Check if photo belongs to user - Verificando se a foto pertence ao usuário
        if (!photo.userId.equals(reqUser._id)) {//equals - método do mongoose//verificando se a informação de que o user do id da foto é igual o id do usuário é falsa
            res.status(422).json({ errors: ["Ocorreu um erro, por favor tente novamente mais tarde."] })
        }

        await Photo.findByIdAndDelete(photo._id)
        //encontra foto pelo id e deleta

        res.status(200).json({ id: photo._id, message: "Foto excluída com sucesso!" })
    } catch (error) {
        res.status(404).json({ errors: ["Foto não encontrada!"] })
        return
    }
}

//Get all photos - Obter todas as fotos
const getAllPhotos = async (req, res) => {

    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec()//.find(): criar um obj que filtra, obj vazio busca todas
    //.sort(): ordena// [["createdAt", -1]]: ordenas pelos criados por último, + recentemente(+novos)

    return res.status(200).json(photos)
}

//Get user photos - resgatndo foto do usuário
const getUserPhotos = async (req, res) => {

    const { id } = req.params//id da url pois posso estar buscando tanto a minha foto, quanto a de outra pessoa

    const photos = await Photo.find({ userId: id }).sort([['createdAt', -1]]).exec()
    //id od usuario + id da foto
    return res.status(200).json(photos)//retorna dados da foto em json 
}

//get photo by id - resgate de foto por id(interessante para quando vamos ver o detalhe de uma foto individualmente)
const getPhotoById = async (req, res) => {
    const { id } = req.params
    const photo = await Photo.findById(id)

    //check if photo exists - verificando se foto existe
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada!"] })
        return
    }
    return res.status(200).json(photo)
}

//update a photo - atualizar foto
const updatePhoto = async (req, res) => {

    const { id } = req.params
    const { title } = req.body

    const reqUser = req.user

    const photo = await Photo.findById(id)//resgatando photo pelo id

    //check if photo exists - checando se foto existe
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada."] })
        return
    }

    //check if belongs to user - verificando se pertence ao usuário
    if (!photo.userId.equals(reqUser._id)) {
        res.status(422).json({ errors: ["Ocorreu um erro, por favor tente novamente mais tarde."] })
        return
    }

    if (title) {
        photo.title = title
    }//verificando título

    await photo.save()//atualiza dado

    res.status(200).json({ photo, message: "Foto atualizada com sucesso" })//envia foto com dado atualizado e mensagem
}

//Like functionality - funcionalidade like  
const likePhoto = async (req, res) => {
    const { id } = req.params//id da foto pelo parâmetro
    reqUser = req.user//usuário req
    const photo = await Photo.findById(id)

    //check if photo exists - verificando se foto existe
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada!"] })
        return
    }

    //check if user already liked the photo - verificando se usuário já deu like na foto
    if (photo.likes.includes(reqUser._id)) {//verificando se array de likes inclui id do usuario
        res.status(404).json({ errors: ["Você já curtiu a foto!"] })
        return
    }

    //Put user id in likes array - colocando id do usuário no array de likes
    photo.likes.push(reqUser._id)

    photo.save()//atualizando foto(como se fosse um update)

    res.status(200).json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida." })
    //id-photo q veio da url//id-user//message
}

//Comment functionality - funcionalidade comentário  
const commentPhoto = async (req, res) => {
    const { id } = req.params//id da foto pelo parâmetro - url
    const { comment } = req.body//comentário do corpo dea requisição
    reqUser = req.user//usuário req
    const user = await User.findById(reqUser._id)//usuário do model
    const photo = await Photo.findById(id)

    //check if photo exists - verificando se foto existe
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada!"] })
        return
    }
    //se foto existe vai pular direto para a inclusão do comment

    //Put a comment in the array comments - Coloque um comentário nos array de comentários
    const userComment = { //dados do comentário
        comment, //texto de fato do comentário
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id
    }
    photo.comments.push(userComment)//inserindo comentário do usuário na rede de comentários

    await photo.save()//atualizando foto(como se fosse um update)

    res.status(200).json({ comment: userComment, message: "O comentário foi adicionado com sucesso!" })
}

//Search photos by title - Pesquisar fotos por título
const searchPhotos = async (req, res) => {
    const { q } = req.query//esperando argumento q da query string da url

    const photos = await Photo.find({title: new RegExp(q, "i")}).exec()//RegExp-objeto é usado para combinar texto com um padrão. /String "i" será ignorada pois as regex são case sensitive

    res.status(200).json(photos)
}

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos
}