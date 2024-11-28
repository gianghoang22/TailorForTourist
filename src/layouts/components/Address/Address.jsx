import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Address.scss';

const Address = ({ initialAddress, onAddressChange }) => {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [userAddress, setUserAddress] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchProvinces();
        if (initialAddress) {
          setUserAddress(initialAddress);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading initial data:', err);
      }
    };

    loadInitialData();
  }, [initialAddress]);

  const fetchProvinces = async () => {
    try {
      const response = await axios.get('https://localhost:7194/api/Shipping/provinces');
      if (response.data) {
        setProvinces(response.data);
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
      setError('Không thể tải danh sách tỉnh/thành phố');
    }
  };

  const fetchDistricts = async (provinceID) => {
    if (!provinceID) return;
    
    try {
      const response = await axios.get(`https://localhost:7194/api/Shipping/districts?provinceId=${provinceID}`);
      if (response.data) {
        console.log('Districts API Response:', response.data);
        setDistricts(response.data);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      setError('Không thể tải danh sách quận/huyện');
    }
  };

  const fetchWards = async (districtId) => {
    if (!districtId) return;
    
    try {
      const response = await axios.get(`https://localhost:7194/api/Shipping/wards?districtId=${districtId}`);
      if (response.data) {
        console.log('Wards API Response:', response.data);
        setWards(response.data);
      }
    } catch (error) {
      console.error('Error fetching wards:', error);
      setError('Không thể tải danh sách phường/xã');
    }
  };

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    const selectedProv = provinces.find(p => p.provinceID === parseInt(provinceId));
    console.log('Province Selection:', {
      provinceId: provinceId,
      provinceName: selectedProv?.provinceName,
      fullProvinceData: selectedProv
    });

    setSelectedProvince(provinceId);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setWards([]);
    if (provinceId) {
      fetchDistricts(provinceId);
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    if (!districtId) {
      setSelectedDistrict(null);
      setSelectedWard(null);
      setWards([]);
      return;
    }

    const district = districts.find(d => d.districtID === parseInt(districtId));
    console.log('District Selection:', {
      districtId: districtId,
      districtName: district?.districtName,
      fullDistrictData: district
    });

    if (district) {
      setSelectedDistrict(district);
      fetchWards(district.districtID);
    }
  };

  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    if (!wardCode) {
      setSelectedWard(null);
      return;
    }

    const ward = wards.find(w => w.wardCode === wardCode);
    console.log('Ward Selection:', {
      wardCode: wardCode,
      wardName: ward?.wardName,
      fullWardData: ward
    });

    if (ward && selectedDistrict) {
      setSelectedWard(ward);
      const fullAddress = `${ward.wardName}, ${selectedDistrict.districtName}`;
      
      const addressData = {
        fullAddress,
        wardCode: ward.wardCode,
        districtId: selectedDistrict.districtID
      };

      console.log('Final Address Data:', addressData);
      
      onAddressChange(addressData);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="address-selector">
      {userAddress && (
        <div className="current-address">
          <p><strong>Địa chỉ hiện tại:</strong> {userAddress}</p>
        </div>
      )}

      <div className="select-group">
        <label>
          Tỉnh/Thành phố <span className="required">*</span>
        </label>
        <select
          value={selectedProvince}
          onChange={handleProvinceChange}
          className="address-select"
          required
        >
          <option value="">Chọn Tỉnh/Thành phố</option>
          {provinces.map((province) => (
            <option key={province.provinceID} value={province.provinceID}>
              {province.provinceName}
            </option>
          ))}
        </select>
      </div>

      <div className="select-group">
        <label>
          Quận/Huyện <span className="required">*</span>
        </label>
        <select
          value={selectedDistrict?.districtID || ''}
          onChange={handleDistrictChange}
          className="address-select"
          disabled={!selectedProvince}
          required
        >
          <option value="">Chọn Quận/Huyện</option>
          {districts.map((district) => (
            <option key={district.districtID} value={district.districtID}>
              {district.districtName}
            </option>
          ))}
        </select>
      </div>

      <div className="select-group">
        <label>
          Phường/Xã <span className="required">*</span>
        </label>
        <select
          value={selectedWard?.wardCode || ''}
          onChange={handleWardChange}
          className="address-select"
          disabled={!selectedDistrict}
          required
        >
          <option value="">Chọn Phường/Xã</option>
          {wards.map((ward) => (
            <option key={ward.wardCode} value={ward.wardCode}>
              {ward.wardName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Address;