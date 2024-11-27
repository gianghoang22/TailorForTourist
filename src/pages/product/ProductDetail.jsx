import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navigation } from '../../layouts/components/navigation/Navigation.jsx';
import { Footer } from '../../layouts/components/footer/Footer.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import './ProductDetail.scss';
import { addToGuestCart } from '../../utils/cartUtil';
import { format } from 'date-fns';

const StarRating = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState(0);
  
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        
        return (
          <span
            key={index}
            className={`star ${ratingValue <= (hover || rating) ? 'active' : ''}`}
            onClick={() => onRatingChange(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [newFeedback, setNewFeedback] = useState({
    comment: '',
    rating: 5,
  });

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

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        // First fetch feedbacks
        const feedbackResponse = await axios.get(`https://localhost:7194/api/Feedback/product/${id}`);
        const feedbackData = feedbackResponse.data;
        setFeedbacks(feedbackData);

        // Then fetch user details one by one
        for (const feedback of feedbackData) {
          try {
            const userResponse = await axios.get(`https://localhost:7194/api/User/${feedback.userId}`);
            setUserNames(prev => ({
              ...prev,
              [feedback.userId]: userResponse.data.name
            }));
          } catch (userError) {
            console.error(`Error fetching user ${feedback.userId}:`, userError);
          }
        }
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
      }
    };

    if (id) {
      fetchFeedbacks();
    }
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Guest user - add to localStorage
      addToGuestCart(product, false);
      toast.success('Product added to cart');
      return;
    }

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
  
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userID');
    
    if (!token || !userId) {
      toast.error('Please login to submit a review');
      return;
    }

    try {
      // Simplified feedback data structure
      const feedbackData = {
        feedbackModel: {
          feedbackId: 0,
          comment: newFeedback.comment,
          rating: parseInt(newFeedback.rating),
          dateSubmitted: null,
          userId: parseInt(userId),
          orderId: null,
          productId: parseInt(id)
        }
      };

      console.log('Sending feedback data:', feedbackData);

      // Using fetch instead of axios to see raw response
      const response = await fetch('https://localhost:7194/api/Feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(feedbackData)
      });

      // Log the raw response
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${responseText}`);
      }

      toast.success('Review submitted successfully');
      setNewFeedback({ comment: '', rating: 5 });
      fetchFeedbacks();
    } catch (error) {
      console.error('Full error:', error);
      toast.error('Unable to submit review. Please check console for details');
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
        
        <div className="feedback-section">
          <h2>Customer Reviews ({feedbacks.length})</h2>
          
          {/* Feedback submission form */}
          <div className="feedback-form">
            <h3>Write Your Review</h3>
            <form onSubmit={handleSubmitFeedback}>
              <div className="rating-select">
                <label>Rating:</label>
                <StarRating 
                  rating={newFeedback.rating}
                  onRatingChange={(value) => setNewFeedback(prev => ({
                    ...prev,
                    rating: value
                  }))}
                />
              </div>
              
              <div className="comment-input">
                <label>Comment:</label>
                <textarea
                  value={newFeedback.comment}
                  onChange={(e) => setNewFeedback(prev => ({
                    ...prev,
                    comment: e.target.value
                  }))}
                  required
                  placeholder="Write your review here..."
                />
              </div>
              
              <button type="submit" className="submit-feedback">
                Submit Review
              </button>
            </form>
          </div>

          {/* Existing feedback display */}
          {feedbacks.length === 0 ? (
            <p className="no-feedback">No reviews yet for this product.</p>
          ) : (
            <div className="feedback-list">
              {feedbacks.map(feedback => (
                <div key={feedback.feedbackId} className="feedback-item">
                  <div className="feedback-header">
                    <span className="user-name">{userNames[feedback.userId] || 'Anonymous'}</span>
                    <span className="rating">
                      {'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}
                    </span>
                    <span className="date">
                      {format(new Date(feedback.dateSubmitted), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <p className="comment">{feedback.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </main>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
