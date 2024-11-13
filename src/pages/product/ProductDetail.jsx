import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navigation } from '../../layouts/components/navigation/Navigation.jsx';
import axios from 'axios';
import { addProduct } from '../../redux/slice/cartSlice.js';
import './ProductDetail.scss';
import { Footer } from '../../layouts/components/footer/Footer';
// import SlickSlider from './slider/SlickSlider.jsx';

const ProductDetailPage = () => {
  const { id } = useParams(); // Get id from URL
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
 // Add to Cart handler
 const addProduct = () => {
  // Get existing cart items from local storage or initialize a new array
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Add the new product to the cart
  cart.push({
    id: product.id,
    name: product.productCode,
    size: product.measurementID,
    fabric: product.fabricID,
    price: 120, // Use the actual product price here
  });

  // Update the local storage with the new cart array
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${product.productCode} added to cart!`);
};

if (loading) return <p className="loading">Loading...</p>;
if (error) return <p className="error">Error: {error}</p>;
if (!product) return <p>No product found.</p>;


  return (
    <>
    <Navigation />
    <main id='main-wrap'>

    <div className="product-detail-page pd-single-info">
      <div className="all">

        {/* product-info */}
        <div className="right-pd-info">
      <h1 className='pd-name'>{product.productCode}</h1>
      <dl className="pdinfo-dl">
        <dt>
        <p>Size: {product.measurementID}</p>
        </dt>
        <dd></dd>
        <dt>
        <p>Fabric: {product.fabricID}</p>
        </dt>
        <dd></dd>
      </dl>
        {/* <p>Category ID: {product.categoryID}</p>
        <p>Lining ID: {product.liningID}</p>
        <p>Order ID: {product.orderID}</p> */}
        <p className="price">From 120 USD</p>
        </div>

        {/* Left-gallery */}
        


        {/* <SlickSlider /> */}


      {/* product-info */}
      <div className="right-pd-info">
      <div role="form" className="wpcf7" id="wpcf7-f160-o1" lang="en-US" dir="ltr">
        <form action="/product/suit-ms08/#wpcf7-f160-o1" method="post" className="wpcf7-form sent" encType="multipart/form-data" noValidate>
          <div style={{ display: 'none' }}>
            <input type="hidden" name="_wpcf7" value="160" />
            <input type="hidden" name="_wpcf7_version" value="5.0.3" />
            <input type="hidden" name="_wpcf7_locale" value="en_US" />
            <input type="hidden" name="_wpcf7_unit_tag" value="wpcf7-f160-o1" />
            <input type="hidden" name="_wpcf7_container_post" value="0" />
          </div>
          
        </form>
      </div>
    </div>
      </div>
      </div>

      {/* product-related */}
      <section className="sec sec-related">
                <div className="decor-sec">
                  <img src="https://adongsilk.com/template/images/review-decor.png" alt=""/></div>
                <div className="all">
                    <div className="sec-title">
                        <h3 className="tt-txt">
                            <span className="tt-sub">you may also</span>
                            like                        
                        </h3>
                    </div>
                    <div className="product-list-wrap">
                        <div className="filter-list"></div>
                        <ul className="product-ul">
                            <li className="mona-product-type-simple_women">
    <article className="product-itembox">
        <a className="img" href="https://adongsilk.com/product/suit-ms07/">
        <img width="216" height="270" src="https://adongsilk.com/wp-content/uploads/2018/06/suit-10-1-lilac-wide-leg-trousers-216x270.jpg" 
        className="attachment-product-thumb size-product-thumb wp-post-image" alt="" 
        srcSet="https://adongsilk.com/wp-content/uploads/2018/06/suit-10-1-lilac-wide-leg-trousers-216x270.jpg 216w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-10-1-lilac-wide-leg-trousers-240x300.jpg 240w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-10-1-lilac-wide-leg-trousers-768x960.jpg 768w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-10-1-lilac-wide-leg-trousers-819x1024.jpg 819w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-10-1-lilac-wide-leg-trousers-632x790.jpg 632w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-10-1-lilac-wide-leg-trousers-450x562.jpg 450w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-10-1-lilac-wide-leg-trousers-300x375.jpg 300w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-10-1-lilac-wide-leg-trousers-600x750.jpg 600w,
        https://adongsilk.com/wp-content/uploads/2018/06/suit-10-1-lilac-wide-leg-trousers.jpg 1160w" 
        sizes="(max-width: 216px) 100vw, 216px"/></a>
        <div className="info">
            <p className="name-alt"><a href="https://adongsilk.com/lists/women/suit/" rel="tag">SUIT</a></p>
            <p className="name"><a href="https://adongsilk.com/product/suit-ms07/">Suit MS07</a></p>
            <p className="price">From 120 USD</p>
        </div>
                
    </article>
</li><li className="mona-product-type-simple_women">
    <article className="product-itembox">
        <a className="img" href="https://adongsilk.com/product/suit-ms06/">
        <img width="216" height="270" src="https://adongsilk.com/wp-content/uploads/2018/06/suit-8-1-tall-white-flared-trousers-216x270.jpg" 
        className="attachment-product-thumb size-product-thumb wp-post-image" alt="" 
        srcSet="https://adongsilk.com/wp-content/uploads/2018/06/suit-8-1-tall-white-flared-trousers-216x270.jpg 216w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-8-1-tall-white-flared-trousers-240x300.jpg 240w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-8-1-tall-white-flared-trousers-768x960.jpg 768w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-8-1-tall-white-flared-trousers-819x1024.jpg 819w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-8-1-tall-white-flared-trousers-632x790.jpg 632w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-8-1-tall-white-flared-trousers-450x562.jpg 450w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-8-1-tall-white-flared-trousers-300x375.jpg 300w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-8-1-tall-white-flared-trousers-600x750.jpg 600w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-8-1-tall-white-flared-trousers.jpg 1160w" 
        sizes="(max-width: 216px) 100vw, 216px"/></a>
        <div className="info">
            <p className="name-alt"><a href="https://adongsilk.com/lists/women/suit/" rel="tag">SUIT</a></p>
            <p className="name"><a href="https://adongsilk.com/product/suit-ms06/">Suit MS06</a></p>
            <p className="price">From 120 USD</p>
        </div>
    </article>
</li><li className="mona-product-type-simple_women">
    <article className="product-itembox">
        <a className="img" href="https://adongsilk.com/product/suit-ms05/">
        <img width="216" height="270" src="https://adongsilk.com/wp-content/uploads/2018/06/suit-6-1-nude-pleat-front-culotte-trousers-216x270.jpg" 
        className="attachment-product-thumb size-product-thumb wp-post-image" alt="" 
        srcSet="https://adongsilk.com/wp-content/uploads/2018/06/suit-6-1-nude-pleat-front-culotte-trousers-216x270.jpg 216w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-6-1-nude-pleat-front-culotte-trousers-240x300.jpg 240w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-6-1-nude-pleat-front-culotte-trousers-768x960.jpg 768w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-6-1-nude-pleat-front-culotte-trousers-819x1024.jpg 819w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-6-1-nude-pleat-front-culotte-trousers-632x790.jpg 632w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-6-1-nude-pleat-front-culotte-trousers-450x562.jpg 450w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-6-1-nude-pleat-front-culotte-trousers-300x375.jpg 300w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-6-1-nude-pleat-front-culotte-trousers-600x750.jpg 600w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-6-1-nude-pleat-front-culotte-trousers.jpg 1160w" 
        sizes="(max-width: 216px) 100vw, 216px"/></a>
        <div className="info">
            <p className="name-alt"><a href="https://adongsilk.com/lists/women/suit/" rel="tag">SUIT</a></p>
            <p className="name"><a href="https://adongsilk.com/product/suit-ms05/">Suit MS05</a></p>
            <p className="price">From 120 USD</p>
        </div>
                
    </article>
</li><li className="mona-product-type-simple_women">
    <article className="product-itembox">
        <a className="img" href="https://adongsilk.com/product/suit-ms04/">
        <img width="216" height="270" src="https://adongsilk.com/wp-content/uploads/2018/06/suit-4-1-orange-skinny-tux-jacket-216x270.jpg" 
        className="attachment-product-thumb size-product-thumb wp-post-image" alt="" 
        srcSet="https://adongsilk.com/wp-content/uploads/2018/06/suit-4-1-orange-skinny-tux-jacket-216x270.jpg 216w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-4-1-orange-skinny-tux-jacket-240x300.jpg 240w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-4-1-orange-skinny-tux-jacket-768x960.jpg 768w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-4-1-orange-skinny-tux-jacket-819x1024.jpg 819w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-4-1-orange-skinny-tux-jacket-632x790.jpg 632w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-4-1-orange-skinny-tux-jacket-450x562.jpg 450w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-4-1-orange-skinny-tux-jacket-300x375.jpg 300w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-4-1-orange-skinny-tux-jacket-600x750.jpg 600w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-4-1-orange-skinny-tux-jacket.jpg 1160w" 
        sizes="(max-width: 216px) 100vw, 216px"/></a>
        <div className="info">
            <p className="name-alt"><a href="https://adongsilk.com/lists/women/suit/" rel="tag">SUIT</a></p>
            <p className="name"><a href="https://adongsilk.com/product/suit-ms04/">Suit MS04</a></p>
            <p className="price">From 120 USD</p>
        </div>
                
    </article>
</li><li className="mona-product-type-simple_women">
    <article className="product-itembox">
        <a className="img" href="https://adongsilk.com/product/suit-ms03/">
        <img width="216" height="270" src="https://adongsilk.com/wp-content/uploads/2018/06/suit-3-1-red-crepe-tailored-cigarette-trousers-216x270.jpg" 
        className="attachment-product-thumb size-product-thumb wp-post-image" alt="" 
        srcSet="https://adongsilk.com/wp-content/uploads/2018/06/suit-3-1-red-crepe-tailored-cigarette-trousers-216x270.jpg 216w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-3-1-red-crepe-tailored-cigarette-trousers-240x300.jpg 240w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-3-1-red-crepe-tailored-cigarette-trousers-768x960.jpg 768w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-3-1-red-crepe-tailored-cigarette-trousers-819x1024.jpg 819w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-3-1-red-crepe-tailored-cigarette-trousers-632x790.jpg 632w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-3-1-red-crepe-tailored-cigarette-trousers-450x562.jpg 450w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-3-1-red-crepe-tailored-cigarette-trousers-300x375.jpg 300w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-3-1-red-crepe-tailored-cigarette-trousers-600x750.jpg 600w, 
        https://adongsilk.com/wp-content/uploads/2018/06/suit-3-1-red-crepe-tailored-cigarette-trousers.jpg 1160w" 
        sizes="(max-width: 216px) 100vw, 216px"/></a>
        <div className="info">
            <p className="name-alt"><a href="https://adongsilk.com/lists/women/suit/" rel="tag">SUIT</a></p>
            <p className="name"><a href="https://adongsilk.com/product/suit-ms03/">Suit MS03</a></p>
            <p className="price">From 120 USD</p>
          </div>        
        </article>
      </li>
    </ul>
  </div>
</div>
</section>
</main>
    
    <Footer/>
    </>
  );
};

export default ProductDetailPage;
