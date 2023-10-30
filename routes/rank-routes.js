const express = require("express")
const router = express.Router()
    // function
const {
    createNewRank,
    deleteOneRank,
    updateOneRank,
    /* retriveOneRank, */
    retriveAllRank,
} = require("../controller/rank-controller")
const verifyAccess = require("../middleware/verify-access")
router.get("/all",verifyAccess, retriveAllRank);
router.post("/create", verifyAccess,createNewRank)
router.delete("/delete/:id",verifyAccess, deleteOneRank)
router.put("/update/:id",verifyAccess, updateOneRank)

/* router.get("/one/:id",verifyAccess, retriveOneRank) */




module.exports = router