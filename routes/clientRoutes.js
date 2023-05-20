const express = require("express")
const router = express.Router()
    // function
const {
    createNewClient,
    deleteOneClient,
    updateOneClient,
    retriveOneClient,
    retriveAllClient
} = require("../controller/client-controller")

router.get("/all", retriveAllClient);
router.get("/one/:id", retriveOneClient)
router.post("/create", createNewClient)
router.put("/update/:id", updateOneClient)
router.delete("/delete/:id", deleteOneClient)

module.exports = router