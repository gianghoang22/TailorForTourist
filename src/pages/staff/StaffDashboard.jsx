import React, { useEffect, useState } from 'react';
// import { Outlet, Link } from 'react-router-dom';
import axios from 'axios';
import './StaffDashboard.scss';
const DataList = () => {
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersResponse, bookingsResponse, shipmentsResponse] = await Promise.all([
          axios.get('https://localhost:7244/api/Orders'),
          axios.get('https://localhost:7244/api/Bookings'),
          axios.get('https://localhost:7244/api/ShipperPartner')
        ]);
        setOrders(ordersResponse.data);
        setBookings(bookingsResponse.data);
        setShipments(shipmentsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const totalOrders = orders.length; 

  return (
    <>
    <div>
      <div className="order-list">
      <h2>Orders (Total: {totalOrders})</h2>
        {orders.map(order => (
          <div key={order.id} className="order-item">
            <p>Order ID: {order.orderId}</p>
            <p>Payment: {order.paymentId}</p>
            <p>Store: {order.storeId}</p>
            <p>Voucher: {order.voucherId}</p>
            <p>Shipper Partner: {order.shipperPartnerId}</p>
            <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
            <p>Ship Date: {new Date(order.shippedDate).toLocaleDateString()}</p>
            <p>Note: {order.note}</p>
            <p>Already paid: {order.paid}</p>
            <p>Status: {order.status}</p>
          </div>
        ))}
      </div>
      <div className="booking-list">
        <h2>Bookings</h2>
        {bookings.map(booking => (
          <div key={booking.id} className="booking-item">
            <p>Booking ID: {booking.id}</p>
            <p>Customer Name: {booking.customerName}</p>
            <p>Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      <div className="shipment-list">
        <h2>Shipments</h2>
        {shipments.map(shipment => (
          <div key={shipment.id} className="shipment-item">
            <p>Shipment ID: {shipment.shipperPartnerId}</p>
            <p>Partner Name: {shipment.shipperPartnerName}</p>
            <p>Phone number: {shipment.phone}</p>
            <p>Company: {shipment.company}</p>
            <p>Status of order: {shipment.status}</p>
          </div>
        ))}
      </div>
    </div>
    {/* <Outlet /> */}
    </>
  );
};

export default DataList;
