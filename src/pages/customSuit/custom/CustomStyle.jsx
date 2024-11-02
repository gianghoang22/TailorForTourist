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
  const [openOptionType, setOpenOptionType] = useState([]); // Điều khiển mở rộng loại tùy chọn
  const [selectedOptionValues, setSelectedOptionValues] = useState({}); // Lưu lựa chọn của từng optionType
  const [selectedStyle, setSelectedStyle] = useState(null);  // Lưu style đã chọn

  // Fetch both styles and options in parallel
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
        setError('Failed to load styles or options. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStylesAndOptions();
  }, []);

  // Mở rộng hoặc đóng optionType khi người dùng nhấp vào
  const handleOptionTypeClick = (optionType) => {
    setOpenOptionType((prev) =>
      prev.includes(optionType) ? prev.filter(type => type !== optionType) : [...prev, optionType]
    );
  };

  // Xử lý khi người dùng chọn một option-value
  const handleOptionValueClick = (optionValue, style, optionType) => {
    // Cập nhật selectedOptionValues: chỉ một optionValue được chọn trong mỗi optionType
    setSelectedOptionValues((prev) => ({
      ...prev,
      [optionType]: optionValue  // Đảm bảo mỗi optionType chỉ có một giá trị optionValue được chọn
    }));

    const newSelectedStyle = {
      styleId: style.styleId,
      styleName: style.styleName,
      optionType,
      optionValue
    };

    setSelectedStyle(newSelectedStyle);

    // Tự động thêm sản phẩm vào giỏ hàng sau khi người dùng chọn option-value
    addToCart({
      id: newSelectedStyle.styleId, // Gán style ID
      name: newSelectedStyle.styleName,
      optionType: newSelectedStyle.optionType,
      optionValue: newSelectedStyle.optionValue,
      imageUrl: optionTypeImages[newSelectedStyle.optionValue], // Đường dẫn ảnh
      type: 'style' // Xác định đây là kiểu 'style'
    });
  };

  // Lấy các optionValues thuộc về styleId và optionType cụ thể
  const getOptionValues = (styleId, optionType) => {
    return styleOptions.filter(option => option.styleId === styleId && option.optionType === optionType);
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
                {/* Duyệt qua từng optionType trong style */}
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
                      {/* Hiển thị các option-value tương ứng */}
                      {openOptionType.includes(optionType) && (
                        <ul className="option-values">
                          {getOptionValues(style.styleId, optionType).map(option => (
                            <li 
                              key={option.styleOptionId} 
                              className={`option-value ${selectedOptionValues[optionType] === option.optionValue ? 'selected' : ''}`}  // Chỉ hiển thị một optionValue được chọn
                              onClick={(e) => { e.stopPropagation(); handleOptionValueClick(option.optionValue, style, optionType); }}
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
              <img src={optionTypeImages[selectedStyle.optionValue]} alt="Selected option" />
              <p><strong>Style:</strong> {selectedStyle.styleName}</p>
              <p><strong>Option:</strong> {selectedStyle.optionValue}</p>
            </div>
          </div>
        )}

        {/* Nút chuyển tới bước Lining */}
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
