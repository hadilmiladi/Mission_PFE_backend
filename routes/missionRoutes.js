const express = require("express");
const router = express.Router();
// function
const {
  createNewMission,
  deleteOneMission,
  updateOneMission,
  retriveOneMission,
  retriveAllMission,
  retriveAllEmployeeMissions,
  setMissionStatus,
} = require("../controller/mission-controller");
const verifyAccess = require("../middleware/verify-access")
router.get("/all",/* verifyAccess, */ retriveAllMission);
router.get("/employee/:id",verifyAccess, retriveAllEmployeeMissions);
router.get("/one/:id",verifyAccess, retriveOneMission);
router.post("/create",verifyAccess, createNewMission);
router.put("/update/:id",verifyAccess, updateOneMission);
router.put("/status/set/:id",verifyAccess, setMissionStatus);
router.delete("/delete/:id", deleteOneMission);

module.exports = router;
