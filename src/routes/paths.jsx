import BookingPage from "../pages/booking/BookingPage";
<<<<<<< Updated upstream
import { ProductPage } from "../pages/product/ProductPage";
import { HomePage } from "../pages/home/homePage";
=======
import ProductPage from "../pages/product/ProductPage";
import HomePage from "../pages/home/HomePage";
>>>>>>> Stashed changes
import SignIn from "../pages/signIn/signIn";
import SignUp from "../pages/signUp/signUp";
import Checkout from "../pages/checkout/Checkout";
import Fabric from "../pages/fabric/Fabric";

export const routes = [
    {
        path: "/",
        element: <HomePage />,
        exact: true
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
        path: "/checkout",
        element: <Checkout />
    },
    {
        path: "/fabric",
        element: <Fabric />
    },
    {
        path:"/signin",
        element: <SignIn />
    },
    {
        path:"/signup",
        element: <SignUp />
    },
    
]
