import SignIn from "../pages/signIn/signIn";
import SignUp from "../pages/signUp/signUp";

import HomePage from "../pages/home/HomePage";
import BookingPage from "../pages/booking/BookingPage";
import Checkout from "../pages/checkout/Checkout";
import MeasurementGuide from "../pages/measurementGuide/MeasurementGuide";
import OrderReceive from "../pages/checkout/orderReceive/OrderReceive";

import ProductPage from "../pages/product/ProductPage";
import ProductDetail from "../pages/product/ProductDetail";
import Fabric from "../pages/fabric/Fabric";

import UserProfile from "../pages/profile/UserProfile";
import ChangePassword from "../pages/profile/ChangePassword";
import Appointment from "../pages/profile/Appointment";
import CustomSuit from "../pages/customsuit/CustomSuit";
import CustomStyle from "../pages/customSuit/custom/CustomStyle";
import CustomLining from "../pages/customSuit/custom/CustomLining";
import CustomFabric from "../pages/customSuit/custom/CustomFabric";
import MeasureGuest from "../pages/customSuit/measure/MeasureGuest";

import StaffDashboard from "../pages/staff/StaffDashboard";
import OrderList from "../pages/staff/staffManager/OrderList";
import BookingList from "../pages/staff/staffManager/BookingList";
import ShipmentList from "../pages/staff/staffManager/ShipmentList";
import MeasureList from "../pages/staff/staffManager/MeasureList";

import OrderHistory from "../pages/profile/OrderHistory";
import Measurement from "../pages/profile/Measurement";

import Cart from "../pages/cart/cart";
import BookingThanks from "../pages/booking/BookingThanks";

import StaffManagement from "../pages/managerdashboard/StaffManagement";
import ManagerDashboard from "../pages/managerdashboard/ManagerDashboard";
import FabricDetailPage from "../pages/fabric/FabricDetail";

import ErrorBoundary from "../pages/ErrorBoundary/ErrorBoundary";
import ProfitCalculation from "../pages/managerdashboard/ProfitCalculation";
import ShipmentTracker from "../pages/managerdashboard/ShipmentTracker";

import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import FabricManagement from "../pages/admin/FabricManagement";
import StoreManagement from "../pages/admin/StoreManagement";
import LiningManagement from "../pages/admin/LiningManagement";
import VoucherManagement from "../pages/admin/VoucherManagement";

import Payment from "../pages/payment/payment";
import ContactUs from "../pages/contact/ContactUs";
import OrderDetails from "../pages/orderDetails/OrderDetails";
import CreatePassword from "../pages/signIn/CreatePassword";
import TailorDashboard from "../pages/tailor/TailorDashboard";

import ProtectedRoute from "../pages/ProtectedRoute/ProtectedRoute";

export const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
    children: [
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "fabric-management",
        element: <FabricManagement />,
      },
      {
        path: "lining-management",
        element: <LiningManagement />,
      },
      {
        path: "store-management",
        element: <StoreManagement />,
      },
      {
        path: "voucher-management",
        element: <VoucherManagement />,
      },
    ],
  },
  {
    path: "/manager",
    element: (
      <ErrorBoundary>
        <ManagerDashboard />
      </ErrorBoundary>
    ),
    children: [
      {
        path: "staff-management", // This will be /manager/staff-management
        element: <StaffManagement />,
      },
      {
        path: "statistics",
        element: <ProfitCalculation />,
      },
      {
        path: "shipment",
        element: <ShipmentTracker />,
      },

      // Add other children routes here if needed
    ],
  },
  {
    path: "/order-details",
    element: <OrderDetails />,
  },
  {
    path: "/new-password",
    element: <CreatePassword />,
  },
  {
    path: "/tailor",
    element: <TailorDashboard />,
  },
  {
    path: "/booking",
    element: (
      <ProtectedRoute
        element={<BookingPage />}
        allowedRoles={["customer"]} // Specify allowed roles for logged-in users
        allowGuestAccess={true} // Custom prop to allow guest access
      />
    ),
  },
  {
    path: "/booking-thanks",
    element: <BookingThanks />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute
        element={<UserProfile />}
        allowedRoles={["customer"]} // Specify allowed roles
      />
    ),
    children: [
      {
        path: "change-password",
        element: <ChangePassword />,
      },
      {
        path: "order-history",
        element: <OrderHistory />,
      },
      {
        path: "measurement",
        element: <Measurement />,
      },
      {
        path: "appointment",
        element: <Appointment />,
      },
    ],
  },
  {
    path: "/product-collection",
    element: <ProductPage />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
  {
    path: "/product-collection/:id",
    element: <ProductDetail />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/checkout/order-receive",
    element: <OrderReceive />,
  },
  {
    path: "/fabrics",
    element: <Fabric />,
  },
  {
    path: "/fabrics/:id",
    element: <FabricDetailPage />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },

  {
    path: "/staff",
    element: <StaffDashboard />,
    children: [
      {
        path: "",
        element: <StaffDashboard />,
      },
      {
        path: "order",
        element: <OrderList />,
      },
      {
        path: "booking",
        element: <BookingList />,
      },
      {
        path: "shipment",
        element: <ShipmentList />,
      },
      {
        path: "measurement",
        element: <MeasureList />,
      },
    ],
  },
  // {
  //   path: "/custom-suits",
  //   element: <CustomSuit />,
  //   children: [
  //     {
  //       path: "fabric",
  //       element: <CustomFabric />,
  //     },
  //     {
  //       path: "style",
  //       element: <CustomStyle />,
  //     },
  //     {
  //       path: "lining",
  //       element: <CustomLining />,
  //     },
  //   ],
  // },

  {
    path: "/staff",
    element: <StaffDashboard />,
    children: [
      {
        path: "",
        element: <StaffDashboard />,
      },
      {
        path: "order",
        element: <OrderList />,
      },
      {
        path: "booking",
        element: <BookingList />,
      },
      {
        path: "shipment",
        element: <ShipmentList />,
      },
    ],
  },
  {
    path: "/custom-suits",
    element: <CustomSuit />,
    children: [
      {
        path: "",
        element: <CustomFabric />,
      },
      {
        path: "fabric",
        element: <CustomFabric />,
      },
      {
        path: "style",
        element: <CustomStyle />,
      },
      {
        path: "lining",
        element: <CustomLining />,
      },
    ],
  },
  {
    path: "/measure",
    element: <MeasureGuest />,
  },
  {
    path: "/how-to-measure",
    element: <MeasurementGuide />,
  },
  {
    path: "/contact-us",
    element: <ContactUs />,
  },
];
