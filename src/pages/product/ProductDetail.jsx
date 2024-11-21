import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navigation } from '../../layouts/components/navigation/Navigation.jsx';
import { Footer } from '../../layouts/components/footer/Footer.jsx';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slice/cartSlice.js';
import { toast } from 'react-toastify';
import axios from 'axios';
import './ProductDetail.scss';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

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

  const handleAddToCart = () => {
    const productToAdd = {
      id: product.id,
      name: product.productCode,
      price: product.price,
      fabric: product.fabricName,
      style: product.style,
      lining: product.liningName,
      quantity: 1,
    }

    dispatch(addToCart(productToAdd));
    toast.success('Product added to cart.');
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
            <div className="right-pd-info">
              <h1 className="pd-name">{product.productCode}</h1>
              <dl className="pdinfo-dl">
                <dt>Size:</dt>
                <dd>{product.measurementID}</dd>
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
        <section className="sec sec-related">
          <div className="decor-sec">
            <img src="https://adongsilk.com/template/images/review-decor.png" alt="Decoration" />
          </div>
          <div className="all">
            <div className="sec-title">
              <h3 className="tt-txt">
                <span className="tt-sub">You may also</span> like
              </h3>
            </div>
            <div className="product-list-wrap">
              <ul className="product-ul">
                {/* Sample related product items */}
                <li className="mona-product-type-simple_women">
                  <article className="product-itembox">
                    <a className="img" href="https://adongsilk.com/product/suit-ms07/">
                      <img
                        src="https://adongsilk.com/wp-content/uploads/2018/06/suit-10-1-lilac-wide-leg-trousers-216x270.jpg"
                        alt="Related Product"
                      />
                    </a>
                    <div className="info">
                      <p className="name-alt">
                        <a href="https://adongsilk.com/lists/women/suit/" rel="tag">SUIT</a>
                      </p>
                      <p className="name">
                        <a href="https://adongsilk.com/product/suit-ms07/">Suit MS07</a>
                      </p>
                      <p className="price">From 120 USD</p>
                    </div>
                  </article>
                </li>
                <li className="mona-product-type-simple_women">
                  <article className="product-itembox">
                    <a className="img" href="https://adongsilk.com/product/suit-ms06/">
                      <img
                        src="https://adongsilk.com/wp-content/uploads/2018/06/suit-8-1-tall-white-flared-trousers-216x270.jpg"
                        alt="Related Product"
                      />
                    </a>
                    <div className="info">
                      <p className="name-alt">
                        <a href="https://adongsilk.com/lists/women/suit/" rel="tag">SUIT</a>
                      </p>
                      <p className="name">
                        <a href="https://adongsilk.com/product/suit-ms06/">Suit MS06</a>
                      </p>
                      <p className="price">From 120 USD</p>
                    </div>
                  </article>
                </li>
                <li className="mona-product-type-simple_women">
                  <article className="product-itembox">
                    <a className="img" href="https://adongsilk.com/product/suit-ms05/">
                      <img
                        src="https://adongsilk.com/wp-content/uploads/2018/06/suit-6-1-nude-pleat-front-culotte-trousers-216x270.jpg"
                        alt="Related Product"
                      />
                    </a>
                    <div className="info">
                      <p className="name-alt">
                        <a href="https://adongsilk.com/lists/women/suit/" rel="tag">SUIT</a>
                      </p>
                      <p className="name">
                        <a href="https://adongsilk.com/product/suit-ms05/">Suit MS05</a>
                      </p>
                      <p className="price">From 120 USD</p>
                    </div>
                  </article>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
