import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;
const API_SALES_URL = process.env.REACT_APP_API_SALES_URL;

const SalesViewProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const jwtLoginToken = localStorage.getItem("jwtLoginToken");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${API_SALES_URL}/product/get-product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtLoginToken}`,
            },
          }
        );
        const product = response.data?.information?.product;

        if (product) {
          setProductData({
            ...product,
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

  const handleImageClick = (imageUrl) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  if (!productData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold mb-6"> Product Details</h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Image
          </label>
          {productData.previewUrl ? (
            <img
              src={productData.previewUrl}
              alt={productData.product_Name}
              className="w-32 h-32 object-cover rounded cursor-pointer"
              onClick={() => handleImageClick(productData.previewUrl)}
            />
          ) : (
            <p>No image available</p>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700">Product Name: {productData.product_Name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Cost Price: {productData.product_CostPrice}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Selling Price: {productData.product_SellingPrice}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Stock Quantity: {productData.product_StockQuantity}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Category: {productData.product_Category}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Description: {productData.product_Description}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Date of Purchase: {productData.product_DateOfPurchase.slice(0, 10)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Damaged Pieces: {productData.product_DamagedPieces}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Stock Location: {productData.product_StockLocation}</p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Vendor Information</h3>
        <div>
          <p className="text-sm font-medium text-gray-700">Vendor Name: {productData.product_Vendor.vendor_Name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Vendor Email: {productData.product_Vendor.vendor_Email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Vendor Contact: {productData.product_Vendor.vendor_Contact}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Vendor Address: {productData.product_Vendor.vendor_Address}</p>
        </div>
      </div>

      {/* Modal for Image View */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-white p-4 rounded-md"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImage}
              alt="Full Size"
              className="max-w-full max-h-full object-contain"
            />
            <button
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2"
              onClick={closeModal}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesViewProduct;
