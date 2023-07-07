const express = require("express");
const router = express.Router();
const {sendMail} = require ("../controller/sendmail") 
// function
const {
    createGlobalInvoice,
    retrieveAllGlobalInvoices,
    deleteOneglobalInvoice,
    retrieveInvoicesByGlobalInvoice,
    retrieveGlobalInvoiceById
  
  } = require("../controller/globalinvoice-controller");
  const verifyAccess = require("../middleware/verify-access")
  router.post("/create",/* verifyAccess, */createGlobalInvoice)
  router.get("/all",/* verifyAccess, */retrieveAllGlobalInvoices)
  router.delete("/:id",/* verifyAccess, */deleteOneglobalInvoice)
  router.get('/invoices/:id',retrieveInvoicesByGlobalInvoice)
  router.post('/global/:id',retrieveGlobalInvoiceById)
  router.post("/sendmail", sendMail)
  module.exports = router