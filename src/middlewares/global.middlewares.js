import mongoose from "mongoose";
import userService from "../services/user.service.js";

const validId = (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid ID" });
    }

    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const validUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.findByIdService(id);

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    //essa é a req que sera enviada para a proxima função. Com isso, nao precisa ficar criando variaveis pra pegar o id ou user
    req.id = id;
    req.user = user;

    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export { validId, validUser };
