const companyModel = require("../models/company/companyIndex.model");
const utils = require("../utils/utilsIndex");

const createInvoice = async (req, res) => {
  const companyId = req.user.companyId;

  try {
    const user = req.user;
    const {
      invoice_Customer,
      invoice_SalesPerson,
      invoice_Products,
      invoice_Details,
      invoice_InitialPayment,
      invoice_BeforeTaxPrice,
      invoice_TotalTax,
      invoice_AfterDiscountPrice,
      invoice_Subject,
      invoice_LeadId,
      invoice_Date,
      invoice_ExpiryDate,
      invoice_ReferenceNumber,
      invoice_TermsAndConditions
    } = req.body;

    const parsedInvoiceProducts = invoice_Products; 
    const invoice_Identifier = await utils.generateUniqueInvoiceId();

    const newInvoiceDetails = {
      dateCreated: new Date(),
      status: invoice_Details?.status || "Unpaid",
    };

    var invoice_ImagePath = "";
    if (req.file) {
      invoice_ImagePath = `/uploads/invoices/${req.file.filename}`;
    }

    // Save quote
    const newInvoice = await companyModel.Invoice.create({
      companyId,
      invoice_Customer,
      invoice_SalesPerson,
      invoice_Identifier,
      invoice_Subject,
      invoice_Creater: user.userId,
      invoice_Products: parsedInvoiceProducts, 
      invoice_BeforeTaxPrice,
      invoice_TotalTax,
      invoice_ReferenceNumber,
      invoice_AfterDiscountPrice,
      invoice_InitialPayment,
      invoice_Details: newInvoiceDetails,
      invoice_LeadId: invoice_LeadId || "",
      invoice_Date,
      invoice_ExpiryDate,
      invoice_Image: {
        filePath: invoice_ImagePath,
      },
      invoice_TermsAndConditions,
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Invoice created successfully",
      information: {
        newInvoice,
      },
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};

const getAllInvoices = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    // Fetch all invoices for the company
    const invoices = await companyModel.Invoice.find({ companyId, deleted: false });

    // If no invoices are found, return an empty array
    if (!invoices || invoices.length === 0) {
      return res.status(200).json({
        success: true,
        status: 200,
        message: "No invoices found",
        information: {
          invoices: [],
        },
      });
    }

    const invoicesWithCustomerDetails = await Promise.all(
      invoices.map(async (invoice) => {
        const customerId = invoice.invoice_Customer;

        let customer = null;

        // Skip the customer lookup if the customerId is empty or invalid
        if (customerId) {
          customer = await companyModel.Customer.findOne({
            _id: customerId,
            deleted: false,
          });
        }

        // Attach customer details to the invoice
        return {
          ...invoice._doc,
          invoice_CustomerDetails: customer || null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Invoice and customer details retrieved successfully",
      information: {
        invoices: invoicesWithCustomerDetails,
      },
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};



const getInvoiceById = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { invoiceId } = req.params;

    const invoice = await companyModel.Invoice.findOne({
      _id: invoiceId,
      companyId,
    });

    if (!invoice) {
      return res.status(404).json({
        success: true,
        status: 404,
        message: "No Invoice found",
        information: {
          invoice: [],
        },
      });
    }

    const customer = await companyModel.Customer.findById(invoice.invoice_Customer);

    // If invoice is found, return it in the response
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Invoice retrieved successfully",
      information: {
        invoice,
        customer,
      },
    });
  } catch (error) {
    console.error("Error fetching Invoice:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};

const setPaidInvoicebyId = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { invoiceId } = req.params;

    const invoice = await companyModel.Invoice.findOne({
      _id: invoiceId,
      companyId,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "No Invoice found",
        information: {
          invoice: [],
        },
      });
    }

    // Update the invoice status to "Paid"
    invoice.invoice_Details.status = "Paid";
    await invoice.save();

    // Return a success message with the updated invoice
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Invoice paid successfully",
      information: {
        invoice,
      },
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { invoiceId } = req.params;

    if (!invoiceId) {
      return res.status(400).json({
        success: false,
        message: "Please provide the invoice ID.",
      });
    }

    // Find the invoice by ID and mark it as deleted
    const invoice = await companyModel.Invoice.findById({
      companyId,
      _id: invoiceId,
    });
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found.",
      });
    }

    // Mark the invoice as deleted by updating the 'deleted' field to true
    await companyModel.Invoice.updateOne(
      { _id: invoiceId },
      { $set: { deleted: true } }
    );

    return res.status(200).json({
      success: true,
      message: "Invoice deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const EditInvoice = async (req, res) => {
  const companyId = req.user.companyId;
  try {
    const user = req.user;
    const { invoiceId } = req.params; // Invoice ID from request parameters
    const {
      invoice_Customer,
      invoice_SalesPerson,
      invoice_Products,
      invoice_Details,
      invoice_InitialPayment,
      invoice_BeforeTaxPrice,
      invoice_TotalTax,
      invoice_AfterDiscountPrice,
      invoice_Subject,
      invoice_Project,
      invoice_LeadId,
      invoice_Date,
      invoice_ExpiryDate,
      invoice_ReferenceNumber,
      invoice_TermsAndConditions,
    } = req.body;

    // Parse the invoice products if they are passed as a JSON string
    const parsedInvoiceProducts = JSON.parse(invoice_Products || "[]");

    // Handle uploaded image if a new image is provided
    let invoice_ImagePath = "";
    if (req.file) {
      invoice_ImagePath = `/uploads/invoices/${req.file.filename}`;
    }

    // Find the existing invoice
    const existingInvoice = await companyModel.Invoice.findById(invoiceId);
    if (!existingInvoice) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Invoice not found",
      });
    }

    // Update invoice details
    const updatedInvoice = await companyModel.Invoice.findByIdAndUpdate(
      invoiceId,
      {
        $set: {
          companyId,
          invoice_Customer: invoice_Customer || existingInvoice.invoice_Customer,
          invoice_SalesPerson:
            invoice_SalesPerson || existingInvoice.invoice_SalesPerson,
          invoice_Products:
            parsedInvoiceProducts.length > 0
              ? parsedInvoiceProducts
              : existingInvoice.invoice_Products,
          invoice_BeforeTaxPrice:
            invoice_BeforeTaxPrice || existingInvoice.invoice_BeforeTaxPrice,
          invoice_TotalTax: invoice_TotalTax || existingInvoice.invoice_TotalTax,
          invoice_AfterDiscountPrice:
            invoice_AfterDiscountPrice || existingInvoice.invoice_AfterDiscountPrice,
          invoice_InitialPayment:
            invoice_InitialPayment || existingInvoice.invoice_InitialPayment,
          invoice_Subject: invoice_Subject || existingInvoice.invoice_Subject,
          invoice_Project: invoice_Project || existingInvoice.invoice_Project,
          invoice_LeadId: invoice_LeadId || existingInvoice.invoice_LeadId,
          invoice_Date: invoice_Date || existingInvoice.invoice_Date,
          invoice_ExpiryDate: invoice_ExpiryDate || existingInvoice.invoice_ExpiryDate,
          invoice_ReferenceNumber:
            invoice_ReferenceNumber || existingInvoice.invoice_ReferenceNumber,
            invoice_TermsAndConditions:
            invoice_TermsAndConditions|| existingInvoice.invoice_TermsAndConditions,
          invoice_Details: {
            ...existingInvoice.invoice_Details,
            status:
              invoice_Details?.status || existingInvoice.invoice_Details?.status,
          },
          ...(invoice_ImagePath && {
            invoice_Image: { filePath: invoice_ImagePath },
          }), // Only update image if a new one is uploaded
        },
      },
      { new: true } // Return the updated document
    );

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Invoice updated successfully",
      information: {
        updatedInvoice,
      },
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};


const getSalesEmployeeInvoices = async (req, res) => {
  try {
    const { companyId, userId } = req.user;

    // Fetch department info for the user in the Sales department
    const department = await companyModel.Department.findOne({
      companyId,
      department_Name: "Sales",
      "department_Employees.userId": userId,
    });

    let invoices;

    if (department) {
      // Check if the user is a Team Lead in the Sales department
      const isTeamLead = department.department_Employees.some(
        (employee) =>
          employee.userId.toString() === userId.toString() &&
          employee.employee_Designation === "Team Lead"
      );

      if (isTeamLead) {
        // Fetch all invoices for the company if the user is a Team Lead
        invoices = await companyModel.Invoice.find({ companyId, deleted: false });
      } else {
        // Fetch only the invoices created by the user if they are not a Team Lead
        invoices = await companyModel.Invoice.find({
          companyId,
          deleted: false,
          invoice_Creater: userId,
        });
      }
    } else {
      // If the user is not in the Sales department, fetch only invoices that they created
      invoices = await companyModel.Invoice.find({
        companyId,
        deleted: false,
        invoice_Creater: userId,
      });
    }

    // Extract unique invoice creators to map names
    const invoiceCreators = [...new Set(invoices.map((invoice) => invoice.invoice_Creater))];

    // Fetch users for the invoice creators
    const users = await companyModel.User.find({
      userId: { $in: invoiceCreators },
    });

    // Create a map of user names for easy lookup
    const userMap = users.reduce((map, user) => {
      map[user.userId] = user.name;
      return map;
    }, {});

    // Map each invoice to include the creator's name
    const invoicesWithUserNames = invoices.map((invoice) => ({
      ...invoice._doc,
      invoice_CreaterName: userMap[invoice.invoice_Creater] || "Unknown",
    }));

    // Fetch customer details for each invoice and attach them to the invoice
    const invoicesWithCustomerDetails = await Promise.all(
      invoices.map(async (invoice) => {
        const customerId = invoice.invoice_Customer;

        let customer = null;

        // Skip the customer lookup if the customerId is empty or invalid
        if (customerId) {
          customer = await companyModel.Customer.findOne({
            _id: customerId,
            deleted: false,
          });
        }

        // Attach customer details to the invoice
        return {
          ...invoice._doc,
          invoice_CustomerDetails: customer || null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Invoices retrieved successfully",
      information: {
        invoices: invoicesWithCustomerDetails,
      },
    });
  } catch (error) {
    console.error("Error retrieving invoices:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};



const invoice = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  setPaidInvoicebyId,
  deleteInvoice,
  EditInvoice,
  getSalesEmployeeInvoices
};

module.exports = invoice;
