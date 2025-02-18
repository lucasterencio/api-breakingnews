import { Router } from "express";
import { create, findAll, topNews, findById, searchByTittle, byUser, update, erase, likeNews,
    addComment, deleteComment   
 } from "../controllers/news.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/", authMiddleware, create)
router.get("/", findAll)
router.get("/top", topNews)
router.get("/search", searchByTittle )
router.get("/byUser", authMiddleware, byUser )
router.get("/:id", authMiddleware, findById )
router.patch("/:id", authMiddleware, update )
router.delete("/:id", authMiddleware, erase )
router.patch("/like/:id", authMiddleware, likeNews )
router.patch("/comment/:id", authMiddleware, addComment )
router.patch("/comment/:idNews/:idComment", authMiddleware, deleteComment )



export default router