const express = require("express")
const router = express.Router()
    // function
const {
    createNewVisa,
    deleteOneVisa,
    updateOneVisa,
    retriveOneVisa,
    retriveAllVisa
} = require("../controller/visa-controller")

router.get("/all", retriveAllVisa);
router.get("/one/:id", retriveOneVisa)
router.post("/create", createNewVisa)
router.put("/update/:id", updateOneVisa)
router.delete("/delete/:id", deleteOneVisa)

module.exports = router