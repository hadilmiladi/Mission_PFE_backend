const express = require("express")
const router = express.Router()
    // function
const {
    createNewClient,
    deleteOneClient,
    updateOneClient,
    /* retriveOneClient, */
    retriveAllClient,
    retriveAllActive
} = require("../controller/client-controller")
const verifyAccess = require("../middleware/verify-access")
router.get("/all",verifyAccess, retriveAllClient);
router.get("/active",verifyAccess, retriveAllActive);
router.post("/create",verifyAccess, createNewClient)
router.delete("/delete/:id",verifyAccess, deleteOneClient)
router.put("/update/:id",verifyAccess, updateOneClient)
/* router.get("/one/:id", verifyAccess,  retriveOneClient) */




module.exports = router