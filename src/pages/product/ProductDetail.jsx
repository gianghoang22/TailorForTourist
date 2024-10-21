import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navigation } from '../../layouts/components/navigation/Navigation.jsx';
import axios from 'axios';

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
        <div className="left-gallery">
        {/* <div className="slider-cont slider-pd-main slick-initialized slick-slider slick-dotted" id="slider-pd-main">
  <div className="slick-list draggable">
    <div className="slick-track" style={{ opacity: 1, width: '1952px', transform: 'translate3d(0px, 0px, 0px)' }}>
      <div className="slider-item slick-slide slick-current slick-active" 
           data-tn="https://adongsilk.com/wp-content/uploads/2018/06/suit-11-1-tailored-cigarette-trousers-black-150x150.jpg" 
           data-slick-index="0" 
           aria-hidden="false" 
           style={{ width: '488px' }} 
           tabIndex="0" 
           role="tabpanel" 
           id="slick-slide00" 
           aria-describedby="slick-slide-control00">
        <div className="img">
          <img 
            width="450" 
            height="562" 
            src="https://adongsilk.com/wp-content/uploads/2018/06/suit-11-1-tailored-cigarette-trousers-black-450x562.jpg" 
            className="attachment-product-large size-product-large" 
            alt="" 
            srcSet="https://adongsilk.com/wp-content/uploads/2018/06/suit-11-1-tailored-cigarette-trousers-black-450x562.jpg 450w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-1-tailored-cigarette-trousers-black-240x300.jpg 240w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-1-tailored-cigarette-trousers-black-768x960.jpg 768w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-1-tailored-cigarette-trousers-black-819x1024.jpg 819w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-1-tailored-cigarette-trousers-black-632x790.jpg 632w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-1-tailored-cigarette-trousers-black-216x270.jpg 216w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-1-tailored-cigarette-trousers-black-300x375.jpg 300w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-1-tailored-cigarette-trousers-black-600x750.jpg 600w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-1-tailored-cigarette-trousers-black.jpg 1160w" 
            sizes="(max-width: 450px) 100vw, 450px" 
          />
        </div>
      </div>
      <div className="slider-item slick-slide" 
           data-tn="https://adongsilk.com/wp-content/uploads/2018/06/suit-11-4-150x150.jpg" 
           data-slick-index="1" 
           aria-hidden="true" 
           style={{ width: '488px' }} 
           tabIndex="-1" 
           role="tabpanel" 
           id="slick-slide01" 
           aria-describedby="slick-slide-control01">
        <div className="img">
          <img 
            width="450" 
            height="562" 
            src="https://adongsilk.com/wp-content/uploads/2018/06/suit-11-4-450x562.jpg" 
            className="attachment-product-large size-product-large" 
            alt="" 
            srcSet="https://adongsilk.com/wp-content/uploads/2018/06/suit-11-4-450x562.jpg 450w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-4-240x300.jpg 240w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-4-768x960.jpg 768w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-4-819x1024.jpg 819w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-4-632x790.jpg 632w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-4-216x270.jpg 216w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-4-300x375.jpg 300w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-4-600x750.jpg 600w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-4.jpg 1160w" 
            sizes="(max-width: 450px) 100vw, 450px" 
          />
        </div>
      </div>
      <div className="slider-item slick-slide" 
           data-tn="https://adongsilk.com/wp-content/uploads/2018/06/suit-11-3-150x150.jpg" 
           data-slick-index="2" 
           aria-hidden="true" 
           style={{ width: '488px' }} 
           tabIndex="-1" 
           role="tabpanel" 
           id="slick-slide02" 
           aria-describedby="slick-slide-control02">
        <div className="img">
          <img 
            width="388" 
            height="562" 
            src="https://adongsilk.com/wp-content/uploads/2018/06/suit-11-3-388x562.jpg" 
            className="attachment-product-large size-product-large" 
            alt="" 
            srcSet="https://adongsilk.com/wp-content/uploads/2018/06/suit-11-3-388x562.jpg 388w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-3-207x300.jpg 207w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-3-768x1112.jpg 768w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-3-707x1024.jpg 707w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-3-545x790.jpg 545w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-3-216x313.jpg 216w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-3-300x434.jpg 300w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-3-600x869.jpg 600w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-3.jpg 1160w" 
            sizes="(max-width: 388px) 100vw, 388px" 
          />
        </div>
      </div>
      <div className="slider-item slick-slide" 
           data-tn="https://adongsilk.com/wp-content/uploads/2018/06/suit-11-2-150x150.jpg" 
           data-slick-index="3" 
           aria-hidden="true" 
           style={{ width: '488px' }} 
           tabIndex="-1" 
           role="tabpanel" 
           id="slick-slide03" 
           aria-describedby="slick-slide-control03">
        <div className="img">
          <img 
            width="388" 
            height="562" 
            src="https://adongsilk.com/wp-content/uploads/2018/06/suit-11-2-388x562.jpg" 
            className="attachment-product-large size-product-large" 
            alt="" 
            srcSet="https://adongsilk.com/wp-content/uploads/2018/06/suit-11-2-388x562.jpg 388w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-2-207x300.jpg 207w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-2-768x1112.jpg 768w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-2-707x1024.jpg 707w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-2-545x790.jpg 545w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-2-216x313.jpg 216w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-2-300x434.jpg 300w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-2-600x869.jpg 600w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-2.jpg 1160w" 
            sizes="(max-width: 388px) 100vw, 388px" 
          />
        </div>
      </div>
      <div className="slider-item slick-slide" 
           data-tn="https://adongsilk.com/wp-content/uploads/2018/06/suit-11-6-150x150.jpg" 
           data-slick-index="4" 
           aria-hidden="true" 
           style={{ width: '488px' }} 
           tabIndex="-1" 
           role="tabpanel" 
           id="slick-slide04" 
           aria-describedby="slick-slide-control04">
        <div className="img">
          <img 
            width="388" 
            height="562" 
            src="https://adongsilk.com/wp-content/uploads/2018/06/suit-11-6-388x562.jpg" 
            className="attachment-product-large size-product-large" 
            alt="" 
            srcSet="https://adongsilk.com/wp-content/uploads/2018/06/suit-11-6-388x562.jpg 388w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-6-207x300.jpg 207w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-6-768x1112.jpg 768w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-6-707x1024.jpg 707w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-6-545x790.jpg 545w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-6-216x313.jpg 216w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-6-300x434.jpg 300w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-6-600x869.jpg 600w, https://adongsilk.com/wp-content/uploads/2018/06/suit-11-6.jpg 1160w" 
            sizes="(max-width: 388px) 100vw, 388px" 
          />
        </div>
      </div>
    </div>
  </div>
  <div className="slick-dots" style={{ display: 'block' }}>
    <ul>
      <li className="slick-active" aria-hidden="false">
        <button type="button" data-role="none" aria-label="Slide 1" tabIndex="0" className="slick-slide-control slick-active">1</button>
      </li>
      <li aria-hidden="true">
        <button type="button" data-role="none" aria-label="Slide 2" tabIndex="-1" className="slick-slide-control">2</button>
      </li>
      <li aria-hidden="true">
        <button type="button" data-role="none" aria-label="Slide 3" tabIndex="-1" className="slick-slide-control">3</button>
      </li>
      <li aria-hidden="true">
        <button type="button" data-role="none" aria-label="Slide 4" tabIndex="-1" className="slick-slide-control">4</button>
      </li>
      <li aria-hidden="true">
        <button type="button" data-role="none" aria-label="Slide 5" tabIndex="-1" className="slick-slide-control">5</button>
      </li>
    </ul>
  </div>
</div> */}
        <img src="https://adongsilk.com/wp-content/uploads/2018/06/suit-11-1-tailored-cigarette-trousers-black-450x562.jpg" alt="" />
      </div>


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
          <div className="form-design-info">
            {/* <p className="title bold">Design your own suits</p>
            <div className="fgroup">
              <div className="lb"><span className="num">1</span> Info</div>
              <div className="controls-wrap">
                <span className="wpcf7-form-control-wrap text-406">
                  <input
                    type="text"
                    name="text-406"
                    size="40"
                    className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required fcontrol gray-control"
                    aria-required="true"
                    aria-invalid="false"
                    placeholder="Name"
                  />
                </span>
                <br />
                <span className="wpcf7-form-control-wrap email-936">
                  <input
                    type="email"
                    name="email-936"
                    size="40"
                    className="wpcf7-form-control wpcf7-text wpcf7-email wpcf7-validates-as-required wpcf7-validates-as-email fcontrol gray-control"
                    aria-required="true"
                    aria-invalid="false"
                    placeholder="Email"
                  />
                </span>
                <br />
                <span id="wpcf7-670c81043d22b-wrapper" className="wpcf7-form-control-wrap Email-wrap" style={{ display: 'none', visibility: 'hidden' }}>
                  <input
                    id="wpcf7-670c81043d22b-field"
                    className="wpcf7-form-control wpcf7-text"
                    type="text"
                    name="Email"
                    size="40"
                    tabIndex="-1"
                    autoComplete="new-password"
                  />
                </span>
                <br />
                <span className="wpcf7-form-control-wrap tel-225">
                  <input
                    type="tel"
                    name="tel-225"
                    size="40"
                    className="wpcf7-form-control wpcf7-text wpcf7-tel wpcf7-validates-as-required wpcf7-validates-as-tel fcontrol gray-control"
                    aria-required="true"
                    aria-invalid="false"
                    placeholder="Phone"
                  />
                </span>
              </div>
              <p></p>
            </div>
            <div className="fgroup">
              <div className="lb"><span className="num">2</span> Subscribe</div>
              <div className="controls-wrap">
                <div className="frow">
                  <div className="imgs-uploaded clear">

                    {/* upload photo */}
                    <div id="upload-review"></div>
                    {/* <p>
                      <label className="item upload-btn">
                        <span className="wpcf7-form-control-wrap file-148">
                          <input
                            type="file"
                            name="file-148"
                            size="40"
                            className="wpcf7-form-control wpcf7-file mona-hiden"
                            id="mona-upload-woment"
                            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.ppt,.pptx,.odt,.avi,.ogg,.m4a,.mov,.mp3,.mp4,.mpg,.wav,.wmv"
                            aria-invalid="false"
                          />
                        </span>
                        <span className="txt"><span className="hl-txt">+</span> Add photo</span>
                      </label>
                    </p> */}
                  {/* </div>
                  <p></p>
                </div>
                <div className="frow">
                  <span className="wpcf7-form-control-wrap textarea-80">
                    <textarea
                      name="textarea-80"
                      cols="40"
                      rows="10"
                      className="wpcf7-form-control wpcf7-textarea fcontrol gray-control"
                      aria-invalid="false"
                      placeholder="Description"
                    ></textarea>
                  </span>
                </div>
                <p></p>
              </div>
              <p></p>
            </div>
            <div className="fgroup">
              <div className="lb"><span className="num">3</span> Your Measurement</div>
              <div className="controls-wrap">
                <span className="wpcf7-form-control-wrap textarea-880">
                  <textarea
                    name="textarea-880"
                    cols="40"
                    rows="10"
                    className="wpcf7-form-control wpcf7-textarea fcontrol gray-control"
                    aria-invalid="false"
                    placeholder="Measurement"
                  ></textarea>
                </span>
              </div>
              <p></p>
            </div>
            <p>
              <input type="submit" value="Confirm" className="wpcf7-form-control wpcf7-submit primary-btn btn fw-btn" />
              <span className="ajax-loader"></span>
            </p>  */}
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
