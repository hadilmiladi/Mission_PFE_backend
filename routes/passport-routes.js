const express = require("express")
const router = express.Router()
    // function
const {
    createNewPassport,
    deleteOnePassport,
    updateOnePassport,
    retriveOnePassport,
    retriveAllPassport
} = require("../controller/passport-controller")

router.get("/all", retriveAllPassport);
router.get("/one/:id", retriveOnePassport)
router.post("/create/:employeeId", createNewPassport)
router.put("/update/:id", updateOnePassport)
router.delete("/delete/:id", deleteOnePassport)

module.exports = router