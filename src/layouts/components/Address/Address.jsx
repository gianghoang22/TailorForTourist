import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Address.scss";

const Address = ({ initialAddress, onAddressChange, resetAddress, setResetAddress }) => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [error, setError] = useState(null);
  const [manualAddress, setManualAddress] = useState(initialAddress || "");
  const [isAddressValid, setIsAddressValid] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchProvinces();
        if (initialAddress) {
          setUserAddress(initialAddress);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error loading initial data:", err);
      }
    };

    loadInitialData();
  }, [initialAddress]);

  useEffect(() => {
    // Reset states when resetAddress prop changes
    if (resetAddress) {
      setSelectedProvince("");
      setSelectedDistrict(null);
      setSelectedWard(null);
      setWards([]);
      setDistricts([]);
      setManualAddress(""); // Reset manual address if needed
      console.log("Address fields reset");
      // Đặt lại resetAddress về false
      setResetAddress(false);
    }
  }, [resetAddress]);

  const fetchProvinces = async () => {
    try {
      const response = await axios.get(
        "https://vesttour.xyz/api/Shipping/provinces"
      );
      if (response.data) {
        setProvinces(response.data);
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
      setError("Không thể tải danh sách tỉnh/thành phố");
    }
  };

  const fetchDistricts = async (provinceID) => {
    if (!provinceID) return;

    try {
      const response = await axios.get(
        `https://vesttour.xyz/api/Shipping/districts?provinceId=${provinceID}`
      );
      if (response.data) {
        console.log("Districts API Response:", response.data);
        setDistricts(response.data);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      setError("Không thể tải danh sách quận/huyện");
    }
  };

  const fetchWards = async (districtId) => {
    if (!districtId) return;

    try {
      const response = await axios.get(
        `https://vesttour.xyz/api/Shipping/wards?districtId=${districtId}`
      );
      if (response.data) {
        console.log("Wards API Response:", response.data);
        setWards(response.data);
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
      setError("Không thể tải danh sách phường/xã");
    }
  };

  const validateAddress = () => {
    const isValid = manualAddress.trim() !== "" && 
                    selectedProvince && 
                    selectedDistrict && 
                    selectedWard;
    setIsAddressValid(isValid);
    return isValid;
  };

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    const selectedProv = provinces.find(
      (p) => p.provinceID === parseInt(provinceId)
    );
    console.log("Province Selection:", {
      provinceId: provinceId,
      provinceName: selectedProv?.provinceName,
      fullProvinceData: selectedProv,
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
    validateAddress();
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    if (!districtId) {
        setSelectedDistrict(null);
        setSelectedWard(null);
        setWards([]);
        return;
    }

    const district = districts.find(
        (d) => d.districtID === parseInt(districtId)
    );
    console.log("District Selection:", {
        districtId: districtId,
        districtName: district?.districtName,
        fullDistrictData: district,
    });

    if (district) {
        setSelectedDistrict(district);
        setSelectedWard(null);
        fetchWards(district.districtID);
    }
    validateAddress();
  };

  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    if (!wardCode) {
        setSelectedWard(null);
        return;
    }

    const ward = wards.find((w) => w.wardCode === wardCode);
    if (ward && selectedDistrict) {
        setSelectedWard(ward);
        
        const selectedProv = provinces.find(p => p.provinceID === parseInt(selectedProvince));
        const fullAddress = `${manualAddress}, ${ward.wardName}, ${selectedDistrict.districtName}, ${selectedProv.provinceName}`;

        const addressData = {
            fullAddress,
            wardCode: ward.wardCode,
            districtId: selectedDistrict.districtID,
        };

        setManualAddress(fullAddress);
        onAddressChange(addressData);
    }
    validateAddress();
  };

  const handleManualAddressChange = (e) => {
    const newAddress = e.target.value;
    setManualAddress(newAddress);
    
    if (selectedProvince && selectedDistrict && selectedWard) {
        const selectedProv = provinces.find(p => p.provinceID === parseInt(selectedProvince));
        const fullAddress = `${newAddress}, ${selectedWard.wardName}, ${selectedDistrict.districtName}, ${selectedProv.provinceName}`;
        onAddressChange({ fullAddress });
    } else {
        onAddressChange({ fullAddress: newAddress });
    }
    validateAddress();
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="address-selector">
      <div className="form-group">
        <label>
          Detail Address <span className="required">*</span>
        </label>
        <input
          type="text"
          value={manualAddress}
          onChange={handleManualAddressChange}
          placeholder="Enter your address"
          className="address-input"
          required
        />
        {/* {!isAddressValid && (
          <span className="error-message">Please fill in all address fields.</span>
        )} */}
      </div>

      <div className="select-group">
        <label>
          Province <span className="required">*</span>
        </label>
        <select
          value={selectedProvince}
          onChange={handleProvinceChange}
          className="address-select"
          required
        >
          <option value="">Select Province</option>
          {provinces.map((province) => (
            <option key={province.provinceID} value={province.provinceID}>
              {province.provinceName}
            </option>
          ))}
        </select>
      </div>

      <div className="select-group">
        <label>
          District <span className="required">*</span>
        </label>
        <select
          value={selectedDistrict?.districtID || ""}
          onChange={handleDistrictChange}
          className="address-select"
          disabled={!selectedProvince}
          required
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district.districtID} value={district.districtID}>
              {district.districtName}
            </option>
          ))}
        </select>
      </div>

      <div className="select-group">
        <label>
          Ward <span className="required">*</span>
        </label>
        <select
          value={selectedWard?.wardCode || ""}
          onChange={handleWardChange}
          className="address-select"
          disabled={!selectedDistrict}
          required
        >
          <option value="">Select Ward</option>
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
