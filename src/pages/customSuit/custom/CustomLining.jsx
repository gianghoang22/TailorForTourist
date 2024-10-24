import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from '../../../utils/cartUtil';  // Import the utility function directly
import './CustomLining.scss';
import lining_icon from '../../../assets/img/iconCustom/icon-accent-vailot.jpg';

const CustomLining = () => {
  const [linings, setLinings] = useState([]);  // Lưu trữ danh sách các lining
  const [loading, setLoading] = useState(true);  // Trạng thái loading
  const [error, setError] = useState(null);  // Trạng thái lỗi
  const [selectedLining, setSelectedLining] = useState(null);  // Lưu trữ lining đã chọn

  // Fetch lining data on component mount
  useEffect(() => {
    const fetchLinings = async () => {
      try {
        const response = await fetch('https://localhost:7194/api/Linings');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLinings(data);  // Lưu dữ liệu linings
      } catch (error) {
        setError(error.message);  // Set error state
      } finally {
        setLoading(false);  // Loading completed
      }
    };
    fetchLinings();
  }, []);

  // Xử lý khi người dùng chọn một Lining
  const handleLiningClick = (lining) => {
    setSelectedLining(lining);  // Cập nhật lining được chọn

    // Tự động thêm vào giỏ hàng sau khi chọn lining
    addToCart({
      id: lining.liningId,
      name: lining.liningName,
      imageUrl: lining.imageUrl,
      type: 'lining',
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

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

        {/* Danh sách các lining */}
        <div className='right-items-lining'>
          <ul className="list-lining">
            {linings.map((lining) => (
              <li
                key={lining.liningId}
                className={`lining-item ${selectedLining && selectedLining.liningId === lining.liningId ? 'selected' : ''}`}
                onClick={() => handleLiningClick(lining)}  // Gọi handleLiningClick khi người dùng bấm chọn lining
              >
                <div className="lining-img">
                  {lining.imageUrl ? <img src={lining.imageUrl} alt={lining.liningName} /> : 'No image available'}
                </div>
                <div className="lining-name">{lining.liningName}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chi tiết lining được chọn */}
      <div className='right-half'>
        {selectedLining && (
          <div className='lining-details'>
            <div className="product-info" id='pd_info'>
              <h1 className="pd-name">CUSTOM <span>SUIT</span></h1>
              <p className='composition set'>{selectedLining.description}</p>
              <p className='price'>{selectedLining.liningName}</p>
              <div className="lining-img">
                {selectedLining.imageUrl ? <img src={selectedLining.imageUrl} alt={selectedLining.liningName} /> : 'No image available'}
              </div>
            </div>
          </div>
        )}

        {/* Nút chuyển tới giỏ hàng */}
        <div className='next-btn'>
          <Link to="/cart">
            <button className='navigation-button'>Next</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomLining;
