
const swaggerUi = require("swagger-ui-express")
const router = require("express").Router()


// import swaggerDocument from "../swagger.json" assert { type: "json" }
const swaggerDocument = require("../swagger.json")
router.use("/", swaggerUi.serve)
router.get("/", swaggerUi.setup(swaggerDocument))


module.exports = router