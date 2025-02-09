import News from "../models/News.js";

const createService = (body) => News.create(body)
const findAllService = (offset, limit) => News.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user")
//                          PAGINAÇÃO
// o sort com id -1, serve para trazer a ultima postagem como primeiro
//o skip, e de quantos em quantos vai aparecer as noticias, como default e 5 em 5
//o limit, e o limite de post por vez que sera buscado no BD
const countNews = () => News.countDocuments()

const topNewsService = () => News.findOne().sort({_id: -1}).populate("user")

const findByIdService = (id) => News.findById(id).populate("user")

const searchByTittleService = (title) => News.find({
    title: {$regex: `${title || ""}`, $options: "i"},
}).sort({_id: -1}).populate("user")
//Vai ser recebido um tittle OU parte dele, nas options o "i" significa que nao vai ser case sensitive

const byUserService = (id) => News.find({user: id}).sort({_id: -1}).populate("user")

const updateService = (id, title, text, banner) => News.findByIdAndUpdate({_id: id}, {title, text, banner}, {rawResult: true})

const eraseService = (id) => News.findByIdAndDelete({_id: id})

const likeNewsService = (idNews, userId) => News.findOneAndUpdate(
    {_id: idNews, "likes.userId": {$nin: [userId]}},
    {$push: {likes: {userId, created: new Date()}}}
)

const deleteLikeNewsService = (idNews, userId) => News.findByIdAndUpdate(
    {_id: idNews},
    {$pull: {likes: {userId}}}
    //pull para retirar. é uma query do mongoDB
)

const addCommentService = (idNews, comment, userId) => {
    const idComment = Math.floor(Date.now() * Math.random()).toString(36)
    return News.findOneAndUpdate(
        {_id: idNews},
        {$push: {comments: { idComment, userId, comment, createdAt: new Date()}}}
    )
}

const deleteCommentService = (idNews, idComment, userId) => News.findOneAndUpdate(
    {_id: idNews},
    {$pull: {comments: {idComment, userId}}}
    //no campo comments, procura pelo idComment correto e userId correto para deletar
    //so o usuario que apagou o comment pode apagar
)




export { 
    createService, 
    findAllService, 
    countNews, 
    topNewsService, 
    findByIdService, 
    searchByTittleService, 
    byUserService,
    updateService,
    eraseService,
    likeNewsService,
    deleteLikeNewsService,
    addCommentService,
    deleteCommentService
}