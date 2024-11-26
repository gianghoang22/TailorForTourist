import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MeasureGuest.scss';
import { Navigation } from '../../../layouts/components/navigation/Navigation';
import { Footer } from '../../../layouts/components/footer/Footer';

const MeasureGuest = () => {
  const [formData, setFormData] = useState({
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
  console.log('MeasurementId: ', measurementId);


  useEffect(() => {
    if(userID) {
      getMeasurementByUserId(userID);
    }
  }, [userID]);

  const getMeasurementByUserId = (userId) => {
    fetch(`https://localhost:7194/api/Measurement/user/${userId}`)
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
      } else if (isNaN(formData[field]) || formData[field] < 0 || formData[field] > 200) {
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
  
      fetch(`https://localhost:7194/api/Measurement/${measurementId}`, {
        method: "PUT", // Use PUT for updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          measurementId: measurementId,
          userId: userID,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Measurement updated successfully:", data);
          setIsEditing(false); // Thoát chế độ chỉnh sửa sau khi cập nhật thành công
        })
        .catch((error) => {
          console.error("Error updating measurement:", error);
        });
    }
  };

  const handleEdit = () => {
    if(isEditing){
      handleUpdate();
    }
    setIsEditing(!isEditing);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Kiểm tra nếu input là số, chuyển đổi sang số nguyên
    const numberFields = [
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
  
    setFormData({
      ...formData,
      [name]: numberFields.includes(name) ? parseInt(value, 10) || "" : value,
    });
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

          <div className="form-get-measures">

            {/* measure form */}

            {/* <form action="" method="post" id="mona-submit-mesuares"> */}
  <div className="frow col2row">
    <div className="mona-row1">
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
                    />{" "}
                    cm
                    </div>
      </div>
      <div className="inline-controls">
        <label className="lb">Waist</label>
        <div className="ipgr"><input
                      name="waist"
                      type="number"
                      className="fcontrol"
                      value={formData.waist || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />{" "} cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Hip</label>
        <div className="ipgr"><input
                      name="hip"
                      type="number"
                      className="fcontrol"
                      value={formData.hip || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />{" "} cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Neck</label>
        <div className="ipgr"><input
                      name="neck"
                      type="number"
                      className="fcontrol"
                      value={formData.neck || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />{" "} cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Armhole</label>
        <div className="ipgr"><input
                      name="armhole"
                      type="number"
                      className="fcontrol"
                      value={formData.armhole || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />{" "} cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Biceps</label>
        <div className="ipgr"><input
                      name="biceps"
                      type="number"
                      className="fcontrol"
                      value={formData.biceps || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />{" "} cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Shoulder</label>
        <div className="ipgr"><input
                      name="shoulder"
                      type="number"
                      className="fcontrol"
                      value={formData.shoulder || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />{" "} cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Sleeve length</label>
        <div className="ipgr"><input
                      name="sleeveLength"
                      type="number"
                      className="fcontrol"
                      value={formData.sleeveLength || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />{" "} cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Jaket length</label>
        <div className="ipgr"><input
                      name="jacketLength"
                      type="number"
                      className="fcontrol"
                      value={formData.jacketLength || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />{" "} cm</div>
      </div>
    </div>

    <div className="mona-row2">
      <div className="inline-controls">
        <label className="lb">Pants Waist</label>
        <div className="ipgr"><input
                      name="pantsWaist"
                      type="number"
                      className="fcontrol"
                      value={formData.pantsWaist || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />{" "} cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Crotch</label>
        <div className="ipgr"><input
                      name="crotch"
                      type="number"
                      className="fcontrol"
                      value={formData.crotch || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />{" "} cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Thigh</label>
        <div className="ipgr"><input
                      name="thigh"
                      type="number"
                      className="fcontrol"
                      value={formData.thigh || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />{" "} cm</div>
      </div>
      <div className="inline-controls">
        <label className="lb">Pants length</label>
        <div className="ipgr"><input
                      name="pantsLength"
                      type="number"
                      className="fcontrol"
                      value={formData.pantsLength || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />{" "} cm</div>
      </div>
    </div>
  </div>
  
  <div className="button">
      
  <p className="center-txt">
    <Link to='/cart'>
    <button className="primary-btn btn">Confirm</button>
    </Link>
  </p>

  <p className="center-txt">
  <button className="primary-btn btn" type="button" onClick={handleEdit}>
          {isEditing ? "Save" : "Edit"}
        </button>
        </p>
  </div>

{/* </form> */}

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
