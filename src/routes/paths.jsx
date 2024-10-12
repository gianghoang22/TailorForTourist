import BookingPage from "../pages/booking/BookingPage";
import ProductPage from "../pages/product/ProductPage";
import HomePage from "../pages/home/HomePage"; 
import SignIn from "../pages/signIn/signIn";
import SignUp from "../pages/signUp/signUp";
import Checkout from "../pages/checkout/Checkout";
import Fabric from "../pages/fabric/Fabric";
import ManagerDashboard from "../pages/managerdashboard/ManagerDashboard";
import StaffDashboard from "../pages/staff/StaffDashboard";
import CustomSuit from "../pages/customsuit/CustomSuit";
import CustomFabric from "../pages/customSuit/custom/CustomFabric";
import CustomStyle from "../pages/customSuit/custom/CustomStyle";
import CustomLining from "../pages/customSuit/custom/CustomLining";
import OrderList from "../pages/staff/OrderList";
import BookingList from "../pages/staff/BookingList";
import ShipmentList from "../pages/staff/ShipmentList";
import ProductDetail from "../pages/product/ProductDetail";

export const routes = [
    {
        path: "/",
        element: <HomePage />
    },
    {
      path: "/manager",
      element: <ManagerDashboard />,
    },
    {
        path: "/booking",
        element: <BookingPage />
    },
    {
        path: "/products",
        element: <ProductPage />
    },
    {
        path: "/products/:productId", 
        element: <ProductDetail />
    },
    {
        path: "/checkout",
        element: <Checkout />
    },
    {
        path: "/fabric",
        element: <Fabric />
    },
    {
        path: "/signin",
        element: <SignIn />
    },
    {
        path: "/signup",
        element: <SignUp />
    },
    {
        path: "/staff",
        element: <StaffDashboard />,
        children: [
            {
                path: "",
                element: <StaffDashboard />
            },
            {
                path: "order",
                element: <OrderList />
            },
            {
                path: "booking",
                element: <BookingList />
            },
            {
                path: "shipment",
                element: <ShipmentList />
            }
        ]
    },
    {
        path: "/custom-suits",
        element: <CustomSuit />,
        children: [
            {
                path: "fabric",
                element: <CustomFabric />
            },
            {
                path: "style",
                element: <CustomStyle />
            },
            {
                path: "lining",
                element: <CustomLining />
            }
        ]
    }
];
