const express = require("express")
const router = express.Router()
    // function
const {
    createNewPassport,
    deleteOnePassport,
    updateOnePassport,
    retriveOnePassport,
    retriveAllPassport,
    retriveAllEmployeePassport
} = require("../controller/passport-controller")

const verifyAccess = require("../middleware/verify-access")
router.get("/all", retriveAllPassport);
router.get("/one/:id", retriveOnePassport)
router.get("/employee",verifyAccess, retriveAllEmployeePassport)
router.post("/create/:employeeId", createNewPassport)
router.put("/update/:id", updateOnePassport)
router.delete("/delete/:id", deleteOnePassport)

module.exports = router