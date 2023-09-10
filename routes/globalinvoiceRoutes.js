const express = require("express");
const router = express.Router();
const { sendMailGmail, sendMailOutlook} = require ("../controller/sendmail") 
// function
const {
    createGlobalInvoice,
    retrieveAllGlobalInvoices,
    deleteOneglobalInvoice,
    retrieveInvoicesByGlobalInvoice,
    retrieveGlobalInvoiceById,
    retrieveGlobalInvoiceDetails,
    setPaid,
    updateDeadLine
  
  } = require("../controller/globalinvoice-controller");
  const verifyAccess = require("../middleware/verify-access")
  router.post("/create",/* verifyAccess, */createGlobalInvoice)
  router.get("/all",/* verifyAccess, */retrieveAllGlobalInvoices)
  router.delete("/:id",/* verifyAccess, */deleteOneglobalInvoice)
  router.get('/invoices/:id',retrieveInvoicesByGlobalInvoice)
  router.post('/global/:id',retrieveGlobalInvoiceById)
  router.get('/global/:id',retrieveGlobalInvoiceDetails)
  router.put('/set/:id',setPaid)
  router.put('/deadline',updateDeadLine)
  router.post("/sendmail", sendMailGmail)
  router.post("/sendmail", sendMailOutlook)
  module.exports = router