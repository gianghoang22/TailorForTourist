import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navigation } from '../../layouts/components/navigation/Navigation.jsx';
import { Footer } from '../../layouts/components/footer/Footer.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import './ProductDetail.scss';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://localhost:7194/api/Product/details/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleAddToCart = async () => {
    try {
      const productID = product.productID;
      const userId = parseInt(localStorage.getItem("userID"));
      const isCustom = false;
  
      const productToAdd = {
        userId: userId, 
        isCustom: isCustom,
        productId: productID,
        customProduct: {
          productCode: "string",
          categoryID: 0,
          fabricID: 0,
          liningID: 0,
          measurementID: 0,
          pickedStyleOptions: [
            { styleOptionID: 0 }
          ]
        }
      };
  
      console.log("Sending product to add to cart:", productToAdd);
// Gửi dữ liệu lên API
const response = await fetch("https://localhost:7194/api/AddCart/addtocart", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify(productToAdd),
});

// Kiểm tra mã trạng thái HTTP
if (!response.ok) {
  const errorText = await response.text(); // Đọc phản hồi dưới dạng văn bản
  console.error("API returned error:", errorText); // Log lỗi ra console
  throw new Error("Failed to add product to cart: " + errorText);
}

// Nếu API trả về thông báo chuỗi đơn giản (như 'Product added to cart.')
const resultText = await response.text(); // Đọc phản hồi dưới dạng văn bản
console.log("API response:", resultText); // Log thông báo trả về từ API

if (resultText.includes("Product added to cart")) {
  toast.success('Product added to cart.');
} else {
  toast.error('Failed to add product to cart.');
}
} catch (error) {
// Xử lý lỗi nếu có
console.log("error:", error);
toast.error("Failed to add to cart. Please try again.");
}
  };
  

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!product) return <p>No product found.</p>;

  return (
    <>
      <Navigation />
      <main id="main-wrap">
        <div className="product-detail-page pd-single-info">
          <div className="all">
            <div className="left-gallery">
              <img src={product.imgURL} style={{width: '321px', height: '422px'}}/>
            </div>
            <div className="right-pd-info">
              <h1 className="pd-name">{product.productCode}</h1>
              <dl className="pdinfo-dl">
                <dt>Size:</dt>
                <dd>{product.size}</dd>
                <dt>Fabric:</dt>
                <dd>{product.fabricName}</dd>
                <dt>Lining:</dt>
                <dd>{product.liningName}</dd>
              </dl>
              <p className="price">From {product.price} USD</p>
            </div>
            <div className="right-pd-info">
              <div className="actions-link">
                <p className="note">
                  Choose between personalizing the product or add it like we designed it to your cart
                </p>
                <Link to="/custom-suits" className="btn primary-btn">Customize</Link>
                <button onClick={handleAddToCart} className="btn gray-btn">
                  Add to Cart
                </button>
              </div>
              <ul className="pd-features">
  <li className="feature-item">
    <img src="https://adongsilk.com/template/images/ico_tailored.png" alt="" />
    <p className="lb">CUSTOM FIT</p>
    <p className="smr">MADE TO MEASURE</p>
  </li>
  <li className="feature-item">
    <img src="https://adongsilk.com/template/images/ico_personalize.png" alt="" />
    <p className="lb">DESIGNED BY YOU</p>
    <p className="smr">ENDLESS CUSTOMIZATION OPTIONS</p>
  </li>
  <li className="feature-item">
    <img src="https://adongsilk.com/template/images/ico_shipping.png" alt="" />
    <p className="lb">WORLDWIDE DELIVERY</p>
  </li>
</ul>

            </div>
          </div>
        </div>

        {/* Related Products Section */}
        
      </main>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
