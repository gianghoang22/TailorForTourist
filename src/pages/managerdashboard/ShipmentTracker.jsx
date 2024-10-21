import React, { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import {
  ArrowUp,
  ArrowDown,
  TruckIcon,
  Filter,
  Search,
  Download,
} from "lucide-react";
import "./ShipmentTracker.scss";

const ShipmentTracker = () => {
  const [selectedShipment, setSelectedShipment] = useState(null);

  const stats = [
    { label: "Total Shipments", value: "6,521", change: "+1.3%" },
    { label: "Total Order", value: "10,105", change: "-2.1%" },
    { label: "Revenue", value: "$12,167", change: "+1.3%" },
    { label: "Delivered", value: "1,840", change: "-3.1%" },
  ];

  const shipments = [
    {
      id: "#001234ABCD",
      from: "87 Wern Ddu Lane",
      to: "15 Yscir View",
      category: "Electronic",
      distance: "60.41 km",
      estimation: "1d 16h",
      weight: "25kg",
      fee: "$1,050",
    },
    {
      id: "#001234ABCD",
      from: "40 Broomfield Place",
      to: "44 Helland Bridge",
      category: "Electronic",
      distance: "55.2 km",
      estimation: "1d 12h",
      weight: "30kg",
      fee: "$980",
    },
  ];

  const trackingOrders = [
    {
      id: "#001234ABCD",
      category: "Electronic",
      arrivalTime: "7/1/2023",
      weight: "25kg",
      route: "87 Wern Ddu Lane → 15 Yscir View",
      fee: "$1,050",
      status: "Delivered",
    },
    {
      id: "#002345GLKH",
      category: "Furniture",
      arrivalTime: "7/1/2023",
      weight: "50kg",
      route: "40 Broomfield Place → 44 Helland Bridge",
      fee: "$2,200",
      status: "Pending",
    },
    {
      id: "#002345GLKH",
      category: "Clothing",
      arrivalTime: "7/1/2023",
      weight: "50kg",
      route: "11 Walden Road → 39 Grendale Road",
      fee: "$800",
      status: "Shipping",
    },
  ];

  const handleShipmentClick = (shipment) => {
    setSelectedShipment(shipment);
  };

  const customIcon = new Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="shipment-tracker">
      <div className="header">
        <div className="tabs">
          <button className="tab active">Overviews</button>
          <button className="tab">Tracking</button>
        </div>
        <div className="actions">
          <select className="period-select">
            <option>Week</option>
            <option>Month</option>
            <option>Year</option>
          </select>
          <button className="new-shipment">+ New Shipments</button>
        </div>
      </div>

      <div className="stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3>{stat.label}</h3>
            <p className="value">{stat.value}</p>
            <p
              className={`change ${stat.change.startsWith("+") ? "positive" : "negative"}`}
            >
              {stat.change.startsWith("+") ? (
                <ArrowUp size={16} />
              ) : (
                <ArrowDown size={16} />
              )}
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="content">
        <div className="ongoing-delivery">
          <h2>Ongoing delivery</h2>
          <div className="shipment-list">
            {shipments.map((shipment) => (
              <div
                key={shipment.id}
                className={`shipment-card ${selectedShipment === shipment ? "active" : ""}`}
                onClick={() => handleShipmentClick(shipment)}
              >
                <h3>{shipment.id}</h3>
                <p>
                  {shipment.from} → {shipment.to}
                </p>
                <TruckIcon className="truck-icon" />
              </div>
            ))}
          </div>
        </div>

        <div className="map-container">
          <div className="map-header">
            <h2>On the way</h2>
            <p className="date">7/1/2023</p>
          </div>
          {selectedShipment && (
            <>
              <MapContainer center={[51.505, -0.09]} zoom={13}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polyline
                  positions={[
                    [51.505, -0.09],
                    [51.51, -0.1],
                    [51.51, -0.12],
                  ]}
                />
                <Marker position={[51.505, -0.09]} icon={customIcon} />
                <Marker position={[51.51, -0.12]} icon={customIcon} />
              </MapContainer>
              <div className="shipment-details">
                <div className="detail-item">
                  <p className="label">Category</p>
                  <p className="value">{selectedShipment.category}</p>
                </div>
                <div className="detail-item">
                  <p className="label">Distance</p>
                  <p className="value">{selectedShipment.distance}</p>
                </div>
                <div className="detail-item">
                  <p className="label">Estimation</p>
                  <p className="value">{selectedShipment.estimation}</p>
                </div>
                <div className="detail-item">
                  <p className="label">Weight</p>
                  <p className="value">{selectedShipment.weight}</p>
                </div>
                <div className="detail-item">
                  <p className="label">Fee</p>
                  <p className="value">{selectedShipment.fee}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="tracking-order">
        <div className="tracking-header">
          <h2>Tracking Order</h2>
          <div className="tracking-actions">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
              />
            </div>
            <button className="action-button">
              <Filter size={16} />
            </button>
            <button className="action-button">
              <Download size={16} />
            </button>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>ORDER ID</th>
                <th>CATEGORY</th>
                <th>ARRIVAL TIME</th>
                <th>WEIGHT</th>
                <th>ROUTE</th>
                <th>FEE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {trackingOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{order.id}</td>
                  <td>{order.category}</td>
                  <td>{order.arrivalTime}</td>
                  <td>{order.weight}</td>
                  <td>{order.route}</td>
                  <td>{order.fee}</td>
                  <td>
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTracker;
