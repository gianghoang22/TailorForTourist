import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Paper,
  InputBase,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./ProductManagement.scss";

const BASE_URL = "https://vesttour.xyz/api";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 7;
  const [currentProducts, setCurrentProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [allProductDetails, setAllProductDetails] = useState({});

  const fetchStoreByManagerId = async (userId) => {
    const response = await fetch(`${BASE_URL}/Store/userId/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch store");
    }
    return response.json();
  };

  const fetchProductByStoreId = async (storeId) => {
    const response = await fetch(
      `${BASE_URL}/Product/products/custom-false/instoreid?storeId=${storeId}`
    );
    if (!response.ok) {
      throw new Error("Fail to fetch products");
    }
    return response.json();
  };

  const fetchProductDetailsById = async (productId) => {
    const response = await fetch(
      `${BASE_URL}/Product/products/custom-false?productID=${productId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }
    return response.json();
  };

  useEffect(() => {
    const fetchProductsInstore = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem("userID");
        if (!userId) {
          throw new Error("User ID not found");
        }
        const storeData = await fetchStoreByManagerId(userId);
        const storeId = storeData.storeId;
        const productsData = await fetchProductByStoreId(storeId);
        const productsArray = Array.isArray(productsData)
          ? productsData
          : [productsData];

        const response = await fetch(`${BASE_URL}/Product`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const allProductsList = await response.json();

        const details = {};
        productsArray.forEach((storeProduct) => {
          const fullProduct = allProductsList.find(
            (p) => p.productID === storeProduct.productId
          );
          if (fullProduct) {
            const status =
              storeProduct.quantity === 0 ? "Unavailable" : "Available";
            details[storeProduct.productId] = {
              ...storeProduct,
              ...fullProduct,
              imgURL: fullProduct.imgURL,
              status: status,
            };
          }
        });

        setProducts(productsArray);
        setAllProductDetails(details);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductsInstore();
  }, []);

  // Calculate the index of the first and last product on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Simplify the filtered products logic
  const filteredProducts = products.filter(
    (product) =>
      product.productCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productId?.toString().includes(searchTerm)
  );

  // Log for debugging
  useEffect(() => {
    console.log("All product details:", allProductDetails);
    console.log("Filtered products:", filteredProducts);
  }, [allProductDetails, filteredProducts]);

  // Update the useEffect for pagination and search to use cached details
  useEffect(() => {
    if (!isLoading && filteredProducts.length > 0) {
      const currentProductsWithDetails = filteredProducts
        .slice(indexOfFirstProduct, indexOfLastProduct)
        .map((product) => ({
          ...product,
          ...allProductDetails[product.productId],
        }));
      setCurrentProducts(currentProductsWithDetails);
    }
  }, [
    filteredProducts,
    indexOfFirstProduct,
    indexOfLastProduct,
    allProductDetails,
  ]);

  // Handle page change without loading state
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const updateProductStatus = async (productId, quantity) => {
    try {
      const newStatus = quantity === 0 ? "Unavailable" : "Available";

      const response = await fetch(
        `${BASE_URL}/Product/${productId}/update-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newStatus),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product status");
      }

      // Update local state
      setAllProductDetails((prev) => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          status: newStatus,
        },
      }));
    } catch (error) {
      console.error("Error updating product status:", error);
      setError("Failed to update product status");
    }
  };

  return (
    <div className="product-management">
      <Typography variant="h4" component="h1" className="page-title">
        Product Management
      </Typography>

      {error && (
        <Alert severity="error" className="error-alert">
          {error}
        </Alert>
      )}

      {isLoading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="header">
            <Paper className="search-container">
              <IconButton className="search-icon" aria-label="search">
                <SearchIcon />
              </IconButton>
              <InputBase
                className="search-input"
                placeholder="Search by product code or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
              />
            </Paper>
          </div>

          <Paper className="table-wrapper">
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Product ID</TableCell>
                    <TableCell>Product Code</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentProducts.map((product) => {
                    const productDetails = allProductDetails[product.productId];
                    const status =
                      productDetails?.quantity === 0
                        ? "Unavailable"
                        : "Available";

                    return (
                      <TableRow
                        key={product?.productId || "no-id"}
                        className="table-row"
                        hover
                      >
                        <TableCell>{product?.productId}</TableCell>
                        <TableCell>{product?.productCode}</TableCell>
                        <TableCell>
                          ${product?.price?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`quantity-badge ${(product?.quantity || 0) < 10 ? "low" : "normal"}`}
                          >
                            {product?.quantity || 0}
                          </span>
                        </TableCell>
                        <TableCell>
                          {productDetails?.imgURL && (
                            <div className="image-container">
                              <img
                                className="product-image"
                                src={productDetails.imgURL}
                                alt={product.productCode || "Product"}
                              />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`status-badge ${status.toLowerCase()}`}
                          >
                            {status}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <div className="pagination">
            <button
              className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <div className="page-numbers">
              {Array.from(
                {
                  length: Math.ceil(filteredProducts.length / productsPerPage),
                },
                (_, index) => (
                  <button
                    key={index + 1}
                    className={`page-number ${currentPage === index + 1 ? "active" : ""}`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                )
              )}
            </div>

            <button
              className={`pagination-btn ${
                currentPage ===
                Math.ceil(filteredProducts.length / productsPerPage)
                  ? "disabled"
                  : ""
              }`}
              disabled={
                currentPage ===
                Math.ceil(filteredProducts.length / productsPerPage)
              }
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductManagement;