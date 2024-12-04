import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts";

export const OrderChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="orderDate" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="totalPrice" fill="#8884d8" name="Order Total" />
    </BarChart>
  </ResponsiveContainer>
);

export const BookingChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Bookings" />
    </LineChart>
  </ResponsiveContainer>
);
