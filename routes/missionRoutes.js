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

router.get("/all", retriveAllMission);
router.get("/employee/:id", retriveAllEmployeeMissions);
router.get("/one/:id", retriveOneMission);
router.post("/create", createNewMission);
router.put("/update/:id", updateOneMission);
router.put("/status/set/:id", setMissionStatus);
router.delete("/delete/:id", deleteOneMission);

module.exports = router;
