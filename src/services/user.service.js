import User from "../models/User.js";

const createService = (body) => User.create(body)

const findAllService = () => User.find()

const findByIdService = (id) => User.findById(id)

const updateService = (id, name, username, email, password, avatar, background) =>{
    return User.findOneAndUpdate({_id: id}, {name, username, email, password, avatar, background})
    //atualiza todos os campos, passando o id como referencia do obj
}

export default { createService, findAllService, findByIdService, updateService }