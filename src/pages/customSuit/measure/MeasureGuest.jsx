import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MeasureGuest.scss';
import { Navigation } from '../../../layouts/components/navigation/Navigation';
import { Footer } from '../../../layouts/components/footer/Footer';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

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

  const validationSchema = Yup.object().shape({
    weight: Yup.number()
      .required("Weight is required")
      .min(30, "Weight should be at least 30kg")
      .max(200, "Weight cannot exceed 200kg"),
    height: Yup.number()
      .required("Height is required")
      .min(100, "Height should be at least 100cm")
      .max(250, "Height cannot exceed 250cm"),
    neck: Yup.number()
      .required("Neck size is required")
      .min(30, "Neck size should be at least 30cm"),
    hip: Yup.number()
      .required("Hip size is required")
      .min(60, "Hip size should be at least 60cm"),
    waist: Yup.number()
      .required("Waist size is required")
      .min(50, "Waist size should be at least 50cm"),
    armhole: Yup.number()
      .required("Armhole size is required")
      .min(20, "Armhole should be at least 20cm"),
    biceps: Yup.number()
      .required("Biceps size is required")
      .min(20, "Biceps should be at least 20cm"),
    pantsWaist: Yup.number()
      .required("Pants waist size is required")
      .min(50, "Pants waist should be at least 50cm"),
    crotch: Yup.number()
      .required("Crotch size is required")
      .min(20, "Crotch should be at least 20cm"),
    thigh: Yup.number()
      .required("Thigh size is required")
      .min(40, "Thigh should be at least 40cm"),
    pantsLength: Yup.number()
      .required("Pants length is required")
      .min(50, "Pants length should be at least 50cm"),
    age: Yup.number()
      .required("Age is required")
      .min(0, "Age cannot be negative"),
    chest: Yup.number()
      .required("Chest size is required")
      .min(30, "Chest size should be at least 30cm"),
    shoulder: Yup.number()
      .required("Shoulder size is required")
      .min(20, "Shoulder size should be at least 20cm"),
    sleeveLength: Yup.number()
      .required("Sleeve length is required")
      .min(20, "Sleeve length should be at least 20cm"),
    jacketLength: Yup.number()
      .required("Jacket length is required")
      .min(50, "Jacket length should be at least 50cm"),
  });

  const validateFields = () => {
    try {
      validationSchema.validateSync(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
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
    const numberValue = value === "" ? "" : Number(value);

    setFormData(prev => ({
      ...prev,
      [name]: numberValue
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
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
                      className={`fcontrol ${errors.age ? 'error' : ''}`}
                      value={formData.age || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">years</span>
                    {errors.age && <div className="error-message">{errors.age}</div>}
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Weight</label>
                  <div className="ipgr">
                    <input
                      name="weight"
                      type="number"
                      className={`fcontrol ${errors.weight ? 'error' : ''}`}
                      value={formData.weight || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">kg</span>
                    {errors.weight && <div className="error-message">{errors.weight}</div>}
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Height</label>
                  <div className="ipgr">
                    <input
                      name="height"
                      type="number"
                      className={`fcontrol ${errors.height ? 'error' : ''}`}
                      value={formData.height || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                    {errors.height && <div className="error-message">{errors.height}</div>}
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
                      className={`fcontrol ${errors.chest ? 'error' : ''}`}
                      value={formData.chest || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                    {errors.chest && <div className="error-message">{errors.chest}</div>}
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Waist</label>
                  <div className="ipgr">
                    <input
                      name="waist"
                      type="number"
                      className={`fcontrol ${errors.waist ? 'error' : ''}`}
                      value={formData.waist || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                    {errors.waist && <div className="error-message">{errors.waist}</div>}
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Hip</label>
                  <div className="ipgr">
                    <input
                      name="hip"
                      type="number"
                      className={`fcontrol ${errors.hip ? 'error' : ''}`}
                      value={formData.hip || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                    {errors.hip && <div className="error-message">{errors.hip}</div>}
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Neck</label>
                  <div className="ipgr">
                    <input
                      name="neck"
                      type="number"
                      className={`fcontrol ${errors.neck ? 'error' : ''}`}
                      value={formData.neck || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                    {errors.neck && <div className="error-message">{errors.neck}</div>}
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Shoulder</label>
                  <div className="ipgr">
                    <input
                      name="shoulder"
                      type="number"
                      className={`fcontrol ${errors.shoulder ? 'error' : ''}`}
                      value={formData.shoulder || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                    {errors.shoulder && <div className="error-message">{errors.shoulder}</div>}
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
                      className={`fcontrol ${errors.armhole ? 'error' : ''}`}
                      value={formData.armhole || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                    {errors.armhole && <div className="error-message">{errors.armhole}</div>}
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Biceps</label>
                  <div className="ipgr">
                    <input
                      name="biceps"
                      type="number"
                      className={`fcontrol ${errors.biceps ? 'error' : ''}`}
                      value={formData.biceps || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                    {errors.biceps && <div className="error-message">{errors.biceps}</div>}
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Sleeve length</label>
                  <div className="ipgr">
                    <input
                      name="sleeveLength"
                      type="number"
                      className={`fcontrol ${errors.sleeveLength ? 'error' : ''}`}
                      value={formData.sleeveLength || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                    {errors.sleeveLength && <div className="error-message">{errors.sleeveLength}</div>}
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Jacket length</label>
                  <div className="ipgr">
                    <input
                      name="jacketLength"
                      type="number"
                      className={`fcontrol ${errors.jacketLength ? 'error' : ''}`}
                      value={formData.jacketLength || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                    {errors.jacketLength && <div className="error-message">{errors.jacketLength}</div>}
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
                      className={`fcontrol ${errors.pantsWaist ? 'error' : ''}`}
                      value={formData.pantsWaist || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                    {errors.pantsWaist && <div className="error-message">{errors.pantsWaist}</div>}
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Crotch</label>
                  <div className="ipgr">
                    <input
                      name="crotch"
                      type="number"
                      className={`fcontrol ${errors.crotch ? 'error' : ''}`}
                      value={formData.crotch || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                    {errors.crotch && <div className="error-message">{errors.crotch}</div>}
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Thigh</label>
                  <div className="ipgr">
                    <input
                      name="thigh"
                      type="number"
                      className={`fcontrol ${errors.thigh ? 'error' : ''}`}
                      value={formData.thigh || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                    {errors.thigh && <div className="error-message">{errors.thigh}</div>}
                  </div>
                </div>
                <div className="inline-controls">
                  <label className="lb">Pants length</label>
                  <div className="ipgr">
                    <input
                      name="pantsLength"
                      type="number"
                      className={`fcontrol ${errors.pantsLength ? 'error' : ''}`}
                      value={formData.pantsLength || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    <span className="unit">cm</span>
                    {errors.pantsLength && <div className="error-message">{errors.pantsLength}</div>}
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
