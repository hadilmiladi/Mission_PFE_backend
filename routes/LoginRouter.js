const express = require("express")
const router = express.Router()
const login= require("../controller/LoginController")

/* const verifyAccess = require("../middleware/verify-access") */
router.get('/:email',/* verifyAccess , */login.loginEmployee)

module.exports= router