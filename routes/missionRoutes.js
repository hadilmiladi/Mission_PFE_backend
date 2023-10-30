const express = require("express");
const router = express.Router();
//const { sendMissionGmail, sendMissionOutlook} = require ('../controller/sendMission');
// function
const {
  createNewMission,
  deleteOneMission,
  updateOneMission,
  retriveOneMission,
  retriveAllMission,
  retriveAllEmployeeMissions,
  setMissionStatus,
  retriveEmployeeMissions,
  createMissionByEmployee,
  deleteallMission,
  retriveAll,
  createChefMission,

} = require("../controller/mission-controller");
const verifyAccess = require("../middleware/verify-access")
router.get("/all/:id",verifyAccess, retriveAllMission);
router.get("/all",verifyAccess, retriveAll);
router.get("/employee/:id",verifyAccess, retriveAllEmployeeMissions);
//router.get("/employee",verifyAccess, retriveEmployeeMissions);
router.get("/one/:id", retriveOneMission);
router.post("/create",verifyAccess, createNewMission);
router.post("/createbychef/:id",verifyAccess, createChefMission);
router.post("/create/employee/:id",verifyAccess, createMissionByEmployee);
router.put("/update/:id",verifyAccess, updateOneMission);
router.put("/status/set/:id",verifyAccess, setMissionStatus);
router.delete("/delete/:id", verifyAccess,deleteOneMission);
router.delete("/delete", verifyAccess,deleteallMission);

module.exports = router;
