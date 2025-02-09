import {
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
} from "../services/news.service.js";
import { ObjectId } from "mongoose";

const create = async (req, res) => {
  try {
    const { title, text, banner } = req.body;

    if (!title || !banner || !text) {
      res.status(400).send({ message: "Submit all fields for registration" });
    }

    await createService({
      title,
      text,
      banner,
      user: req.userId,
    });

    res.send(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const findAll = async (req, res) => {
  try{
    let { limit, offset } = req.query;

    //limit => é a quantidade de news que vai aparecer no momento que a rota é chamada
    //offset => é de onde começa
  
    limit = Number(limit);
    offset = Number(offset);
  
    if (!limit) {
      limit = 5;
    }
  
    if (!offset) {
      offset = 0;
    }
  
    const news = await findAllService(offset, limit);
    const total = await countNews();
    const currentUrl = req.baseUrl;
  
    const next = offset + limit;
  
    const nextUrl =
      next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;
  
    const previous = offset - limit < 0 ? null : offset - limit;
  
    const previousUrl =
      previous !== null
        ? `${currentUrl}?limit=${limit}&offset=${previous}`
        : null;
  
    if (news.length === 0) {
      return res.status(400).send({ message: "There are not registered news" });
    }
  
    res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,
  
      result: news.map((news) => ({
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        username: news.user.username,
        userAvatar: news.user.avatar,
      })),
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const topNews = async (req, res) => {
  try{
    const news = await topNewsService();

    if (!news) {
      return res.status(400).send({ message: "There are not registered news" });
    }

    res.send({
      news:{
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        username: news.user.username,
        userAvatar: news.user.avatar,
      }
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const findById = async(req, res) =>{
  try{
    const { id } = req.params
    const news = await findByIdService(id)

    return res.send({
      news:{
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        username: news.user.username,
        userAvatar: news.user.avatar,
      }
    })

  } catch (err) {
    res.status(500).send(err.message);
  }
}

const searchByTittle = async(req, res) =>{
  try{
    
    const {title} = req.query

    const news = await searchByTittleService(title)

    if(news.length === 0){
      return res.status(400).send({message: "There are not news with this title"})
    }

    return res.send({
      result: news.map((news) => ({
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        username: news.user.username,
        userAvatar: news.user.avatar,
      }))
    })



  } catch (err) {
    res.status(500).send(err.message);
  }
}

const byUser = async(req, res) =>{
  try{  
    const id = req.userId

    const news = await byUserService(id)

    return res.send({
      result: news.map((news) => ({
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        username: news.user.username,
        userAvatar: news.user.avatar,
      }))
    })

  } catch (err) {
    res.status(500).send(err.message);
  }
}

const update = async(req, res) =>{
  try{
    const { title, text, banner } = req.body
    const { id } = req.params

    if(!title && !banner && !text){
      res.status(400).send({
        message: "Submit at least one field to update the post"
      })
    }

    const news = await findByIdService(id)

    if(String(news.user._id) !== req.userId){
      return res.status(400).send({
        message: "You can't update this post"
      })
    }

    await updateService(id, title, text, banner)

    return res.send({message: "News successfully updated!"})

  } catch (err) {
    res.status(500).send(err.message);
  }
}

const erase = async(req, res) =>{
  try{

    const { id } = req.params
    const news = await findByIdService(id)

    if(String(news.user._id) !== req.userId){
      return res.status(400).send({
        message: "You can't delete this post"
      })
    }

    await eraseService(id)

    return res.send({message: "News deleted successfully !"})

  } catch (err) {
    res.status(500).send(err.message);
  }
}

const likeNews = async(req, res) =>{

  try{

    const { id } = req.params
    const userID = req.userId
  
    const newsLiked = await likeNewsService(id, userID)

    if(!newsLiked){
      await deleteLikeNewsService(id, userID)
      return res.status(200).send({
        message: "Like successfully removed"
      })
    }

    res.send({message: "Like done successfully"})

  } catch (err) {
    res.status(500).send(err.message);
  }

  
}

const addComment = async(req, res) =>{
  try{
    const { id } = req.params
    const userId = req.userId
    const { comment } = req.body
  
    if(!comment){
      return res.status(400).send({
        message: "Write a message to comment"
      })
    }
  
    await addCommentService(id, comment, userId)

    return res.status(200).send({
      message: "Comment successfully completed!"
    })

  } catch (err) {
    res.status(500).send(err.message);
  }
}

const deleteComment = async(req, res) =>{
  try{
    const { idNews, idComment } = req.params
    const userId = req.userId

  
    const commentDeleted = await deleteCommentService(idNews, idComment, userId)

    const commentFinder = commentDeleted.comments.find(comment => comment.idComment === idComment)

    if(!commentFinder){
      return res.status(400).send({
        message: "Comment doesn't exist"
      })
    }

    if(commentFinder.userId !== userId){
      return res.status(400).send({
        message: "You cant delete this comment"
      })
    }

    res.status(200).send({
      message: "Comment successfully removed!"
    })

  } catch (err) {
    res.status(500).send(err.message);
  }
}

export { create, findAll, topNews, findById, searchByTittle, byUser, update, erase, likeNews, addComment, deleteComment };


// catch (err) {
//   res.status(500).send(err.message);
// }