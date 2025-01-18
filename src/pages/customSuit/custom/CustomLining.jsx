import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart, getCart, addToGuestCart, getLastCompleteSuit } from "../../../utils/cartUtil";
import "./CustomLining.scss";
import lining_icon from "../../../assets/img/iconCustom/icon-accent-vailot.jpg";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "https://vesttour.xyz/api/AddCart/addtocart";

const calculateCustomPrice = async () => {
  try {
    // Get the selected IDs from localStorage
    const fabricId = parseInt(localStorage.getItem("selectedFabricID"));
    const liningId = parseInt(localStorage.getItem("liningId"));
    const styleOptionIds =
      JSON.parse(localStorage.getItem("styleOptionId")) || [];

    // Fetch fabric price
    const fabricResponse = await axios.get(
      `https://vesttour.xyz/api/Fabrics/${fabricId}`
    );
    const fabricPrice = fabricResponse.data.price || 0;

    // Fetch lining price
    const liningResponse = await axios.get(
      `https://vesttour.xyz/api/Linings/${liningId}`
    );
    const liningPrice = liningResponse.data.price || 0;

    // Fetch style option prices
    const styleOptionPrices = await Promise.all(
      styleOptionIds.map(async (id) => {
        const response = await axios.get(
          `https://vesttour.xyz/api/StyleOption/${id}`
        );
        return response.data.price || 0;
      })
    );

    // Calculate total price
    const basePrice = 500; // Base price for a custom suit
    const totalStyleOptionsPrice = styleOptionPrices.reduce(
      (sum, price) => sum + price,
      0
    );
    const totalPrice =
      basePrice + fabricPrice + liningPrice + totalStyleOptionsPrice;

    return totalPrice;
  } catch (error) {
    console.error("Error calculating custom price:", error);
    return 0; // Return 0 or some default price if calculation fails
  }
};

const CustomLining = () => {
  const [linings, setLinings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLining, setSelectedLining] = useState(null);
  const userId = localStorage.getItem("userID");
  const measurementId = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    getMeasurementByUserId(userId);
    const fetchLinings = async () => {
      try {
        const response = await fetch("https://vesttour.xyz/api/Linings");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Dữ liệu trả về:", result);
        if (Array.isArray(result.data)) {
          setLinings(result.data);
        } else {
          throw new Error("Dữ liệu không hợp lệ: không phải là mảng");
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
    // Check if the lining is unavailable
    if (lining.status === "Unavailable") {
      toast.error("Product is not available!");
      return;
    }

    // Kiểm tra nếu lining đã được chọn
    if (selectedLining && selectedLining.liningId === lining.liningId) return;

    setSelectedLining(lining);
    localStorage.setItem("liningId", lining.liningId);
    addToCart({
      id: lining.liningId,
      type: "lining",
      name: lining.liningName,
      imageUrl: lining.imageUrl,
      price: lining.price
    });
  };

  const getMeasurementByUserId = async (userId) => {
    try {
      const response = await fetch(`https://vesttour.xyz/api/Measurement/user/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch measurements");
      }
      const data = await response.json();
      console.log("Fetched measurements:", data);
      return data.measurementId; // Trả về measurementId
    } catch (error) {
      console.error("Error fetching measurements:", error);
      return null; // Trả về null nếu có lỗi
    }
  };

  const handleNextClick = async () => {
    try {
      // Kiểm tra đăng nhập
      const userID = localStorage.getItem("userID");
      if (!userID) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      // Lấy suit đã hoàn thành
      const completeSuit = getLastCompleteSuit();
      if (!completeSuit) {
        toast.error("Please complete all selections (fabric, style, and lining)");
        return;
      }

      const measurementID = await getMeasurementByUserId(userId);
      // Kiểm tra measurementId
      if (!measurementID) {
        toast.info("Please complete your measurements first");
        return;
      }

      const payload = {
        userId: parseInt(userID),
        isCustom: true,
        customProduct: {
          categoryID: 5,
          fabricID: completeSuit.fabricId,
          liningID: completeSuit.lining.id,
          measurementID: parseInt(measurementID),
          pickedStyleOptions: completeSuit.styles.map(style => ({
            styleOptionID: style.id
          })),
        }
      };

      console.log("Sending payload:", payload);

      const response = await axios.post(API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        // Xóa flag returnToCustomization sau khi thành công
        localStorage.removeItem("returnToCustomization");
        toast.success("Added to cart successfully");
        navigate("/measure");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login first");
        navigate("/signin");
      } else {
        toast.error(
          error.response?.data?.message ||
          "Failed to add to cart. Please try again."
        );
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="custom-lining-container">
      <div className="left-half">
        <div className="tag-buttons">
          <li className="active">
            <a>
              <img
                src={lining_icon}
                alt="Internal lining icon"
                className="tag-icon"
              />
              Internal Lining
            </a>
          </li>
        </div>

        <div className="right-items-lining">
          <ul className="list-lining">
            {Array.isArray(linings) && linings.map((lining) => (
              <li
                key={lining.liningId}
                className={`lining-item ${selectedLining && selectedLining.liningId === lining.liningId ? "selected" : ""}`}
                onClick={() => handleLiningClick(lining)}
              >
                <div className="lining-img">
                  {lining.imageUrl ? (
                    <img
                      style={{ width: "130px", height: "100px" }}
                      src={lining.imageUrl}
                      alt={lining.liningName}
                    />
                  ) : (
                    "No image available"
                  )}
                </div>
                <div className="lining-name">{lining.liningName}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="right-half">
        {selectedLining && (
          <div className="lining-details">
            <div className="product-info" id="pd_info">
              <h1 className="pd-name">
                CUSTOM <span>SUIT</span>
              </h1>
              <p className="composition set">{selectedLining.description}</p>
              <p className="price">{selectedLining.liningName}</p>
              <div
                className="lining-img"
                style={{ width: "300px", height: "231px" }}
              >
                {selectedLining.imageUrl ? (
                  <img
                    src={selectedLining.imageUrl}
                    alt={selectedLining.liningName}
                  />
                ) : (
                  "No image available"
                )}
              </div>
            </div>
          </div>
        )}

        <div className="next-btn">
          <button className="navigation-button" onClick={handleNextClick}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomLining;