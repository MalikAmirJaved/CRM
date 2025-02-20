const express = require("express");
const companyModel = require("../models/company/companyIndex.model");
const utils = require("../utils/utilsIndex");

const createQuote = async (req, res) => {
  const companyId = req.user.companyId;

  try {
    const user = req.user;
    const {
      quote_Customer,
      quote_SalesPerson,
      quote_Products,
      quote_Details,
      quote_InitialPayment,
      quote_BeforeTaxPrice,
      quote_TotalTax,
      quote_AfterDiscountPrice,
      quote_Subject,
      quote_LeadId,
      quote_Date,
      quote_ExpiryDate,
      quote_ReferenceNumber,
      quote_TermsAndConditions
    } = req.body;

    const parsedQuoteProducts = JSON.parse(quote_Products);

    // Generate unique quote identifier
    const quote_Identifier = await utils.generateUniqueQuoteId();

    const newQuoteDetails = {
      dateCreated: new Date(),
      status: quote_Details?.status || "Pending",
    };

    var quote_ImagePath = "";
    if (req.file) {
      quote_ImagePath = `/uploads/quotes/${req.file.filename}`;
    }

    // Save quote
    const newQuote = await companyModel.Quote.create({
      companyId,
      quote_Customer,
      quote_SalesPerson,
      quote_Identifier,
      quote_Subject,
      quote_Creater: user.userId,
      quote_Products: parsedQuoteProducts, 
      quote_BeforeTaxPrice,
      quote_TotalTax,
      quote_ReferenceNumber,
      quote_AfterDiscountPrice,
      quote_InitialPayment,
      quote_Details: newQuoteDetails,
      quote_LeadId: quote_LeadId || "",
      quote_Date,
      quote_ExpiryDate,
      quote_TermsAndConditions,
      quote_Image: {
        filePath: quote_ImagePath,
      },
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Quote created successfully",
      information: {
        newQuote,
      },
    });
  } catch (error) {
    console.error("Error creating quote:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};

const EditQuote = async (req, res) => {
  const companyId = req.user.companyId;
  try {
    const user = req.user;
    const { quoteId } = req.params; // Quote ID from request parameters
    const {
      quote_Customer,
      quote_SalesPerson,
      quote_Products,
      quote_Details,
      quote_InitialPayment,
      quote_BeforeTaxPrice,
      quote_TotalTax,
      quote_AfterDiscountPrice,
      quote_Subject,
      quote_Project,
      quote_LeadId,
      quote_Date,
      quote_ExpiryDate,
      quote_ReferenceNumber,
      quote_TermsAndConditions
    } = req.body;

    // Parse the quote products if they are passed as a JSON string
    const parsedQuoteProducts = JSON.parse(quote_Products || "[]");

    // Handle uploaded image if a new image is provided
    let quote_ImagePath = "";
    if (req.file) {
      quote_ImagePath = `/uploads/quotes/${req.file.filename}`;
    }

    // Find the existing quote
    const existingQuote = await companyModel.Quote.findById(quoteId);
    if (!existingQuote) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Quote not found",
      });
    }

    // Update quote details
    const updatedQuote = await companyModel.Quote.findByIdAndUpdate(
      quoteId,
      {
        $set: {
          companyId,
          quote_Customer: quote_Customer || existingQuote.quote_Customer,
          quote_SalesPerson:
            quote_SalesPerson || existingQuote.quote_SalesPerson,
          quote_Products:
            parsedQuoteProducts.length > 0
              ? parsedQuoteProducts
              : existingQuote.quote_Products,
          quote_BeforeTaxPrice:
            quote_BeforeTaxPrice || existingQuote.quote_BeforeTaxPrice,
          quote_TotalTax: quote_TotalTax || existingQuote.quote_TotalTax,
          quote_AfterDiscountPrice:
            quote_AfterDiscountPrice || existingQuote.quote_AfterDiscountPrice,
          quote_InitialPayment:
            quote_InitialPayment || existingQuote.quote_InitialPayment,
          quote_Subject: quote_Subject || existingQuote.quote_Subject,
          quote_Project: quote_Project || existingQuote.quote_Project,
          quote_LeadId: quote_LeadId || existingQuote.quote_LeadId,
          quote_Date: quote_Date || existingQuote.quote_Date,
          quote_ExpiryDate: quote_ExpiryDate || existingQuote.quote_ExpiryDate,
          quote_ReferenceNumber:
            quote_ReferenceNumber || existingQuote.quote_ReferenceNumber,
            quote_TermsAndConditions:
            quote_TermsAndConditions|| existingQuote.quote_TermsAndConditions,
          quote_Details: {
            ...existingQuote.quote_Details,
            status:
              quote_Details?.status || existingQuote.quote_Details?.status,
          },
          ...(quote_ImagePath && {
            quote_Image: { filePath: quote_ImagePath },
          }), 
        },
      },
      { new: true } // Return the updated document
    );

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Quote updated successfully",
      information: {
        updatedQuote,
      },
    });
  } catch (error) {
    console.error("Error updating quote:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};

const getAllQuotes = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    // Fetch all quotes for the company
    const quotes = await companyModel.Quote.find({ companyId, deleted: false });

    // If no quotes are found, return an empty array
    if (!quotes || quotes.length === 0) {
      return res.status(200).json({
        success: true,
        status: 200,
        message: "No quotes found",
        information: {
          quotes: [],
        },
      });
    }

    // Fetch customer details for each quote and attach them to the quote
    const quotesWithCustomerDetails = await Promise.all(
      quotes.map(async (quote) => {
        const customerId = quote.quote_Customer;

        let customer = null;

        // Skip the customer lookup if the customerId is empty or invalid
        if (customerId) {
          customer = await companyModel.Customer.findOne({
            _id: customerId,
            deleted: false,
          });
        }

        // Attach customer details to the quote
        return {
          ...quote._doc,
          quote_CustomerDetails: customer || null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Quotes and customer details retrieved successfully",
      information: {
        quotes: quotesWithCustomerDetails,
      },
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};


const getQuoteById = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { quoteId } = req.params;

    // Fetch the quote by ID using findById
    const quote = await companyModel.Quote.findById(quoteId);
    const customer = await companyModel.Customer.findById(quote.quote_Customer);

    // If quote is found, return it in the response along with the customer
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Quote retrieved successfully",
      information: {
        quote,
        customer,
      },
    });
  } catch (error) {
    console.error("Error fetching Quote:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};

const approveQuoteById = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const user = req.user;
    const { quoteId } = req.params;

    
    const quote = await companyModel.Quote.findById({
      companyId,
      _id: quoteId,
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "No Quote found with this ID",
      });
    }

    // Ensure the quote is not already approved
    if (quote.quote_Details.status === "Approved") {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Quote has already been accepted.",
      });
    }

    // Approve the quote
    quote.quote_Details.status = "Approved";
    const updatedQuote = await quote.save();

    if (!updatedQuote) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: "Failed to update quote status",
      });
    }

    // Fetch the client associated with the quote's customer ID
    const client = await companyModel.Customer.findById(quote.quote_Customer);

    if (!client) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Client not found.",
      });
    }


    // Create the invoice using the quote data and include the client information
    const newInvoice = await companyModel.Invoice.create({
      companyId: companyId,
      invoice_Identifier: quote.quote_Identifier,
      invoice_Creater: quote.quote_Creater,
      invoice_Customer: quote.quote_Customer, 
      invoice_ReferenceNumber: quote.quote_ReferenceNumber, 
      invoice_SalesPerson: quote.quote_SalesPerson,
      invoice_Subject: quote.quote_Subject, 
      invoice_Products: quote.quote_Products, 
      invoice_BeforeTaxPrice: quote.quote_BeforeTaxPrice, 
      invoice_TotalTax: quote.quote_TotalTax, 
      invoice_AfterDiscountPrice: quote.quote_AfterDiscountPrice, 
      invoice_InitialPayment: quote.quote_InitialPayment, 
      invoice_QuoteId: quote._id, 
      invoice_QuoteId: quote.quote_LeadId || "", 
      invoice_Date: quote.quote_Date, 
      invoice_ExpiryDate: quote.quote_ExpiryDate, 
      invoice_DueDate: quote.quote_ExpiryDate, 
      invoice_Details: {
        status: "Unpaid", 
        dateCreated: Date.now(),
      },
    });

    // Update product stock quantities based on the invoice
    for (const item of newInvoice.invoice_Products) {
      const product = await companyModel.Product.findOne({
        product_Name: item.product,
        deleted: false,
      });

      if (product) {
        product.product_StockQuantity -= item.quantity;
        await product.save(); // Save updated product stock
      }
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Quote Approved and Invoice Created successfully",
      information: {
        quote: updatedQuote,
        invoice: newInvoice,
        client: client, // Include the client details in the response
      },
    });
  } catch (error) {
    console.error("Error in accepting quote:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message || "An error occurred while processing the quote.",
    });
  }
};


const deleteQuote = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { quoteId } = req.params;

    if (!quoteId) {
      return res.status(400).json({
        success: false,
        message: "Please provide the quote ID.",
      });
    }

    // Find the quote by ID and mark it as deleted
    const quote = await companyModel.Quote.findById({
      companyId,
      _id: quoteId,
    });
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found.",
      });
    }

    // Mark the quote as deleted by updating the 'deleted' field to true
    await companyModel.Quote.updateOne(
      { _id: quoteId },
      { $set: { deleted: true } }
    );

    return res.status(200).json({
      success: true,
      message: "Quote deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting quote:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getSalesEmployeeQuotes = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user.userId;

    // Fetch department info for the user in the Sales department
    const department = await companyModel.Department.findOne({
      companyId: companyId,
      department_Name: "Sales",
      "department_Employees.userId": userId,
    });

    let quotes;

    if (department) {
      // Check if the user is a Team Lead in the Sales department
      const isTeamLead = department.department_Employees.some(
        (employee) =>
          employee.userId.toString() === userId.toString() &&
          employee.employee_Designation === "Team Lead"
      );

      if (isTeamLead) {
        quotes = await companyModel.Quote.find({ companyId, deleted: false });
      } else {
        quotes = await companyModel.Quote.find({
          companyId,
          deleted: false,
          quote_Creater: userId,
        });
      }
    } else {
      // If the user is not in the Sales department, fetch only quotes that they created
      quotes = await companyModel.Quote.find({
        companyId,
        deleted: false,
        quote_Creater: userId,
      });
    }

    // Extract quote creators to map names
    const quoteCreators = quotes.map((quote) => quote.quote_Creater);

    // Fetch users for the quote creators
    const users = await companyModel.User.find({
      userId: { $in: quoteCreators },
    });

    // Create a map of user names for easy lookup
    const userMap = users.reduce((map, user) => {
      map[user.userId] = user.name;
      return map;
    }, {});

    // Map each quote to include the creator's name
    const quotesWithUserNames = quotes.map((quote) => ({
      ...quote._doc,
      quote_CreaterName: userMap[quote.quote_Creater] || "Unknown",
    }));
    // Fetch customer details for each quote and attach them to the quote
    const quotesWithCustomerDetails = await Promise.all(
      quotes.map(async (quote) => {
        const customerId = quote.quote_Customer;

        let customer = null;

        // Skip the customer lookup if the customerId is empty or invalid
        if (customerId) {
          customer = await companyModel.Customer.findOne({
            _id: customerId,
            deleted: false,
          });
        }

        // Attach customer details to the quote
        return {
          ...quote._doc,
          quote_CustomerDetails: customer || null,
        };
      })
    );
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Quotes retrieved successfully",
      information: {
        quotes: quotesWithCustomerDetails,

      },
    });
  } catch (error) {
    console.error("Error retrieving quotes:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};

const quote = {
  createQuote,
  EditQuote,
  getAllQuotes,
  getQuoteById,
  approveQuoteById,
  deleteQuote,
  getSalesEmployeeQuotes,

};

module.exports = quote;
