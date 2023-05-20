const express = require("express")
const router = express.Router()
    // function
const {
    createNewEmployee,
    deleteOneEmployee,
    updateOneEmployee,
    retriveOneEmployee,
    retriveAllEmployee
} = require("../controller/employe-controller")

router.get("/all", retriveAllEmployee);
router.get("/one/:id", retriveOneEmployee)
router.post("/create", createNewEmployee)
router.put("/update/:id", updateOneEmployee)
router.delete("/delete/:id", deleteOneEmployee)

module.exports = router