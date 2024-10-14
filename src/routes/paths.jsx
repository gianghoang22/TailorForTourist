import BookingPage from "../pages/booking/BookingPage";
import ProductPage from "../pages/product/ProductPage";
import HomePage from "../pages/home/HomePage";
import SignIn from "../pages/signIn/signIn";
import SignUp from "../pages/signUp/signUp";
import Checkout from "../pages/checkout/Checkout";
import Fabric from "../pages/fabric/Fabric";
import ManagerDashboard from "../pages/managerdashboard/ManagerDashboard";
import StaffManagement from "../pages/managerdashboard/StaffManagement";
import UserProfile from "../pages/profile/UserProfile";
import ChangePassword from "../pages/profile/ChangePassword";
// import StaffDashboard from "../pages/staff/StaffDashboard";
import CustomSuit from "../pages/customsuit/CustomSuit";
// import CustomFabric from "../pages/customSuit/custom/CustomFabric";
import CustomStyle from "../pages/customSuit/custom/CustomStyle";
import CustomLining from "../pages/customSuit/custom/CustomLining";
<<<<<<< HEAD
import OrderList from "../pages/staff/staffManager/OrderList";
import BookingList from "../pages/staff/staffManager/BookingList";
import ShipmentList from "../pages/staff/staffManager/ShipmentList";
import ProductDetail from "../pages/product/ProductDetail";

=======
import OrderHistory from "../pages/profile/OrderHistory";
// import OrderList from "../pages/staff/OrderList";
// import BookingList from "../pages/staff/BookingList";
// import ShipmentList from "../pages/staff/ShipmentList";
// import ProductDetail from "../pages/product/ProductDetail";
import Measurement from "../pages/profile/Measurement";
>>>>>>> d35a4e364a29014571594bbb54c4b1d0025950c4
export const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/manager",
    element: <ManagerDashboard />,
    children: [
      {
        path: "staff-management", // This will be /manager/staff-management
        element: <StaffManagement />,
      },
      // Add other children routes here if needed
    ],
  },
  {
    path: "/booking",
    element: <BookingPage />,
  },
  {
    path: "/profile",
    element: <UserProfile />,
    children: [
      {
        path: "change-password", // This will be /profile/change-password
        element: <ChangePassword />,
      },
      {
        path: "order-history", // This will be /profile/change-password
        element: <OrderHistory />,
      },
      {
        path: "measurement", // This will be /profile/change-password
        element: <Measurement />,
      },
      // Add other profile-related children routes here if needed
    ],
  },
  {
    path: "/products",
    element: <ProductPage />,
  },
  // {
  //   path: "/products/:productId", // Thêm đường dẫn cho ProductDetail với ID sản phẩm
  //   element: <ProductDetail />,
  // },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/fabric",
    element: <Fabric />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  // {
  //   path: "/staff",
  //   element: <StaffDashboard />,
  //   children: [
  //     {
  //       path: "",
  //       element: <StaffDashboard />,
  //     },
  //     {
  //       path: "order",
  //       element: <OrderList />,
  //     },
  //     {
  //       path: "booking",
  //       element: <BookingList />,
  //     },
  //     {
  //       path: "shipment",
  //       element: <ShipmentList />,
  //     },
  //   ],
  // },
  {
    path: "/custom-suits",
    element: <CustomSuit />,
    children: [
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
];
