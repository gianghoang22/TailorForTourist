import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCart, getCart } from '../../../utils/cartUtil';
import './CustomLining.scss';
import lining_icon from '../../../assets/img/iconCustom/icon-accent-vailot.jpg';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = "https://localhost:7194/api/AddCart/addtocart";

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
    // Fetch the list of linings from the API
    const fetchLinings = async () => {
      try {
        const response = await fetch('https://localhost:7194/api/Linings');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLinings(data);
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
    try {
      // Lấy dữ liệu từ localStorage
      const fabricId = parseInt(localStorage.getItem('selectedFabricID')); 
      const styleOptionIds = JSON.parse(localStorage.getItem('styleOptionId')) || [];
      const liningId = parseInt(localStorage.getItem('liningId'));
      const measurementId = parseInt(localStorage.getItem('measurementId'), 10);
      const userID = parseInt(localStorage.getItem("userID"));

      console.log('fabricId ', fabricId);
      console.log('styleOptionIds ', styleOptionIds);
      console.log('liningId ', liningId);
      console.log('measurementId ', measurementId);
      console.log('userID ', userID);
  
      // Kiểm tra thông tin đã đủ chưa
      if (!fabricId || styleOptionIds.length === 0 || !liningId || !measurementId) {
        toast.error('Please complete all selections before proceeding.');
        return;
      }
  
      // Chuyển đổi styleOptionIds sang mảng đối tượng [{styleOptionID: x}]
      const pickedStyleOptions = styleOptionIds.map((id) => ({
        styleOptionID: id
      }));
  
      // Tạo payload gửi lên API
      const payload = {
        userId: userID,
        isCustom: true,
        customProduct: {
          categoryID: 5,
          fabricID: fabricId,
          liningID: liningId,
          measurementID: measurementId,
          pickedStyleOptions: pickedStyleOptions,
        },
      };
  
      // Log payload để kiểm tra
      console.log('Payload gửi lên API:', JSON.stringify(payload, null, 2));
  
      // Gửi request
      const response = await axios.post(API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      // Xử lý response
      if (response.status === 200 || response.status === 201) {
        console.log('API Response:', response.data);
        toast.success('Successfully added to cart!');
        navigate("/measure");
      } else {
        throw new Error('Failed to add to cart');
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
          <button className='navigation-button' onClick={handleNextClick}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default CustomLining;
