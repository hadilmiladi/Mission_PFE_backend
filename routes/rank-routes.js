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
const verifyAccess = require("../middleware/verify-access")
router.get("/all",verifyAccess, retriveAllRank);
router.get("/one/:id",verifyAccess, retriveOneRank)
router.post("/create", verifyAccess,createNewRank)
router.put("/update/:id",verifyAccess, updateOneRank)
router.delete("/delete/:id",verifyAccess, deleteOneRank)

module.exports = router