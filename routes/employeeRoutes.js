const express = require("express");
const router = express.Router();
// function
const {
  createNewEmployee,
  deleteOneEmployee,
  updateOneEmployee,
  retriveOneEmployee,
  retriveOneEmployeeProfil,
  retriveAllEmployee,
} = require("../controller/employe-controller");


const verifyAccess = require("../middleware/verify-access")
router.get("/all", retriveAllEmployee);
router.get("/one/:id",verifyAccess, retriveOneEmployee);
router.get("/one",verifyAccess, retriveOneEmployeeProfil);

router.post("/create", createNewEmployee);
router.put("/update/:id",verifyAccess, updateOneEmployee);
router.delete("/delete/:id", deleteOneEmployee);

module.exports = router;
