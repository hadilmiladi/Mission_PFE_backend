const express = require("express")
const router = express.Router()
    // function
const {
    createNewMission,
    deleteOneMission,
    updateOneMission,
    retriveOneMission,
    retriveAllMission,setMissionStatus
} = require("../controller/mission-controller")

router.get("/all", retriveAllMission);
router.get("/one/:id", retriveOneMission)
router.post("/create", createNewMission)
router.put("/update/:id", updateOneMission)
router.put("/set/status/:id", setMissionStatus)
router.delete("/delete/:id", deleteOneMission)

module.exports = router