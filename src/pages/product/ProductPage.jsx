import { Link } from 'react-router-dom'; // Thêm import Link
import PropTypes from 'prop-types';
import { Sidebar } from '../../layouts/components/sidebar/Sidebar';
import './ProductPage.scss';

// Product Collection Data
const productCollection = {
  title: "Product Collection",
  products: [
    {
      id: 1,
      name: "Veston",
      price: 200,
      image: "https://owen.cdn.vccloud.vn/media/catalog/product/cache/01755127bd64f5dde3182fd2f139143a/v/e/ves231494._40.jpg",
    },
    {
      id: 2,
      name: "Polo Shirt",
      price: 150,
      image: "https://owen.cdn.vccloud.vn/media/catalog/product/cache/01755127bd64f5dde3182fd2f139143a/v/e/ves231494._40.jpg",
    },
    {
      id: 3,
      name: "Shirts",
      price: 100,
      image: "https://owen.cdn.vccloud.vn/media/catalog/product/cache/01755127bd64f5dde3182fd2f139143a/v/e/ves231494._40.jpg",
    },
    // Add more products here
  ],
};

// ProductItem Component
const ProductItem = ({ product }) => {
  return (
    <div className="col-md-4">
      <Link to={`/product/${product.id}`} className="card"> {/* Thêm liên kết */}
        <img src={product.image} alt={product.name} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">${product.price}</p>
        </div>
      </Link>
    </div>
  );
};

// PropTypes validation for ProductItem
ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

// Product Collection Component
const Product = () => {
  return (
    <div>
      <h1>{productCollection.title}</h1>
      <div className="row">
        {productCollection.products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const ProductPage = () => {
  return (
    <>
      {/* <Navigation /> */}

      {/* Header promotion */}
      <div className="header-promotion">
        <div className="header-promotion__slide slick-initialized slick-slider slick-vertical">
          <div className="slick-list draggable">
            <div className="slick-track">
              <div className="slick-slide slick-current slick-active" data-slick-index="0" aria-hidden="false">
                <div>
                  <div className="header-promotion__slide-item">
                    <p>
                      VEST COLLECTION - 
                      <span>
                        <strong>
                          <a href="#">BUY NOW</a>
                        </strong>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="banner-container">
        <img src="https://owen.vn/media/catalog/category/veston_2.jpg" className="banner-image" alt="Áo Vest Nam" />
        <div className="banner-category">
          <h1 className="banner-title">
            Áo Vest Nam
          </h1>
          <div className="banner-description">
            Áo vest nam đẹp, cập nhật phong cách theo xu hướng mới nhất, được sản xuất từ những chất liệu cao cấp của OWEN mang đến cho các quý ông một phong cách lịch lãm
          </div>
        </div>
      </div>

      <div className="columns">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Product Section */}
        <div className="row-9 main">
          <Product />
        </div>
      </div>

      {/* <Footer /> */}
    </>
  )
}

export default ProductPage;
