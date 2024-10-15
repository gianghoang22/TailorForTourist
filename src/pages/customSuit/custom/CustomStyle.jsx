import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CustomStyle.scss';
import jk_style1B1B from '../../../assets/img/iconCustom/jk-style-1B1B.jpg';
import jk_style1B2B from '../../../assets/img/iconCustom/jk-style-1B2B.jpg';
import jk_style1B3B from '../../../assets/img/iconCustom/jk-style-1B3B.jpg';
import jk_style2B2B from '../../../assets/img/iconCustom/jk-style-2B2B.jpg';
import jk_style2B4B from '../../../assets/img/iconCustom/jk-style-2B4B.jpg';
import jk_style2B6B from '../../../assets/img/iconCustom/jk-style-2B6B.jpg';
import jk_styleM from '../../../assets/img/iconCustom/jk-style-M.jpg';

const imageMap = {
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
  const [openOptionType, setOpenOptionType] = useState([]); // Tracks open option types
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchStylesAndOptions = async () => {
      try {
        const [stylesResponse, optionsResponse] = await Promise.all([
          axios.get('https://localhost:7244/api/Style'),
          axios.get('https://localhost:7244/api/StyleOption')
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

  // Toggle option type dropdown open/close
  const handleOptionTypeClick = (optionType) => {
    setOpenOptionType((prev) => 
      prev.includes(optionType) ? prev.filter(type => type !== optionType) : [...prev, optionType]
    );
  };

  // Handle option value click to select an image
  const handleOptionValueClick = (optionValue) => {
    setSelectedImage(imageMap[optionValue]);
  };

  // Get option values for a specific style and option type
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
      <div className='sec-product left-content'>
        <ul>
          {styles.map((style) => (
            <li key={style.styleId}>
              <div className="style-item">
                <div className="style-name">{style.styleName}</div>
                {/* <div className="style-description">{style.description}</div> */}
              </div>
              <ul className="submenu">
                {Array.from(new Set(styleOptions.filter(option => option.styleId === style.styleId).map(option => option.optionType))).map(optionType => (
                  <li key={optionType}>
                    <div className="option-type" onClick={(e) => { e.stopPropagation(); handleOptionTypeClick(optionType); }}>
                      {optionType}
                      {openOptionType.includes(optionType) && (  // Check if option type is open
                        <ul className="option-values">
                          {getOptionValues(style.styleId, optionType).map(option => (
                            <li key={option.styleOptionId} className="option-value" onClick={(e) => { e.stopPropagation(); handleOptionValueClick(option.optionValue); }}>
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
      <div className='right-content'>
        {selectedImage && <img src={selectedImage} alt='Selected Option' />}
      </div>
    </div>
  );
};

export default CustomStyle;
