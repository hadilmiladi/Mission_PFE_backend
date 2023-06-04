const express = require("express")
const router = express.Router()
    // function
const {
    createNewVisa,
    deleteOneVisa,
    updateOneVisa,
    retriveOneVisa,
    retriveAllVisa,
    retriveAllPassportVisa
} = require("../controller/visa-controller")
const verifyAccess = require("../middleware/verify-access")
router.get("/all",verifyAccess, retriveAllVisa);
router.get("/one/:id",verifyAccess, retriveOneVisa)
router.get("/passport/:passportId",verifyAccess, retriveAllPassportVisa);
router.post("/create/:employeeId", createNewVisa)
router.put("/update/:id", verifyAccess,updateOneVisa)
router.delete("/delete/:id", deleteOneVisa)

module.exports = router