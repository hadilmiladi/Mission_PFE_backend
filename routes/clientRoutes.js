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
const verifyAccess = require("../middleware/verify-access")
router.get("/all",/* verifyAccess, */ retriveAllClient);
router.get("/one/:id",/* verifyAccess, */ retriveOneClient)
router.post("/create",/* verifyAccess, */ createNewClient)
router.put("/update/:id",/* verifyAccess, */ updateOneClient)
router.delete("/delete/:id",/* verifyAccess, */ deleteOneClient)

module.exports = router