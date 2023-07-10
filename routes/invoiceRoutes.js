const express = require("express");
const router = express.Router();
// function
const {
retrieveInvoice,
retrieveAllInvoices,
retrieveInvoices,
deleteOneInvoice
//createGlobalInvoice
  
  } = require("../controller/invoice-controller");
  const verifyAccess = require("../middleware/verify-access")
  router.get("/one/:id",/* verifyAccess, */ retrieveInvoice);
  router.get("/all",/* , verifyAccess, */retrieveAllInvoices);
  router.get("/mini", verifyAccess,retrieveInvoices);
  router.delete("/delete/:id",deleteOneInvoice);
  //router.post("/create",verifyAccess,createGlobalInvoice)

  module.exports = router