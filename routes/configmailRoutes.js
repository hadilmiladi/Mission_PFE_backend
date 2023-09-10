const express = require("express");
const router = express.Router();
// function
const {
    createAnEmail,
    update,
    deleteconfig
}=require('../controller/sendmail')

router.post('/createConfigmail',createAnEmail)
router.delete('/delete',deleteconfig)
router.put('/update',update)

module.exports=router;