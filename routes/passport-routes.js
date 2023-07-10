const express = require("express")
const router = express.Router()
    // function
const {
    createNewPassport,
    deleteOnePassport,
    updateOnePassport,
    retriveOnePassport,
    retriveAllPassport,
    retriveAllEmployeePassport,
    createPassportByAdmin
} = require("../controller/passport-controller")

const verifyAccess = require("../middleware/verify-access")
router.get("/all",/* verifyAccess, */ retriveAllPassport);
router.get("/one/:id",/* verifyAccess, */ retriveOnePassport)
router.get("/employee",verifyAccess, retriveAllEmployeePassport)
router.post("/create",verifyAccess, createNewPassport)
router.post("/create/:id",verifyAccess, createPassportByAdmin)
router.put("/update/:id",verifyAccess, updateOnePassport)
router.delete("/delete/:id",/* verifyAccess, */ deleteOnePassport)

module.exports = router