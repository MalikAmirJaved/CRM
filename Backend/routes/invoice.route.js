const express = require("express");
const router = express.Router();
const controller = require("../controllers/index.controller");
const upload = require("../config/multer");
const passport = require("../middleware/passportAuth.middleware");
const middleware = require("../middleware/index.middleware");

router.post(
  "/create-invoice",
  passport.authenticate("jwt", { session: false }),
  middleware.checkPermission("create"),
  controller.invoice.createInvoice
);

router.get(
  "/get-invoices",
  passport.authenticate("jwt", { session: false }),
  middleware.checkPermission("read"),
  controller.invoice.getAllInvoices
);

 router.get(
  "/get-sales-employee-invoices", 
  passport.authenticate("jwt", { session: false }),
  middleware.checkPermission("read"),
  controller.invoice.getSalesEmployeeInvoices
);

router.get(
  "/:invoiceId",
  passport.authenticate("jwt", { session: false }),
  middleware.checkPermission("read"),
  controller.invoice.getInvoiceById
);

router.patch(
  "/set-paid/:invoiceId",
  passport.authenticate("jwt", { session: false }),
  middleware.checkPermission("update"),
  controller.invoice.setPaidInvoicebyId
);

router.delete(
  "/delete/:invoiceId",
  passport.authenticate("jwt", { session: false }),
  middleware.checkPermission("delete"),
  controller.invoice.deleteInvoice
);

router.patch(
  "/edit-invoice/:invoiceId",
  passport.authenticate("jwt", { session: false }),
  middleware.checkPermission("create"),
  upload.single("invoice_Image"),
  controller.invoice.EditInvoice
);


module.exports = router;
