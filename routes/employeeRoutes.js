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
  retriveStatus
} = require("../controller/employe-controller");


const verifyAccess = require("../middleware/verify-access")
router.get("/all/:id",/* verifyAccess, */ retriveAllEmployee);
router.get("/status/:id",/* verifyAccess, */ retriveStatus);
router.get("/one/:id",verifyAccess, retriveOneEmployee);
router.get("/one",verifyAccess, retriveOneEmployeeProfil);

router.post("/create", /* verifyAccess, */createNewEmployee);
router.put("/update/:id",verifyAccess, updateOneEmployee);
router.delete("/delete/:id",/* verifyAccess, */ deleteOneEmployee);

module.exports = router;
