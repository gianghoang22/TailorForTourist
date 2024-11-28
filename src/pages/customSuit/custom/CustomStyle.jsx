import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { addToCart } from '../../../utils/cartUtil';
import './CustomStyle.scss';
import { toast } from 'react-toastify';

//jk-style
import jk_style1B1B from '../../../assets/img/iconCustom/jk-style-1B1B.jpg';
import jk_style1B2B from '../../../assets/img/iconCustom/jk-style-1B2B.jpg';
import jk_style1B3B from '../../../assets/img/iconCustom/jk-style-1B3B.jpg';
import jk_style2B2B from '../../../assets/img/iconCustom/jk-style-2B2B.jpg';
import jk_style2B4B from '../../../assets/img/iconCustom/jk-style-2B4B.jpg';
import jk_style2B6B from '../../../assets/img/iconCustom/jk-style-2B6B.jpg';
import jk_styleM from '../../../assets/img/iconCustom/jk-style-M.jpg';

//jk-fit
import jk_fit_slim from '../../../assets/img/iconCustom/jk-fit-slim.jpg';
import jk_fit_regular from '../../../assets/img/iconCustom/jk-fit-regular.jpg';

//jk-lapels
import jk_lapels_notch from '../../../assets/img/iconCustom/jk-lapel-notch.jpg';
import jk_lapels_peak from '../../../assets/img/iconCustom/jk-lapel-peak.jpg';
import jk_lapels_shawl from '../../../assets/img/iconCustom/jk-lapel-shawl.jpg';

//jk-lapel-width
import jk_lapelw_medium from '../../../assets/img/iconCustom/jk-lapelw-medium.jpg';
import jk_lapelw_narrow from '../../../assets/img/iconCustom/jk-lapelw-narrow.jpg';
import jk_lapelw_wide from '../../../assets/img/iconCustom/jk-lapelw-wide.jpg';

//jk-pk-style
import jk_pocket_flap from '../../../assets/img/iconCustom/jk-pocket-flap.jpg';
import jk_pocket_nopk from '../../../assets/img/iconCustom/jk-pocket-nopk.jpg';
import jk_pocket_patched from '../../../assets/img/iconCustom/jk-pocket-patched.jpg';
import jk_pocket_welted from '../../../assets/img/iconCustom/jk-pocket-welted.jpg';

//slant

//jk-sleevebtn
import jk_sleeve_Button_2 from '../../../assets/img/iconCustom/jk-sleeveButton-2.jpg';
import jk_sleeve_Button_3 from '../../../assets/img/iconCustom/jk-sleeveButton-3.jpg';
import jk_sleeve_Button_4 from '../../../assets/img/iconCustom/jk-sleeveButton-4.jpg';
import jk_sleeve_Button from '../../../assets/img/iconCustom/jk-sleeveButton.jpg';

//jk-backstyle
import jk_backstyle_ventless from '../../../assets/img/iconCustom/jk-backStyle-ventless.jpg';
import jk_backstyle_sideVent from '../../../assets/img/iconCustom/jk-backStyle-sideVent.jpg';
import jk_backstyle_centervent from '../../../assets/img/iconCustom/jk-backStyle-centervent.jpg';

//breast pocket
import jk_breastPocket_no from '../../../assets/img/iconCustom/jk-breastPocket-no.jpg';
import jk_breastPocket_yes from '../../../assets/img/iconCustom/jk-breastPocket-yes.jpg';
import jk_breastPocket_patched from '../../../assets/img/iconCustom/jk-breastPocket-patched.jpg';
import jk_breastPocket from '../../../assets/img/iconCustom/jk-breastPocket.jpg';

//pants
import pants_fit_slim from '../../../assets/img/iconCustom/p-fit-slim.jpg';
import pants_fit_regular from '../../../assets/img/iconCustom/p-fit-regular.jpg';

//pant pleats
import pants_pleats_double from '../../../assets/img/iconCustom/p-pleats-double.jpg';
import pants_pleats_no from '../../../assets/img/iconCustom/p-pleats-no.jpg';
import pants_pleats_pleated from '../../../assets/img/iconCustom/p-pleats-pleated.jpg';

//fastening
import pants_fastent_center from '../../../assets/img/iconCustom/p-fastent-center.jpg';
import pants_fastent_centerNobtn from '../../../assets/img/iconCustom/p-fastent-centerNobtn.jpg';
import pants_fastent_displaced from '../../../assets/img/iconCustom/p-fastent-displaced.jpg';
import pants_fastent_displaceNobtn from '../../../assets/img/iconCustom/p-fastent-displaceNobtn.jpg';

//side pocket
import p_pocket_diagonal from '../../../assets/img/iconCustom/p-pocket-diagonal.jpg';
import p_pocket_vertical from '../../../assets/img/iconCustom/p-pocket-vertical.jpg';
import p_pocket_rounded from '../../../assets/img/iconCustom/p-pocket-rounded.jpg';

//back pocket
import p_bpk_2flap from '../../../assets/img/iconCustom/p-bpk-2flap.jpg';
import p_bpk_2patched from '../../../assets/img/iconCustom/p-bpk-2patched.jpg';
import p_bpk_2welted from '../../../assets/img/iconCustom/p-bpk-2welted.jpg';
import p_bpk_flap from '../../../assets/img/iconCustom/p-bpk-flap.jpg';
import p_bpk_no from '../../../assets/img/iconCustom/p-bpk-no.jpg';
import p_bpk_patched from '../../../assets/img/iconCustom/p-bpk-patched.jpg';
import p_bpk_welted from '../../../assets/img/iconCustom/p-bpk-welted.jpg';

//pant cuff
import p_cuff_no from '../../../assets/img/iconCustom/p-cuff-no.jpg';
import p_cuff_yes from '../../../assets/img/iconCustom/p-cuff-yes.jpg';

//vest
import wc_vestNo from '../../../assets/img/iconCustom/wc-vestNo.png';
import wc_vestYes from '../../../assets/img/iconCustom/wc-vestYes.png';

// Map optionType to their corresponding images
const optionTypeImages = {
  'single-breasted 1 button': jk_style1B1B,
  'single-breasted 2 button': jk_style1B2B,
  'single-breasted 3 button': jk_style1B3B,
  'double-breasted 2 button': jk_style2B2B,
  'double-breasted 4 button': jk_style2B4B,
  'double-breasted 6 button': jk_style2B6B,
  'mandarin': jk_styleM,
  'Slim fit': jk_fit_slim,
  'Regular': jk_fit_regular,
  'Norch': jk_lapels_notch,
  'Peak': jk_lapels_peak,
  'Shawl': jk_lapels_shawl,
  'Standard': jk_lapelw_medium,
  'Slim': jk_lapelw_narrow,
  'Wide': jk_lapelw_wide,
  'No pocket': jk_pocket_nopk,
  'With Flap': jk_pocket_flap,
  'Double-Welted': jk_pocket_welted,
  'Patched': jk_pocket_patched,
  'With flap x3': jk_pocket_flap,
  'Double-Welted x3': jk_pocket_welted,
  // thieu slan
  '0': jk_sleeve_Button,
  '2': jk_sleeve_Button_2,
  '3': jk_sleeve_Button_3,
  '4': jk_sleeve_Button_4,
  'Ventless': jk_backstyle_ventless,
  'Center Vent': jk_backstyle_centervent,
  'Side Vent': jk_backstyle_sideVent,
  'No': jk_breastPocket_no,
  'Yes': jk_breastPocket_yes,
  'Patched x2': jk_breastPocket_patched,
  'slim fit': pants_fit_slim,
  'regular fit': pants_fit_regular,
  'no pleats': pants_pleats_no,
  'pleated': pants_pleats_pleated,
  'Double pleats': pants_pleats_double,
  'Centered': pants_fastent_center,
  'Displaced': pants_fastent_displaced,
  'No button': pants_fastent_centerNobtn,
  'Off-centered: Buttonless': pants_fastent_centerNobtn,
  'Diagonal': p_pocket_diagonal,
  'Vertical': p_pocket_vertical,
  'Rounded': p_pocket_rounded,
  'No Pockets': p_bpk_no,
  'Double-Welted Pocket With Button': p_bpk_2welted,
  'Patched': p_bpk_patched,
  'Flap Pockets': p_bpk_flap,
  'Double-Welted Pocket With Button x2': p_bpk_2welted,
  'Patched x2': p_bpk_2patched,
  'No pant cuffs': p_cuff_no,
  'With pant cuffs': p_cuff_yes,
  '2 piece suit': wc_vestNo,
  '3 piece suit': wc_vestYes
};

const CustomStyle = () => {
  const [styles, setStyles] = useState([]);
  const [styleOptions, setStyleOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openOptionType, setOpenOptionType] = useState([]);
  const [selectedOptionValues, setSelectedOptionValues] = useState({});
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [fabricId, setFabricId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedImages, setSelectedImages] = useState({});

  // Fetch both styles and options in parallel
  useEffect(() => {
    const savedFabricId = localStorage.getItem('selectedFabricID');
    setFabricId(savedFabricId);
    console.log('Fabric ID: ', savedFabricId);
    const fetchStylesAndOptions = async () => {
      try {
        const [stylesResponse, optionsResponse] = await Promise.all([
          axios.get('https://localhost:7194/api/Style'),
          axios.get('https://localhost:7194/api/StyleOption')
        ]);

        setStyles(stylesResponse.data);
        setStyleOptions(optionsResponse.data);

        // Auto-select first option for each optionType if none selected
        if (!localStorage.getItem('styleOptionId')) {
          const firstStyle = stylesResponse.data[0];
          if (firstStyle) {
            const uniqueOptionTypes = Array.from(
              new Set(optionsResponse.data
                .filter(option => option.styleId === firstStyle.styleId)
                .map(option => option.optionType))
            );

            const initialSelections = {};
            const initialImages = {};
            const selectedIds = [];

            uniqueOptionTypes.forEach(optionType => {
              const firstOption = optionsResponse.data.find(
                option => option.styleId === firstStyle.styleId && option.optionType === optionType
              );
              if (firstOption) {
                initialSelections[optionType] = firstOption.styleOptionId;
                initialImages[optionType] = optionTypeImages[firstOption.optionValue];
                selectedIds.push(firstOption.styleOptionId);
              }
            });

            setSelectedOptions(initialSelections);
            setSelectedImages(initialImages);
            localStorage.setItem('styleOptionId', JSON.stringify(selectedIds));
          }
        }
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
  
  const handleOptionValueClick = (styleOption) => {
    setSelectedOptions(prev => ({
      ...prev,
      [styleOption.optionType]: styleOption.styleOptionId
    }));

    setSelectedImages(prev => ({
      ...prev,
      [styleOption.optionType]: optionTypeImages[styleOption.optionValue]
    }));

    const selections = Object.values(selectedOptions);
    if (!selections.includes(styleOption.styleOptionId)) {
      selections.push(styleOption.styleOptionId);
    }
    
    localStorage.setItem('styleOptionId', JSON.stringify(selections));
    toast.success(`${styleOption.optionType} updated to ${styleOption.optionValue}`);
    console.log('Selected options:', selectedOptions);
  };

  const getOptionValues = (styleId, optionType) => {
    return styleOptions.filter(option => option.styleId === styleId && option.optionType === optionType);
  };

  const isOptionSelected = (styleOption) => {
    return selectedOptions[styleOption.optionType] === styleOption.styleOptionId;
  };

  const handleNextClick = (e) => {
    // Check if at least one style option has been selected
    if (Object.keys(selectedOptions).length === 0) {
      e.preventDefault();
      toast.error('Please select at least one style option before continuing');
      return;
    }

    // Save the selections to localStorage
    const selectedIds = Object.values(selectedOptions);
    localStorage.setItem('styleOptionId', JSON.stringify(selectedIds));
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
                        {/* <img 
                            src={jk_style1B1B} 
                            className="option-type-image" 
                          /> */}
                          {optionType}
                        </span>
                      </a>
                      {/* Hiển thị các option-value tương ứng */}
                      {openOptionType.includes(optionType) && (
                        <ul className="option-values">
                        {getOptionValues(style.styleId, optionType).map(styleOption => (
                          <li
                            key={styleOption.styleOptionId}
                            className={`option-value ${isOptionSelected(styleOption) ? 'selected' : ''}`}
                            onClick={() => handleOptionValueClick(styleOption)}
                          >
                            <img
                              src={optionTypeImages[styleOption.optionValue]}
                              alt={styleOption.optionValue}
                              className="option-value-image"
                            />
                            <span>{styleOption.optionValue}</span>
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
        <div className='selected-style-details'>
          <div className="product-info" id="pd_info">
            <h1 className="pd-name">
              CUSTOM 
              <span>SUIT</span>
            </h1>
            
            {/* Display selected options and their images */}
            <div className="selected-options-preview">
              {Object.entries(selectedImages).map(([optionType, imageUrl]) => (
                <div key={optionType} className="selected-option">
                  <h3>{optionType}</h3>
                  <img 
                    src={imageUrl} 
                    alt={`Selected ${optionType}`}
                    className="selected-option-image"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='next-btn'>
          <Link to="/custom-suits/lining" onClick={handleNextClick}>
            <button className='navigation-button'>Go to Lining</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomStyle;
