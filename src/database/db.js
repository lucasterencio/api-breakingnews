import mongoose from "mongoose";


const connectDatabase = () =>{
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Mongo db connected"))
    .catch((err) => console.log(err))
}

export default connectDatabase