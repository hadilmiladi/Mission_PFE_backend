const express = require("express")
const router = express.Router()
const login= require("../controller/LoginController")


router.get('/:email', login.loginEmployee)

module.exports= router