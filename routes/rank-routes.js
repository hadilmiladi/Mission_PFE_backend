const express = require("express")
const router = express.Router()
    // function
const {
    createNewRank,
    deleteOneRank,
    updateOneRank,
    retriveOneRank,
    retriveAllRank
} = require("../controller/rank-controller")

router.get("/all", retriveAllRank);
router.get("/one/:id", retriveOneRank)
router.post("/create", createNewRank)
router.put("/update/:id", updateOneRank)
router.delete("/delete/:id", deleteOneRank)

module.exports = router