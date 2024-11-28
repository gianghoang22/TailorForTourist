import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCart, getCart, addToGuestCart } from '../../../utils/cartUtil';
import './CustomLining.scss';
import lining_icon from '../../../assets/img/iconCustom/icon-accent-vailot.jpg';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = "https://localhost:7194/api/AddCart/addtocart";

const calculateCustomPrice = async () => {
  try {
    // Get the selected IDs from localStorage
    const fabricId = parseInt(localStorage.getItem('selectedFabricID'));
    const liningId = parseInt(localStorage.getItem('liningId'));
    const styleOptionIds = JSON.parse(localStorage.getItem('styleOptionId')) || [];

    // Fetch fabric price
    const fabricResponse = await axios.get(`https://localhost:7194/api/Fabrics/${fabricId}`);
    const fabricPrice = fabricResponse.data.price || 0;

    // Fetch lining price
    const liningResponse = await axios.get(`https://localhost:7194/api/Linings/${liningId}`);
    const liningPrice = liningResponse.data.price || 0;

    // Fetch style option prices
    const styleOptionPrices = await Promise.all(
      styleOptionIds.map(async (id) => {
        const response = await axios.get(`https://localhost:7194/api/StyleOption/${id}`);
        return response.data.price || 0;
      })
    );

    // Calculate total price
    const basePrice = 500; // Base price for a custom suit
    const totalStyleOptionsPrice = styleOptionPrices.reduce((sum, price) => sum + price, 0);
    const totalPrice = basePrice + fabricPrice + liningPrice + totalStyleOptionsPrice;

    return totalPrice;
  } catch (error) {
    console.error('Error calculating custom price:', error);
    return 0; // Return 0 or some default price if calculation fails
  }
};

const CustomLining = () => {
  const [linings, setLinings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLining, setSelectedLining] = useState(null);
  const userId = localStorage.getItem("userID");
  const measurementId = localStorage.getItem("measurementId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLinings = async () => {
      try {
        const response = await fetch('https://localhost:7194/api/Linings');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLinings(data);

        // Auto-select first lining if none selected
        if (!localStorage.getItem('liningId') && data.length > 0) {
          handleLiningClick(data[0]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLinings();
  }, []);
  
  const handleLiningClick = (lining) => {
    setSelectedLining(lining);
    localStorage.setItem('liningId', lining.liningId); // Save the selected lining ID to localStorage
    addToCart({
      id: lining.liningId,
      type: 'lining',
    });
  };
  
  const handleNextClick = async () => {
    // Check if all required selections are made
    const fabricId = localStorage.getItem('selectedFabricID');
    const styleOptionIds = localStorage.getItem('styleOptionId');
    const liningId = localStorage.getItem('liningId');

    if (!fabricId) {
      toast.error('Please select a fabric first');
      navigate('/custom-suits/fabric');
      return;
    }

    if (!styleOptionIds) {
      toast.error('Please select style options first');
      navigate('/custom-suits/style');
      return;
    }

    if (!liningId) {
      toast.error('Please select a lining');
      return;
    }

    try {
      let fabricId = parseInt(localStorage.getItem('selectedFabricID'));
      let styleOptionIds = JSON.parse(localStorage.getItem('styleOptionId'));
      let liningId = parseInt(localStorage.getItem('liningId'));

      // If any selection is missing, fetch and select the first available option
      if (!fabricId || !styleOptionIds || !liningId) {
        if (!fabricId) {
          const fabricResponse = await axios.get('https://localhost:7194/api/Fabrics');
          fabricId = fabricResponse.data[0].fabricID;
          localStorage.setItem('selectedFabricID', fabricId);
        }

        if (!styleOptionIds) {
          const styleResponse = await axios.get('https://localhost:7194/api/StyleOption');
          styleOptionIds = [styleResponse.data[0].styleOptionId];
          localStorage.setItem('styleOptionId', JSON.stringify(styleOptionIds));
        }

        if (!liningId) {
          const liningResponse = await axios.get('https://localhost:7194/api/Linings');
          liningId = liningResponse.data[0].liningId;
          localStorage.setItem('liningId', liningId);
        }
      }

      const measurementId = parseInt(localStorage.getItem('measurementId'), 10);
      const userID = parseInt(localStorage.getItem("userID"));
      
      // Get fabric name from your fabric data
      const fabricResponse = await axios.get(`https://localhost:7194/api/Fabrics/${fabricId}`);
      const fabricName = fabricResponse.data.fabricName;

      // Generate a simple product code
      const productCode = `SUIT${fabricName}`;

      if (!fabricId || styleOptionIds.length === 0 || !liningId || !measurementId) {
        toast.error('Please complete all selections before proceeding.');
        return;
      }

      const pickedStyleOptions = styleOptionIds.map((id) => ({
        styleOptionID: id
      }));

      const payload = {
        userId: userID,
        isCustom: true,
        customProduct: {
          categoryID: 5,
          fabricID: fabricId,
          liningID: liningId,
          measurementID: measurementId,
          pickedStyleOptions: pickedStyleOptions,
          productCode: productCode  // Simple product code
        },
      };

      console.log('Payload:', payload);

      const response = await axios.post(API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        // toast.success('Successfully added to cart!');
        navigate("/measure");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart. Please try again.');
    }
  };
  


  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className='custom-lining-container'>
      <div className='left-half'>
        <div className='tag-buttons'>
          <li className='active'>
            <a>
              <img src={lining_icon} alt="Internal lining icon" className='tag-icon' />
              Internal Lining
            </a>
          </li>
        </div>

        <div className='right-items-lining'>
          <ul className="list-lining">
            {linings.map((lining) => (
              <li
                key={lining.liningId}
                className={`lining-item ${selectedLining && selectedLining.liningId === lining.liningId ? 'selected' : ''}`}
                onClick={() => handleLiningClick(lining)}
              >
                <div className="lining-img">
                  {lining.imageUrl ? <img style={{width: '130px', height: '100px'}} src={lining.imageUrl} alt={lining.liningName} /> : 'No image available'}
                </div>
                <div className="lining-name">{lining.liningName}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className='right-half'>
        {selectedLining && (
          <div className='lining-details'>
            <div className="product-info" id='pd_info'>
              <h1 className="pd-name">CUSTOM <span>SUIT</span></h1>
              <p className='composition set'>{selectedLining.description}</p>
              <p className='price'>{selectedLining.liningName}</p>
              <div className="lining-img"
              style={{width:'300px', height:'231px'}}>
                {selectedLining.imageUrl ? <img src={selectedLining.imageUrl} alt={selectedLining.liningName} /> : 'No image available'}
              </div>
            </div>
          </div>
        )}

        <div className='next-btn'>
          <button className='navigation-button' onClick={handleNextClick}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomLining;
