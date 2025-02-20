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

const EditQuote = () => {
    const { user } = useSelector((state) => state.auth); // Access the logged-in user from Redux
  const { quoteId } = useParams();
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [quote, setFetchedQuote] = useState(null);
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
  const [quotePayload, setQuotePayload] = useState({
    quote_Customer: "",
    quote_Products: [],
    quote_SalesPerson: "",
    quote_InitialPayment: "",
    quote_BeforeTaxPrice: 0,
    quote_TotalTax: 0,
    quote_AfterDiscountPrice: 0,
    quote_Subject: "",
    quote_Image: null,
    previewUrl: null,
    quote_Project: "",
    quote_Date: "",
    quote_ExpiryDate: "",
    quote_ReferenceNumber: "",
    quote_TermsAndConditions:""
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

  const fetchQuote = async () => {
    try {
      const response = await axios.get(`${API_URL}/quote/${quoteId}`, {
        headers: { Authorization: `Bearer ${jwtLoginToken}` },
      });

      if (response.data.success && response.data.information?.quote) {
        setFetchedQuote(response.data.information.quote);
        setCustomer(response.data.information.customer);
        var quote = response.data.information.quote;
        setProductRows(quote.quote_Products);
        setQuotePayload((prevPayload) => ({
          quote_Customer: quote.quote_Customer,
          quote_SalesPerson: quote.quote_SalesPerson,
          quote_InitialPayment: quote.quote_InitialPayment,
          quote_BeforeTaxPrice: quote.quote_BeforeTaxPrice,
          quote_TotalTax: quote.quote_TotalTax,
          quote_AfterDiscountPrice: quote.quote_AfterDiscountPrice,
          quote_Subject: quote.quote_Subject,
          quote_Image: quote.quote_Image,
          quote_Project: quote.quote_Project,
          quote_Date: quote.quote_Date,
          quote_ExpiryDate: quote.quote_ExpiryDate,
          quote_ReferenceNumber: quote.quote_ReferenceNumber,
          quote_TermsAndConditions: quote.quote_TermsAndConditions
        }));
      }
    } catch (err) {
      console.error("Error fetching sales employees:", err);
    }
  };

  useEffect(() => {
    fetchQuote();
    fetchProducts();
    fetchSalesEmployees();
  }, []);

  useEffect(() => {
    updateQuoteSummary();
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
    setQuotePayload((prevPayload) => ({
      ...prevPayload,
      quote_Image: file,
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

  const updateQuoteSummary = () => {
    const totalBeforeTax = productRows.reduce(
      (sum, row) => sum + row.product_BeforeTaxPrice,
      0
    );
    const totalTax = productRows.reduce((sum, row) => sum + row.product_Tax, 0);
    const totalAfterDiscount = productRows.reduce(
      (sum, row) => sum + row.product_AfterDiscountPrice,
      0
    );

    setQuotePayload((prevPayload) => ({
      ...prevPayload,
      quote_BeforeTaxPrice: totalBeforeTax,
      quote_TotalTax: totalTax,
      quote_AfterDiscountPrice: totalAfterDiscount,
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
    formData.append("quote_Customer", quotePayload.quote_Customer);
    formData.append("quote_Products", JSON.stringify(products));
    formData.append("quote_SalesPerson", quotePayload.quote_SalesPerson);
    formData.append("quote_InitialPayment", quotePayload.quote_InitialPayment);
    formData.append("quote_BeforeTaxPrice", quotePayload.quote_BeforeTaxPrice);
    formData.append("quote_TotalTax", quotePayload.quote_TotalTax);
    formData.append(
      "quote_AfterDiscountPrice",
      quotePayload.quote_AfterDiscountPrice
    );
    formData.append("quote_Subject", quotePayload.quote_Subject);
    formData.append("quote_Image", quotePayload.quote_Image);
    formData.append("previewUrl", quotePayload.previewUrl); // Image file
    formData.append("quote_Project", quotePayload.quote_Project);
    formData.append("quote_Date", quotePayload.quote_Date);
    formData.append("quote_ExpiryDate", quotePayload.quote_ExpiryDate);
    formData.append(
      "quote_ReferenceNumber",
      quotePayload.quote_ReferenceNumber
    );
    formData.append("quote_TermsAndConditions", quotePayload.quote_TermsAndConditions);

    try {
      const response = await axios.patch(
        `${API_URL}/quote/edit-quote/${quoteId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwtLoginToken}`,
          },
        }
      );
      navigate("/quotes");
      if (response.data.success) {
        // Reset quotePayload and productRows to their default states
        setQuotePayload({
          quote_Customer: "",
          quote_Products: [], // This will be reset in the form
          quote_SalesPerson: "",
          quote_InitialPayment: "",
          quote_BeforeTaxPrice: 0,
          quote_TotalTax: 0,
          quote_AfterDiscountPrice: 0,
          quote_Subject: "",
          quote_Project: "",
          quote_Image: null,
          previewUrl: null,
          quote_Date: "",
          quote_ExpiryDate: "",
          quote_ReferenceNumber: "",
          quote_TermsAndConditions:"",
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

        alert("Quote Edited");
      }
    } catch (error) {
      console.error("Error creating quote:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
              <h1 className="text-2xl font-bold mb-4">Edit Quote</h1>

      <div className="mb-6 w-1/4">
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
          {quote && quote.quote_ReferenceNumber}
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
  value={quotePayload.quote_SalesPerson} 
  readOnly 
  className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100"
  placeholder="Salesperson Name"
/>

      </div>

      {/* Quote Dates */}
      <div className="flex space-x-4 mb-6 w-1/4">
        <div className="flex-1">
          <label
            className="block text-sm font-medium text-gray-700   mb-1"
            htmlFor="quoteDate"
          >
            <FaCalendarAlt className="inline-block mr-2" /> Quote Date
          </label>
          <input
            type="date"
            id="quoteDate"
            value={quotePayload.quote_Date}
            onChange={(e) =>
              setQuotePayload((prevPayload) => ({
                ...prevPayload,
                quote_Date: e.target.value,
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
            value={quotePayload.quote_ExpiryDate}
            onChange={(e) =>
              setQuotePayload((prevPayload) => ({
                ...prevPayload,
                quote_ExpiryDate: e.target.value,
              }))
            }
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Quote Initial Payment */}
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
          value={quotePayload.quote_InitialPayment}
          onChange={(e) =>
            setQuotePayload((prevPayload) => ({
              ...prevPayload,
              quote_InitialPayment: e.target.value,
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
          value={quotePayload.quote_Subject}
          onChange={(e) =>
            setQuotePayload((prevPayload) => ({
              ...prevPayload,
              quote_Subject: e.target.value,
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

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 text-lg font-semibold text-right">
        <h2 className="text-gray-700 flex justify-between">
          Subtotal:
          <span className="text-gray-900 font-medium">
            AED {quotePayload.quote_BeforeTaxPrice.toFixed(2)}
          </span>
        </h2>
        <h2 className="text-gray-700 flex justify-between">
          Total Tax:
          <span className="text-gray-900 font-medium">
            AED {quotePayload.quote_TotalTax.toFixed(2)}
          </span>
        </h2>
        <h2 className="text-gray-700 flex justify-between border-t pt-4">
          Grand Total:
          <span className="text-gray-900 font-bold text-xl">
            AED {quotePayload.quote_AfterDiscountPrice.toFixed(2)}
          </span>
        </h2>
      </div>



      <div className="mt-6">
  <h1 className="text-xl font-bold mb-4">Terms & Conditions</h1>
  <textarea
    value={quotePayload.quote_TermsAndConditions} 
    onChange={(e) =>
      setQuotePayload((prev) => ({
        ...prev,
        quote_TermsAndConditions: e.target.value, // Update the state with the new input
      }))
    }
    placeholder="Edit Terms and Conditions"
    rows={6}
    className="w-1/2 border border-gray-300 rounded-md p-2"
  />
</div>


<div className="mt-10 justify-between">
      <h1 className="text-xl font-bold mb-4">Upload Quote</h1>
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

export default EditQuote;
