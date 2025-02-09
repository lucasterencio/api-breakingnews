import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true
    },

    username: {
        type: String,
        require: true,
        unique: true
    },

    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        require: true,
        select: false //serve para nao enviar a senha, quando uma consulta do BD mandar retornar os users
    },

    avatar: {
        type: String,
        require: true
    },

    background: {
        type: String,
        require: true
    }
})

userSchema.pre("save", async function(next) {
    
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

const User = mongoose.model("User", userSchema)

export default User