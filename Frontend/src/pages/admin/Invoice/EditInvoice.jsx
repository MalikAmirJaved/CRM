import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaHashtag,
  FaUserTie,
  FaCalendarAlt,
  FaPercentage,
  FaFileAlt,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_URL;
const jwtLoginToken = localStorage.getItem("jwtLoginToken");
const TAX = 0.05;

const EditInvoice = () => {
    const { user } = useSelector((state) => state.auth); // Access the logged-in user from Redux
  const { invoiceId } = useParams();
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [invoice, setFetchedInvoice] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [productRows, setProductRows] = useState([
    {
      product: "",
      quantity: 0,
      product_SellingPrice: 0,
      product_BeforeTaxPrice: 0,
      product_Tax: 0,
      product_AfterTaxPrice: 0,
      product_DiscountPercentage: 0,
      product_Discount: 0,
      product_AfterDiscountPrice: 0,
    },
  ]);
  const [salesEmployees, setSalesEmployees] = useState([]);
  const [invoicePayload, setInvoicePayload] = useState({
    invoice_Customer: "",
    invoice_Products: [],
    invoice_SalesPerson: "",
    invoice_InitialPayment: "",
    invoice_BeforeTaxPrice: 0,
    invoice_TotalTax: 0,
    invoice_AfterDiscountPrice: 0,
    invoice_Subject: "",
    invoice_Image: null,
    previewUrl: null,
    invoice_Project: "",
    invoice_Date: "",
    invoice_ExpiryDate: "",
    invoice_ReferenceNumber: "",
   invoice_TermsAndConditions:""

  });
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/product/get-products`, {
        headers: { Authorization: `Bearer ${jwtLoginToken}` },
      });

      if (response.data.success) {
        setFetchedProducts(response.data.information.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchSalesEmployees = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/department/get-sales-employees`,
        {
          headers: { Authorization: `Bearer ${jwtLoginToken}` },
        }
      );
      if (response.data.success && response.data.information?.users) {
        setSalesEmployees(response.data.information.users);
      }
    } catch (err) {
      console.error("Error fetching sales employees:", err);
    }
  };

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(`${API_URL}/invoice/${invoiceId}`, {
        headers: { Authorization: `Bearer ${jwtLoginToken}` },
      });

      if (response.data.success && response.data.information?.invoice) {
        setFetchedInvoice(response.data.information.invoice);
        setCustomer(response.data.information.customer);
        var invoice = response.data.information.invoice;
        setProductRows(invoice.invoice_Products);
        setInvoicePayload((prevPayload) => ({
          invoice_Customer: invoice.invoice_Customer,
          invoice_SalesPerson: invoice.invoice_SalesPerson,
          invoice_InitialPayment: invoice.invoice_InitialPayment,
          invoice_BeforeTaxPrice: invoice.invoice_BeforeTaxPrice,
          invoice_TotalTax: invoice.invoice_TotalTax,
          invoice_AfterDiscountPrice: invoice.invoice_AfterDiscountPrice,
          invoice_Subject: invoice.invoice_Subject,
          invoice_Image: invoice.invoice_Image,
          invoice_Project: invoice.invoice_Project,
          invoice_Date: invoice.invoice_Date,
          invoice_ExpiryDate: invoice.invoice_ExpiryDate,
          invoice_ReferenceNumber: invoice.invoice_ReferenceNumber,
          invoice_TermsAndConditions: invoice.invoice_TermsAndConditions,

        }));
      }
    } catch (err) {
      console.error("Error fetching sales employees:", err);
    }
  };

  useEffect(() => {
    fetchInvoice();
    fetchProducts();
    fetchSalesEmployees();
  }, []);

  useEffect(() => {
    updateInvoiceSummary();
  }, [productRows]);

  const calculateRowValues = (row) => {
    const product_BeforeTaxPrice = row.quantity * row.product_SellingPrice;
    const product_Tax = product_BeforeTaxPrice * TAX; // 5% Tax
    const product_AfterTaxPrice = product_BeforeTaxPrice + product_Tax;
    const product_Discount =
      (product_AfterTaxPrice * row.product_DiscountPercentage) / 100;
    const product_AfterDiscountPrice = product_AfterTaxPrice - product_Discount;

    return {
      ...row,
      product_BeforeTaxPrice,
      product_Tax,
      product_AfterTaxPrice,
      product_Discount,
      product_AfterDiscountPrice,
    };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInvoicePayload((prevPayload) => ({
      ...prevPayload,
      invoice_Image: file,
    }));
  };

  const handleProductChange = (index, productName) => {
    const product = fetchedProducts.find(
      (prod) => prod.product_Name === productName
    );
    const newRows = [...productRows];
    newRows[index] = calculateRowValues({
      ...newRows[index],
      product: productName,
      product_SellingPrice: product ? product.product_SellingPrice : 0,
    });
    setProductRows(newRows);
  };

  const handleRateChange = (index, rate) => {
    const newRows = [...productRows];
    newRows[index].product_SellingPrice =
      isNaN(rate) || rate === "" ? 0 : Number(rate); // Allow empty input temporarily
    newRows[index] = calculateRowValues({
      ...newRows[index],
      product_SellingPrice: newRows[index].product_SellingPrice,
    });
    setProductRows(newRows);
  };

  const handleQuantityChange = (index, quantity) => {
    const newRows = [...productRows];
    newRows[index].quantity =
      isNaN(quantity) || quantity === "" ? 0 : Number(quantity); // Allow empty input temporarily
    newRows[index] = calculateRowValues({
      ...newRows[index],
      quantity: newRows[index].quantity,
    });
    setProductRows(newRows);
  };

  const handleDiscountChange = (index, discountPercentage) => {
    const newRows = [...productRows];
    newRows[index].product_DiscountPercentage =
      isNaN(discountPercentage) || discountPercentage === ""
        ? 0
        : Number(discountPercentage); // Allow empty input temporarily
    newRows[index] = calculateRowValues({
      ...newRows[index],
      product_DiscountPercentage: newRows[index].product_DiscountPercentage,
    });
    setProductRows(newRows);
  };

  const addRow = () => {
    setProductRows([
      ...productRows,
      {
        product: "",
        quantity: 0,
        product_SellingPrice: 0,
        product_BeforeTaxPrice: 0,
        product_Tax: 0,
        product_AfterTaxPrice: 0,
        product_DiscountPercentage: 0,
        product_Discount: 0,
        product_AfterDiscountPrice: 0,
      },
    ]);
  };

  const deleteRow = (index) => {
    const newRows = productRows.filter((_, i) => i !== index);
    setProductRows(newRows);
  };

  const updateInvoiceSummary = () => {
    const totalBeforeTax = productRows.reduce(
      (sum, row) => sum + row.product_BeforeTaxPrice,
      0
    );
    const totalTax = productRows.reduce((sum, row) => sum + row.product_Tax, 0);
    const totalAfterDiscount = productRows.reduce(
      (sum, row) => sum + row.product_AfterDiscountPrice,
      0
    );

    setInvoicePayload((prevPayload) => ({
      ...prevPayload,
      invoice_BeforeTaxPrice: totalBeforeTax,
      invoice_TotalTax: totalTax,
      invoice_AfterDiscountPrice: totalAfterDiscount,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const products = productRows.map((row) => ({
      product: row.product,
      quantity: row.quantity,
      product_SellingPrice: row.product_SellingPrice,
      product_BeforeTaxPrice: row.product_BeforeTaxPrice,
      product_Tax: row.product_Tax,
      product_AfterTaxPrice: row.product_AfterTaxPrice,
      product_DiscountPercentage: row.product_DiscountPercentage,
      product_Discount: row.product_Discount,
      product_AfterDiscountPrice: row.product_AfterDiscountPrice,
    }));

    const formData = new FormData();
    formData.append("invoice_Customer", invoicePayload.invoice_Customer);
    formData.append("invoice_Products", JSON.stringify(products));
    formData.append("invoice_SalesPerson", invoicePayload.invoice_SalesPerson);
    formData.append("invoice_InitialPayment", invoicePayload.invoice_InitialPayment);
    formData.append("invoice_BeforeTaxPrice", invoicePayload.invoice_BeforeTaxPrice);
    formData.append("invoice_TotalTax", invoicePayload.invoice_TotalTax);
    formData.append(
      "invoice_AfterDiscountPrice",
      invoicePayload.invoice_AfterDiscountPrice
    );
    formData.append("invoice_Subject", invoicePayload.invoice_Subject);
    formData.append("invoice_Image", invoicePayload.invoice_Image);
    formData.append("previewUrl", invoicePayload.previewUrl); // Image file
    formData.append("invoice_Project", invoicePayload.invoice_Project);
    formData.append("invoice_Date", invoicePayload.invoice_Date);
    formData.append("invoice_ExpiryDate", invoicePayload.invoice_ExpiryDate);
    formData.append(
      "invoice_ReferenceNumber",
      invoicePayload.invoice_ReferenceNumber
    );
    formData.append(
      "invoice_TermsAndConditions",
      invoicePayload.invoice_TermsAndConditions
    );
    try {
      const response = await axios.patch(
        `${API_URL}/invoice/edit-invoice/${invoiceId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwtLoginToken}`,
          },
        }
      );
      navigate("/invoices");
      if (response.data.success) {
        // Reset invoicePayload and productRows to their default states
        setInvoicePayload({
          invoice_Customer: "",
          invoice_Products: [], // This will be reset in the form
          invoice_SalesPerson: "",
          invoice_InitialPayment: "",
          invoice_BeforeTaxPrice: 0,
          invoice_TotalTax: 0,
          invoice_AfterDiscountPrice: 0,
          invoice_Subject: "",
          invoice_Project: "",
          invoice_Image: null,
          previewUrl: null,
          invoice_Date: "",
          invoice_ExpiryDate: "",
          invoice_ReferenceNumber: "",
          invoice_TermsAndConditions:"",
        });

        setProductRows([
          {
            product: "",
            quantity: 0,
            product_SellingPrice: 0,
            product_BeforeTaxPrice: 0,
            product_Tax: 0,
            product_AfterTaxPrice: 0,
            product_DiscountPercentage: 0,
            product_Discount: 0,
            product_AfterDiscountPrice: 0,
          },
        ]);

        alert("Invoice Edited");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
    <h1 className="text-2xl font-bold mb-4">Edit Invoice</h1>

      <div className="mb-6 w-1/2">
        <label
          className="block text-sm font-medium text-gray-700   mb-1"
          htmlFor="customerName"
        >
          <FaUser className="inline-block mr-2" /> Customer Name
        </label>
        <div className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          {customer && customer.customer_GeneralDetails.customer_DisplayName}
        </div>
      </div>

      {/* Reference */}
      <div className="mb-6 w-1/4">
        <label
          className="block text-sm font-medium text-gray-700   mb-1"
          htmlFor="reference"
        >
          <FaHashtag className="inline-block mr-2" /> Reference
        </label>
        <div className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          {invoice && invoice.invoice_ReferenceNumber}
        </div>
      </div>

      {/* Sales Person */}
      <div className="mb-6 w-1/4">
        <label
          className="block text-sm font-medium text-gray-700   mb-1"
          htmlFor="salesPerson"
        >
          <FaUserTie className="inline-block mr-2" /> Salesperson
        </label>
        <input
  type="text"
  id="salesPerson"
  value={invoicePayload.invoice_SalesPerson} 
  readOnly 
  className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100"
  placeholder="Salesperson Name"
/>

      </div>

      {/* invoice Dates */}
      <div className="flex space-x-4 mb-6 w-1/4">
        <div className="flex-1">
          <label
            className="block text-sm font-medium text-gray-700   mb-1"
            htmlFor="invoiceDate"
          >
            <FaCalendarAlt className="inline-block mr-2" /> Invoice Date
          </label>
          <input
            type="date"
            id="invoiceDate"
            value={invoicePayload.invoice_Date}
            onChange={(e) =>
              setInvoicePayload((prevPayload) => ({
                ...prevPayload,
                invoice_Date: e.target.value,
              }))
            }
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex-1">
          <label
            className="block text-sm font-medium text-gray-700   mb-1"
            htmlFor="expiryDate"
          >
            <FaCalendarAlt className="inline-block mr-2" /> Expiry Date
          </label>
          <input
            type="date"
            id="expiryDate"
            value={invoicePayload.invoice_ExpiryDate}
            onChange={(e) =>
              setInvoicePayload((prevPayload) => ({
                ...prevPayload,
                invoice_ExpiryDate: e.target.value,
              }))
            }
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Invoice Initial Payment */}
      <div className="mb-6 w-1/4">
        <label
          className="block text-sm font-medium text-gray-700   mb-1"
          htmlFor="initialPayment"
        >
          <FaPercentage className="inline-block mr-2" /> Initial Payment (%)
        </label>
        <input
          type="text"
          id="initialPayment"
          value={invoicePayload.invoice_InitialPayment}
          onChange={(e) =>
            setInvoicePayload((prevPayload) => ({
              ...prevPayload,
              invoice_InitialPayment: e.target.value,
            }))
          }
          placeholder="Enter Initial Payment"
          className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Subject */}
      <div className="mb-6 w-1/4">
        <label
          className="block text-sm font-medium text-gray-700   mb-1"
          htmlFor="subject"
        >
          <FaFileAlt className="inline-block mr-2" /> Subject
        </label>
        <input
          type="text"
          id="subject"
          value={invoicePayload.invoice_Subject}
          onChange={(e) =>
            setInvoicePayload((prevPayload) => ({
              ...prevPayload,
              invoice_Subject: e.target.value,
            }))
          }
          placeholder="Enter subject"
          className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Products Table */}
      <h1 className="text-xl font-bold mb-4">Item Table</h1>
      <table className="w-full table-auto border border-gray-300 rounded-md">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border border-gray-300 px-4 py-2">
              Item Description
            </th>
            <th className="border border-gray-300 px-4 py-2">Qty</th>
            <th className="border border-gray-300 px-4 py-2">Rate</th>
            <th className="border border-gray-300 px-4 py-2">Discount (%)</th>
            <th className="border border-gray-300 px-4 py-2">Tax</th>
            <th className="border border-gray-300 px-4 py-2">Amount</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {productRows.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 flex items-center">
                <input
                  type="text"
                  value={row.product}
                  onChange={(e) => handleProductChange(index, e.target.value)}
                  placeholder="Type or select a product"
                  className="w-full border border-gray-300 rounded-md px-2 py-1 mr-2"
                />
                <select
                  value={row.product}
                  onChange={(e) => handleProductChange(index, e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value="">Select Item</option>
                  {fetchedProducts.map((product) => (
                    <option key={product.id} value={product.product_Name}>
                      {product.product_Name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  value={row.quantity === 0 ? "" : row.quantity} // Display empty if 0
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2 py-1"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  value={
                    row.product_SellingPrice === 0
                      ? ""
                      : row.product_SellingPrice
                  } // Hide 0 value temporarily
                  onChange={(e) =>
                    handleRateChange(index, Number(e.target.value))
                  }
                  className="w-full border border-gray-300 rounded-md px-2 py-1"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  value={
                    row.product_DiscountPercentage === 0
                      ? ""
                      : row.product_DiscountPercentage
                  } // Hide 0 value temporarily
                  onChange={(e) =>
                    handleDiscountChange(index, Number(e.target.value))
                  }
                  className="w-full border border-gray-300 rounded-md px-2 py-1"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                5%
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {row.product_AfterDiscountPrice.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => deleteRow(index)}
                  type="button"
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={addRow}
        className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600"
      >
        Add Row
      </button>

      <div className="mt-6">
  <h1 className="text-xl font-bold mb-4">Terms & Conditions</h1>
  <textarea
    value={invoicePayload.invoice_TermsAndConditions} 
    onChange={(e) =>
      setInvoicePayload((prev) => ({
        ...prev,
        invoice_TermsAndConditions: e.target.value, // Update the state with the new input
      }))
    }
    placeholder="Edit Terms and Conditions"
    rows={6}
    className="w-1/2 border border-gray-300 rounded-md p-2"
  />
</div>


<div className="mt-10 justify-between">
      <h1 className="text-xl font-bold mb-4">Upload Invoice</h1>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-1/3 p-2 border rounded-lg bg-gray-50"
        />
        
        <footer className="mt-4 text-white ">
  <div className="container mx-auto flex  justify-end">
    <button
      type="submit" // This should remain as type="submit"
      onClick={handleSubmit}
      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-500"
    >
      Submit
    </button>
  </div>
</footer>
        </div>
    </form>
  );
};

export default EditInvoice;
