import User from "../models/User.js";
import jwt from "jsonwebtoken"

const loginService = (email) => User.findOne({email: email}).select("+password")
//agora ele precisa retornar o password, para descriptar a senha e comparar pra fazer login

const generateToken = (id) => jwt.sign({id:id}, process.env.SECRET, {expiresIn: 86400})


export { loginService, generateToken }