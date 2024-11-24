import React, { useState, useEffect } from 'react';
import './Address.scss';

const Address = ({ onProvinceChange, onDistrictChange, onWardsChange }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWards, setSelectedWards] = useState('');

  useEffect(() => {
    fetch('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.data.data)) {
          setProvinces(data.data.data);
          console.log(data.data.data);
        } else {
          console.error('Unexpected data format for provinces:', data);
        }
      })
      .catch(error => console.error('Error fetching provinces:', error));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${selectedProvince}&limit=-1`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data.data.data)) {
            setDistricts(data.data.data);
          } else {
            console.error('Unexpected data format for districts:', data);
          }
        })
        .catch(error => console.error('Error fetching districts:', error));
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${selectedDistrict}&limit=-1`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data.data.data)) {
            setWards(data.data.data);
          } else {
            console.error('Unexpected data format for wards:', data);
          }
        })
        .catch(error => console.error('Error fetching wards:', error));
    }
  }, [selectedDistrict]);

  const handleProvinceChange = (event) => {
    const provinceCode = event.target.value;
    setSelectedProvince(provinceCode);
    setSelectedDistrict('');
    setSelectedWards('');
    onProvinceChange(provinceCode);
  };

  const handleDistrictChange = (event) => {
    const districtCode = event.target.value;
    setSelectedDistrict(districtCode);
    setSelectedWards('');
    onDistrictChange(districtCode);
  };

  const handleWardsChange = (event) => {
    const WardsCode = event.target.value;
    setSelectedWards(WardsCode);
    onWardsChange(WardsCode);
  };

  return (
    <div className="address-container">
      <label>
        Tỉnh/ Thành phố:
        <select value={selectedProvince} onChange={handleProvinceChange}>
          <option value="">Chọn tỉnh/ thành phố</option>
          {Array.isArray(provinces) && provinces.map((province) => (
            <option key={province.code} value={province.code}>{province.name}</option>
          ))}
        </select>
      </label>

      <label>
        Quận/ Huyện:
        <select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          disabled={!selectedProvince}
        >
          <option value="">Chọn quận/ huyện</option>
          {Array.isArray(districts) && districts.map((district) => (
            <option key={district.code} value={district.code}>{district.name}</option>
          ))}
        </select>
      </label>

      <label>
        Phường/ Thị Xã:
        <select
          value={selectedWards}
          onChange={handleWardsChange}
          disabled={!selectedDistrict}
        >
          <option value="">Chọn phường/ thị xã</option>
          {Array.isArray(wards) && wards.map((Wards) => (
            <option key={Wards.code} value={Wards.code}>{Wards.name}</option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default Address;
