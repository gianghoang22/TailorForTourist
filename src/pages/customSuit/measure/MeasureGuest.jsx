import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MeasureGuest.scss';
import { Navigation } from '../../../layouts/components/navigation/Navigation';
import { Footer } from '../../../layouts/components/footer/Footer';
import { toast } from 'react-toastify';

const MeasureGuest = () => {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    chest: "",
    waist: "",
    hip: "",
    neck: "",
    armhole: "",
    biceps: "",
    shoulder: "",
    sleeveLength: "",
    jacketLength: "",
    pantsWaist: "",
    crotch: "",
    thigh: "",
    pantsLength: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const userID = localStorage.getItem("userID");
  const measurementId = parseInt(localStorage.getItem('measurementId'), 10);
  const navigate = useNavigate();
  console.log('MeasurementId: ', measurementId);
  const [additionalCharge, setAdditionalCharge] = useState(0);

  useEffect(() => {
    if(userID) {
      getMeasurementByUserId(userID);
    }
  }, [userID]);

  useEffect(() => {
    // Kiểm tra xem có đang trong quá trình customization không
    const returnToCustomization = localStorage.getItem("returnToCustomization");
    
    // Sau khi lưu measurementId thành công
    const handleMeasurementComplete = () => {
      if (returnToCustomization) {
        // Quay lại trang customization
        navigate("/custom-suits/lining");
        // Xóa flag
        localStorage.removeItem("returnToCustomization");
      } else {
        // Xử lý bình thường
        navigate("/cart");
      }
    };
  }, []);

  useEffect(() => {
    // Kiểm tra xem có pending custom suit không
    const hasPendingCustomSuit = localStorage.getItem("pendingCustomSuit");
    
    if (hasPendingCustomSuit && measurementId) {
      // Quay lại CustomLining để hoàn tất thêm vào cart
      navigate("/custom-suits/lining");
    }
  }, [measurementId]);

  useEffect(() => {
    if (formData.height && formData.weight) {
      if (formData.height > 190 || formData.weight > 100) {
        setAdditionalCharge(20);
      } else if (formData.height > 180 && formData.height <= 190 || 
                 formData.weight > 85 && formData.weight <= 100) {
        setAdditionalCharge(10);
      } else {
        setAdditionalCharge(0);
      }
    }
  }, [formData.height, formData.weight]);

  const getMeasurementByUserId = (userId) => {
    fetch(`https://vesttour.xyz/api/Measurement/user/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch measurements");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched measurements:", data);
        setFormData(data); // Populate form with fetched data
        if (data.measurementId) {
          localStorage.setItem("measurementId", data.measurementId); // Save measurementId to localStorage
        }
      })
      .catch((error) => {
        console.error("Error fetching measurements:", error);
      });
  };


  const validateFields = () => {
    const newErrors = {};
    const numberFields = [
      "age",
      "weight",
      "height",
      "chest",
      "waist",
      "hip",
      "neck",
      "armhole",
      "biceps",
      "shoulder",
      "sleeveLength",
      "jacketLength",
      "pantsWaist",
      "crotch",
      "thigh",
      "pantsLength",
    ];

    numberFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      } else if (isNaN(formData[field]) || formData[field] < 0) {
        newErrors[field] = "Please enter a valid number (0 or greater)";
      } else if (formData[field] > 200) {
        newErrors[field] = "Please enter a valid number (0-200)";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // return true if no errors
  };

  const handleUpdate = () => {
    if (validateFields()) {
      console.log("Form data being updated:", {
        ...formData,
        measurementId: measurementId,
      });

      fetch(`https://vesttour.xyz/api/Measurement/${measurementId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          measurementId: measurementId,
          userId: userID,
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            // Try to get error message from response
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }
          
          // Check if response has content
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return response.json();
          } else {
            return { success: true }; // Return a default success object if no JSON
          }
        })
        .then((data) => {
          console.log("Measurement updated successfully:", data);
          setIsEditing(false);
          toast.success('Measurements updated successfully!', {
            position: "top-right",
            autoClose: 3000,
          });
        })
        .catch((error) => {
          console.error("Error updating measurement:", error);
          toast.error('Failed to update measurements. Please try again.', {
            position: "top-right",
            autoClose: 3000,
          });
        });
    }
  };

  const handleEdit = () => {
    if(isEditing){
      handleUpdate();
    }
    setIsEditing(!isEditing);
  }

  const handleKeyPress = (e) => {
    // Chỉ cho phép nhập số
    if (!/[0-9]/.test(e.key)) {
        e.preventDefault(); // Ngăn chặn nhập ký tự không phải số
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const numberFields = [
      "age",
      "weight",
      "height",
      "chest",
      "waist",
      "hip",
      "neck",
      "armhole",
      "biceps",
      "shoulder",
      "sleeveLength",
      "jacketLength",
      "pantsWaist",
      "crotch",
      "thigh",
      "pantsLength",
    ];

    // Kiểm tra nếu trường là số và giá trị không phải là số
    if (numberFields.includes(name) && !/^\d*$/.test(value)) {
      return; // Không cập nhật nếu giá trị không phải là số
    }

    // Kiểm tra nếu giá trị là số âm
    if (numberFields.includes(name) && value < 0) {
      return; // Không cập nhật nếu giá trị âm
    }

    setFormData({
      ...formData,
      [name]: numberFields.includes(name) ? parseInt(value, 10) || "" : value,
    });
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (validateFields()) {
      navigate('/cart');
    } else {
      toast.error('Please fill in all measurement fields before proceeding', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
    <Navigation/>
      <div id='measure' className="product-detail-page measures-pages">
        <div className="all">
          <div className="sec-title center-txt">
            <h3 className="tt-txt">
              <span className="tt-sub">Your Measures</span>
            </h3>
          </div>

          {additionalCharge > 0 && (
            <div className="measurement-notice" style={{
              backgroundColor: '#fff3cd',
              color: '#856404',
              padding: '15px',
              margin: '20px 0',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <p>
                <strong>Note:</strong> Due to your measurements (
                {formData.height > 190 || formData.weight > 100 
                  ? 'height over 190cm or weight over 100kg' 
                  : 'height over 180cm or weight over 85kg'
                }), 
                there will be an additional charge of ${additionalCharge} for custom product.
              </p>
            </div>
          )}

          <div className="form-get-measures">
            <div className="measurement-grid">
              <div className="measurement-column">
                <h4>Basic Information</h4>
                <div className="inline-controls">
                  <label className="lb">Age</label>
                  <div className="ipgr">
                    <input
                      name="age"
                      type="number"
                      className="fcontrol"
                      value={formData.age || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">years</span>
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Weight</label>
                  <div className="ipgr">
                    <input
                      name="weight"
                      type="number"
                      className="fcontrol"
                      value={formData.weight || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">kg</span>
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Height</label>
                  <div className="ipgr">
                    <input
                      name="height"
                      type="number"
                      className="fcontrol"
                      value={formData.height || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
              </div>

              <div className="measurement-column">
                <h4>Upper Body Measurements</h4>
                <div className="inline-controls">
                  <label className="lb">Chest</label>
                  <div className="ipgr">
                    <input
                      name="chest"
                      type="number"
                      className="fcontrol"
                      value={formData.chest || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Waist</label>
                  <div className="ipgr">
                    <input
                      name="waist"
                      type="number"
                      className="fcontrol"
                      value={formData.waist || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Hip</label>
                  <div className="ipgr">
                    <input
                      name="hip"
                      type="number"
                      className="fcontrol"
                      value={formData.hip || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Neck</label>
                  <div className="ipgr">
                    <input
                      name="neck"
                      type="number"
                      className="fcontrol"
                      value={formData.neck || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Shoulder</label>
                  <div className="ipgr">
                    <input
                      name="shoulder"
                      type="number"
                      className="fcontrol"
                      value={formData.shoulder || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
              </div>

              <div className="measurement-column">
                <h4>Arm Measurements</h4>
                <div className="inline-controls">
                  <label className="lb">Armhole</label>
                  <div className="ipgr">
                    <input
                      name="armhole"
                      type="number"
                      className="fcontrol"
                      value={formData.armhole || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Biceps</label>
                  <div className="ipgr">
                    <input
                      name="biceps"
                      type="number"
                      className="fcontrol"
                      value={formData.biceps || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Sleeve length</label>
                  <div className="ipgr">
                    <input
                      name="sleeveLength"
                      type="number"
                      className="fcontrol"
                      value={formData.sleeveLength || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Jacket length</label>
                  <div className="ipgr">
                    <input
                      name="jacketLength"
                      type="number"
                      className="fcontrol"
                      value={formData.jacketLength || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
              </div>

              <div className="measurement-column">
                <h4>Lower Body Measurements</h4>
                <div className="inline-controls">
                  <label className="lb">Pants Waist</label>
                  <div className="ipgr">
                    <input
                      name="pantsWaist"
                      type="number"
                      className="fcontrol"
                      value={formData.pantsWaist || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Crotch</label>
                  <div className="ipgr">
                    <input
                      name="crotch"
                      type="number"
                      className="fcontrol"
                      value={formData.crotch || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Thigh</label>
                  <div className="ipgr">
                    <input
                      name="thigh"
                      type="number"
                      className="fcontrol"
                      value={formData.thigh || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Pants length</label>
                  <div className="ipgr">
                    <input
                      name="pantsLength"
                      type="number"
                      className="fcontrol"
                      value={formData.pantsLength || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="button-group">
              <button className="primary-btn btn" onClick={handleConfirm}>Confirm</button>
              <button className="primary-btn btn" type="button" onClick={handleEdit}>
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>
          </div>
          
            <div className="measurement-notice" style={{
              backgroundColor: '#fff3cd',
              color: '#856404',
              padding: '15px',
              margin: '20px 0',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <p>
                <strong>Note:</strong> If you are not sure about your measurements, please go to the store to have the best experience measurement service.
              </p>
            </div>
          

          {/* measure guide */}
          <div className="form-get-measures mona-content">
  <div className="sec-title center-txt">
    <h3 className="tt-txt">
      <span className="tt-sub">How to&nbsp;Measure</span>
    </h3>
  </div>

  <div className="clear">
    <p><span style={{ color: "#ff9900", fontWeight: "bold" }}>SHIRT/ JACKET</span></p>
    
    {/* Shirt/Jacket Measurement Videos */}
    <iframe
      src="https://www.youtube.com/embed/C2HXr2od5cY"
      width="1170"
      height="658"
      frameBorder="0"
      allowFullScreen
      title="Measurement Guide - Shirt/Jacket 1"
    ></iframe>

    <iframe
      src="https://www.youtube.com/embed/prLB6O5CUrU"
      width="1170"
      height="658"
      frameBorder="0"
      allowFullScreen
      title="Measurement Guide - Shirt/Jacket 2"
    ></iframe>

    <iframe
      src="https://www.youtube.com/embed/eAuTIoy2lgc"
      width="1170"
      height="658"
      frameBorder="0"
      allowFullScreen
      title="Measurement Guide - Shirt/Jacket 3"
    ></iframe>

    <iframe
      src="https://www.youtube.com/embed/jHljN0JjlIc"
      width="1170"
      height="658"
      frameBorder="0"
      allowFullScreen
      title="Measurement Guide - Shirt/Jacket 4"
    ></iframe>

    <iframe
      src="https://www.youtube.com/embed/WihTP6ZRSO0"
      width="1170"
      height="658"
      frameBorder="0"
      allowFullScreen
      title="Measurement Guide - Shirt/Jacket 5"
    ></iframe>

    <iframe
      src="https://www.youtube.com/embed/yzobV1N1h7M"
      width="1170"
      height="658"
      frameBorder="0"
      allowFullScreen
      title="Measurement Guide - Shirt/Jacket 6"
    ></iframe>

    <iframe
      src="https://www.youtube.com/embed/j3Z8Rh5O13o"
      width="1170"
      height="658"
      frameBorder="0"
      allowFullScreen
      title="Measurement Guide - Shirt/Jacket 7"
    ></iframe>

    <iframe
      src="https://www.youtube.com/embed/uY-VHeblKJQ"
      width="1170"
      height="658"
      frameBorder="0"
      allowFullScreen
      title="Measurement Guide - Shirt/Jacket 8"
    ></iframe>

    <iframe
      src="https://www.youtube.com/embed/Ew8uKQ7qcvg"
      width="1170"
      height="658"
      frameBorder="0"
      allowFullScreen
      title="Measurement Guide - Shirt/Jacket 9"
    ></iframe>

    <p><span style={{ color: "#ff9900", fontWeight: "bold" }}>PANTS</span></p>

    {/* Pants Measurement Videos */}
    <iframe
      src="https://www.youtube.com/embed/TOiIpRRxqnE"
      width="1170"
      height="658"
      frameBorder="0"
      allowFullScreen
      title="Measurement Guide - Pants 1"
    ></iframe>

    <iframe
      src="https://www.youtube.com/embed/oYF3AzkyJNM"
      width="1170"
      height="658"
      frameBorder="0"
      allowFullScreen
      title="Measurement Guide - Pants 2"
    ></iframe>

    <iframe
      src="https://www.youtube.com/embed/41uFIsmcbzk"
      width="1170"
      height="658"
      frameBorder="0"
      allowFullScreen
      title="Measurement Guide - Pants 3"
    ></iframe>

    <iframe
      src="https://www.youtube.com/embed/MoPUIzKoJgM"
      width="1170"
      height="658"
      frameBorder="0"
      allowFullScreen
      title="Measurement Guide - Pants 4"
    ></iframe>
  </div>
</div>


        </div>
      </div>
      <Footer/>
    </>
  );
};

export default MeasureGuest;
