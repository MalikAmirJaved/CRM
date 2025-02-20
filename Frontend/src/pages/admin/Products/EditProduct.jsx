import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    product_NewName: "",
    product_NewCostPrice: "",
    product_NewSellingPrice: "",
    product_NewStockQuantity: "",
    product_NewCategory: "",
    product_NewDescription: "",
    product_NewDateOfPurchase: "",
    product_NewDamagedPieces: "",
    product_NewStockLocation: "",
    product_NewVendor: {
      vendor_Name: "",
      vendor_Email: "",
      vendor_Contact: "",
      vendor_Address: "",
    },
    product_Image: null,
    previewUrl: null,
  });

  const jwtLoginToken = localStorage.getItem("jwtLoginToken");

  useEffect(() => {
    if (!jwtLoginToken) {
      alert("Authentication token is missing. Please log in.");
      navigate("/login");
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/product/get-product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtLoginToken}`,
            },
          }
        );
        const product = response.data?.information.product;

        if (product) {
          setFormData({
            product_NewName: product.product_Name || "",
            product_NewCostPrice: product.product_CostPrice || "",
            product_NewSellingPrice: product.product_SellingPrice || "",
            product_NewStockQuantity: product.product_StockQuantity || "",
            product_NewCategory: product.product_Category || "",
            product_NewDescription: product.product_Description || "",
            product_NewDateOfPurchase: product.product_DateOfPurchase
              ? new Date(product.product_DateOfPurchase)
                  .toISOString()
                  .slice(0, 10)
              : "",
            product_NewDamagedPieces: product.product_DamagedPieces || "",
            product_NewStockLocation: product.product_StockLocation || "",
            product_NewVendor: {
              vendor_Name: product.product_Vendor?.vendor_Name || "",
              vendor_Email: product.product_Vendor?.vendor_Email || "",
              vendor_Contact: product.product_Vendor?.vendor_Contact || "",
              vendor_Address: product.product_Vendor?.vendor_Address || "",
            },
            product_Image: null, // We don't handle image directly here.
            previewUrl: product.product_Image?.filePath
              ? `${API_URL}${product.product_Image.filePath}`
              : null,
          });
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        alert("Failed to load product details.");
      }
    };

    fetchProductDetails();
  }, [productId, jwtLoginToken, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("vendor_")) {
      setFormData((prevData) => ({
        ...prevData,
        product_NewVendor: {
          ...prevData.product_NewVendor,
          [name.replace("vendor_", "")]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prevData) => ({
        ...prevData,
        product_Image: file,
        previewUrl,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.product_NewName ||
      !formData.product_NewCostPrice ||
      !formData.product_NewSellingPrice
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("product_NewName", formData.product_NewName);
    formDataToSend.append("product_NewCostPrice", formData.product_NewCostPrice);
    formDataToSend.append("product_NewSellingPrice", formData.product_NewSellingPrice);
    formDataToSend.append("product_NewStockQuantity", formData.product_NewStockQuantity);
    formDataToSend.append("product_NewCategory", formData.product_NewCategory);
    formDataToSend.append("product_NewDescription", formData.product_NewDescription);
    formDataToSend.append("product_NewDateOfPurchase", formData.product_NewDateOfPurchase);
    formDataToSend.append("product_NewDamagedPieces", formData.product_NewDamagedPieces);
    formDataToSend.append("product_NewStockLocation", formData.product_NewStockLocation);

    formDataToSend.append(
      "product_NewVendor[vendor_Name]",
      formData.product_NewVendor.vendor_Name
    );
    formDataToSend.append(
      "product_NewVendor[vendor_Email]",
      formData.product_NewVendor.vendor_Email
    );
    formDataToSend.append(
      "product_NewVendor[vendor_Contact]",
      formData.product_NewVendor.vendor_Contact
    );
    formDataToSend.append(
      "product_NewVendor[vendor_Address]",
      formData.product_NewVendor.vendor_Address
    );

    if (formData.product_Image) {
      formDataToSend.append("product_Image", formData.product_Image);
    }

    try {
      const response = await axios.patch(
        `${API_URL}/product/update-product/${productId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${jwtLoginToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        alert("Product updated successfully!");
        navigate("/products");
      } else {
        throw new Error(response.data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error updating product:", error.response || error.message);
      alert(error.response?.data?.message || "Failed to update product.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <label className="text-sm font-medium text-gray-700">Product Image</label>
          <div className="my-3">
            {formData.previewUrl ? (
              <img
                src={formData.previewUrl}
                alt="Product Preview"
                className="w-32 h-32 object-cover rounded-md border"
              />
            ) : (
              <span className="text-gray-500">No Image</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
        </div>

        {[ 
          { name: "product_NewName", label: "Product Name" },
          { name: "product_NewCostPrice", label: "Cost Price", type: "number" },
          { name: "product_NewSellingPrice", label: "Selling Price", type: "number" },
          { name: "product_NewStockQuantity", label: "Stock Quantity", type: "number" },
          { name: "product_NewCategory", label: "Category" },
          { name: "product_NewDescription", label: "Description" },
          { name: "product_NewDateOfPurchase", label: "Date of Purchase", type: "date" },
          { name: "product_NewDamagedPieces", label: "Damaged Pieces", type: "number" },
          { name: "product_NewStockLocation", label: "Stock Location" },
        ].map((field) => (
          <div key={field.name} className="form-group">
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        ))}

        <h3 className="text-xl font-semibold text-gray-800 mt-4">Vendor Information</h3>
        {[ 
          { name: "vendor_Name", label: "Vendor Name" },
          { name: "vendor_Email", label: "Vendor Email" },
          { name: "vendor_Contact", label: "Vendor Contact" },
          { name: "vendor_Address", label: "Vendor Address" },
        ].map((field) => (
          <div key={field.name} className="form-group">
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            <input
              type="text"
              name={`vendor_${field.name}`}
              value={formData.product_NewVendor[field.name]}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        ))}

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
