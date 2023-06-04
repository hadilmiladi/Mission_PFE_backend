const express = require("express");
const router = express.Router();
// function
const {
retrieveInvoice,
retrieveAllInvoices
  
  } = require("../controller/invoice-controller");
  const verifyAccess = require("../middleware/verify-access")
  router.get("/one/:id",verifyAccess, retrieveInvoice);
  router.get("/all", retrieveAllInvoices);
  module.exports = router