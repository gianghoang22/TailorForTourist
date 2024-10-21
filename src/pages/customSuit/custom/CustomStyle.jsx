import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { addToCart } from '../../../utils/cartUtil';
import './CustomStyle.scss';

import jk_style1B1B from '../../../assets/img/iconCustom/jk-style-1B1B.jpg';
import jk_style1B2B from '../../../assets/img/iconCustom/jk-style-1B2B.jpg';
import jk_style1B3B from '../../../assets/img/iconCustom/jk-style-1B3B.jpg';
import jk_style2B2B from '../../../assets/img/iconCustom/jk-style-2B2B.jpg';
import jk_style2B4B from '../../../assets/img/iconCustom/jk-style-2B4B.jpg';
import jk_style2B6B from '../../../assets/img/iconCustom/jk-style-2B6B.jpg';
import jk_styleM from '../../../assets/img/iconCustom/jk-style-M.jpg';

// Map optionType to their corresponding images
const optionTypeImages = {
  'single-breasted 1 button': jk_style1B1B,
  'single-breasted 2 button': jk_style1B2B,
  'single-breasted 3 button': jk_style1B3B,
  'double-breasted 2 button': jk_style2B2B,
  'double-breasted 4 button': jk_style2B4B,
  'double-breasted 6 button': jk_style2B6B,
  'mandarin': jk_styleM
};

const CustomStyle = () => {
  const [styles, setStyles] = useState([]);
  const [styleOptions, setStyleOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openOptionType, setOpenOptionType] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null); // Track the selected style

  useEffect(() => {
    const fetchStylesAndOptions = async () => {
      try {
        const [stylesResponse, optionsResponse] = await Promise.all([
          axios.get('https://localhost:7194/api/Style'),
          axios.get('https://localhost:7194/api/StyleOption')
        ]);

        setStyles(stylesResponse.data);
        setStyleOptions(optionsResponse.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStylesAndOptions();
  }, []);

  const handleOptionTypeClick = (optionType) => {
    setOpenOptionType((prev) =>
      prev.includes(optionType) ? prev.filter(type => type !== optionType) : [...prev, optionType]
    );
  };

  const handleOptionValueClick = (optionValue, style) => {
    setSelectedImage(optionTypeImages[optionValue]); // Display image for selected option value
    setSelectedStyle({ styleId: style.styleId, styleName: style.styleName, optionValue });
  };

  const getOptionValues = (styleId, optionType) => {
    return styleOptions.filter(option => option.styleId === styleId && option.optionType === optionType);
  };

  const handleAddToCart = () => {
    if (selectedStyle) {
      addToCart({
        name: selectedStyle.styleName,
        imageUrl: selectedStyle.imageUrl,
      })
      alert(`${selectedStyle.styleName} has been added to the cart!`);
    }
     else {
      alert('Please select a style first.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='custom-style-container'>
      {/* left content */}
      <div className='sec-product left-content'>
        <ul className='side-menu'>
          {styles.map((style) => (
            <li key={style.styleId}>
              <div className="style-item">
                <div className="style-name">
                  {style.styleName}
                </div>
              </div>
              <ul className="submenu">
                {Array.from(new Set(styleOptions.filter(option => option.styleId === style.styleId).map(option => option.optionType))).map(optionType => (
                  <li key={optionType}>
                    <div className="option-type" onClick={(e) => { e.stopPropagation(); handleOptionTypeClick(optionType); }}>
                      <a className="toggle-opts" data-direction="font">
                        <span className="suitIcon">
                        <img 
                            src={optionTypeImages[optionType]} 
                            alt={optionType} 
                            className="option-type-image" 
                          />
                          {optionType}
                        </span>
                      </a>
                      {openOptionType.includes(optionType) && (
                        <ul className="option-values">
                        {getOptionValues(style.styleId, optionType).map(option => (
                          <li 
                            key={option.styleOptionId} 
                            className="option-value" 
                            onClick={(e) => { e.stopPropagation(); handleOptionValueClick(option.optionValue, style); }}
                          >
                            <img 
                              src={optionTypeImages[option.optionValue]} 
                              alt={option.optionValue} 
                              className="option-value-image"
                            />
                            {option.optionValue}
                          </li>
                        ))}
                      </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      
      {/* right content */}
      <div className='right-content'>
        {selectedStyle && (
          <div className='selected-style-details'>
            <div className="product-info" id="pd_info">
            <h1 className="pd-name">
                CUSTOM 
                <span>SUIT</span>
              </h1>
            <h3>Selected Style:</h3>
            {selectedImage && <img src={selectedImage} alt={selectedImage} />}
            <p><strong>Style:</strong> {selectedStyle.styleName}</p>
            <p><strong>Option:</strong> {selectedStyle.optionValue}</p>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
            </div>
          </div>
        )}

        
      {/* Next button */}
      <div className='next-btn'>
        <Link to="/custom-suits/lining">
          <button className='navigation-button'>Go to Lining</button>
        </Link>
      </div>
      </div>
    </div>
  );
};

export default CustomStyle;
