import React, { useState, useEffect } from "react";
import { Table, Rate, Spin, Empty } from "antd";
import ProfileNav from "./ProfileNav";
import "./Feedback.scss";

const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      const userID = localStorage.getItem("userID");
      if (!userID) {
        console.error("User ID not found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://vesttour.xyz/api/Feedback/user/${userID}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFeedbackData(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const columns = [
    {
      title: "Order",
      dataIndex: "orderId",
      key: "orderId"
    },
    {
      title: "Date",
      dataIndex: "dateSubmitted",
      key: "dateSubmitted",
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.dateSubmitted) - new Date(b.dateSubmitted),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => <Rate disabled defaultValue={rating} />,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Response",
      dataIndex: "response",
      key: "response",
      render: (response, record) => (
        <div>
          {response && (
            <>
              <p>{response}</p>
              <small className="response-date">
                {formatDate(record.dateResponse)}
              </small>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="main-container">
      <ProfileNav />
      <div className="feedback-container">
        <h2>Your Feedback</h2>
        {loading ? (
          <Spin size="large" />
        ) : feedbackData.length > 0 ? (
          <Table
            dataSource={feedbackData}
            columns={columns}
            rowKey="feedbackId"
            pagination={{ pageSize: 5 }}
            className="feedback-table"
          />
        ) : (
          <Empty description="No feedback found" />
        )}
      </div>
    </div>
  );
};

export default Feedback;
