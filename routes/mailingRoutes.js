const express = require("express");
const router = express.Router();
// function
const {
    createAnEmail,
    update,
    deleteconfig,
    getAll
}=require('../controller/mailing-controller')

router.post('/createConfigmail',createAnEmail)
router.delete('/delete',deleteconfig)
router.put('/update',update)
router.get('/all',getAll)
module.exports=router;