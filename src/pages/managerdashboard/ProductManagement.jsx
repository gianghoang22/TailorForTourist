import React, { useEffect, useState } from "react";
import './ProductManagement.scss';

const BASE_URL = "https://localhost:7194/api";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 7;
    const [currentProducts, setCurrentProducts] = useState([]);

    const fetchStoreByManagerId = async (userId) => {
        const response = await fetch(`${BASE_URL}/Store/userId/${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch store");
        }
        return response.json();
    };

    const fetchProductByStoreId = async (storeId) => {
        const response = await fetch(`${BASE_URL}/Product/products/custom-false/instoreid?storeId=${storeId}`);
        if (!response.ok) {
            throw new Error("Fail to fetch products");
        }
        return response.json();
    }

    const fetchProductDetailsById = async (productId) => {
        const response = await fetch(`${BASE_URL}/Product/products/custom-false?productID=${productId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch product details");
        }
        return response.json();
    };

    useEffect(() => {
        const fetchProductsInstore = async () => {
            try {
                const userId = localStorage.getItem("userID");
                if (!userId) {
                    throw new Error("User ID not found");
                }
                const storeData = await fetchStoreByManagerId(userId);
                const storeId = storeData.storeId;
                const productsData = await fetchProductByStoreId(storeId);
                setProducts(
                    Array.isArray(productsData) ? productsData : [productsData]
                );
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err.message);
                setLoading(false);
            }
        }
        fetchProductsInstore();
    })

    // Calculate the index of the first and last product on the current page
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    useEffect(() => {
        const fetchCurrentProducts = async () => {
            const productsWithDetails = await Promise.all(products.slice(indexOfFirstProduct, indexOfLastProduct).map(async (product) => {
                const productDetails = await fetchProductDetailsById(product.productId);
                return { ...product, ...productDetails }; // Merge product data with fetched details
            }));
            setCurrentProducts(productsWithDetails);
        };

        fetchCurrentProducts();
    }, [products, indexOfFirstProduct, indexOfLastProduct]); // Add dependencies

    // Function to handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    return (
        <>
            <h1>Product Management</h1>
            <table>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Code</th>
                        <th>Price</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map(product => (
                        <tr key={product.productId}>
                            <td>{product.productId}</td>
                            <td>{product.productCode}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, index) => (
                    <button key={index + 1} onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </>
    )
}

export default ProductManagement;