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
  retriveStatus,
  retriveEmployeeName,
  retriveAll,
  deleteall

} = require("../controller/employe-controller");


const verifyAccess = require("../middleware/verify-access")
router.post("/create", verifyAccess,createNewEmployee);
router.put("/update/:id",verifyAccess, updateOneEmployee);
router.get("/one/:id",/* verifyAccess, */ retriveOneEmployee);
router.get("/all",verifyAccess, retriveAllEmployee);
router.get("/allall",verifyAccess, retriveAll);
router.get("/status/:id",/* verifyAccess, */ retriveStatus);
router.get("/one",/* verifyAccess, */ retriveOneEmployeeProfil);
router.delete("/delete/:id",verifyAccess, deleteOneEmployee);
router.delete("/delete/:id",verifyAccess, deleteall);
router.get("/name/:id",/* verifyAccess, */ retriveEmployeeName);

module.exports = router;
