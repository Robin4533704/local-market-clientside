import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/home/Home";
import Login from "../pages/Authntication.jsx/Login";
import AuthLayout from "../layout/AuthLayout";
import ForgotPassword from "../pages/Authntication.jsx/ForgetPassword";
import Register from "../pages/register/Register";
import Coverage from "../pages/coverage/Coverage";
import PrivetRoute from "../route/PrivetRoute";
import DashBord from "../pages/dashbord/DashBord";
import Myparcels from "../pages/dashbord/Myparcels";

// Stripe Elements
import Payment from "../pages/dashbord/paymentmethod/Payment";
import PaymentHistry from "../pages/dashbord/paymentmethod/PaymentHistry";
import TackParcel from "../pages/dashbord/tackparcel/TackParcel";
import UpdateTracking from "../pages/dashbord/tackparcel/UpdateTracking";
import BeARider from "../pages/dashbord/barider/BeARider";
import PandingRiders from "../pages/dashbord/panding riders/PandingRiders";
import ActiveRiders from "../pages/dashbord/activeriders/ActiveRiders";
import UpdateProfiles from "../pages/updateprofile/UpdateProfiles";
import About from "../pages/About";
import ContactUs from "../pages/ContactUs";
import OrganicEssentials from "../pages/home/OrganicEssentials/OrganicEssentials";

import MakeAdmin from "../pages/dashbord/makAddmin/MakeAdmin";
import Forbidden from "../pages/forbedn/Forbidden";
import AdminRoute from "../route/AdminRoute";
import AssainRiders from "../pages/dashbord/assingriders/AssainRiders";
import SentParcel from "../pages/sentparsel/SentParsel";
import RiderRoute from "../route/riderRoute";
import CompletedDeliveries from "../pages/dashbord/pandingdelivery/completeddeliver/CompletedDeliveries";
import PendingDeliveries from "../pages/dashbord/pandingdelivery/pendingDeliveries";
import ProductList from "../pages/dashbord/pandingdelivery/ProductList/ProductList";
import ProductCard from "../pages/dashbord/pandingdelivery/ProductList/ProductCard";
import NotificationsBall from "../pages/home/banner/NotificationsBall";
import ShopCategorie from "../pages/home/ShopCategories/ShopCategorie";
import ProductDetails from "../pages/home/ShopCategories/ProductDetails";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "coverage", element: <Coverage />, loader: () => fetch("/Services.json") },
      { path: "forbidden", element: <Forbidden /> },
      { path: "beaider", element: <PrivetRoute><BeARider /></PrivetRoute>, loader: () => fetch("/Services.json") },
      { path: "updateprofile", element: <UpdateProfiles /> },
      { path: "pending-deliveries", element: <RiderRoute><PendingDeliveries /></RiderRoute> },
      { path: "about", element: <About /> },
      { path: "contactus", element: <ContactUs /> },
      { path: "OrganicEssentials", element: <OrganicEssentials /> },
      { path: "productlist", element: <PrivetRoute><ProductList /></PrivetRoute> },
      { path: "productcard/:id", element: <PrivetRoute><ProductCard /></PrivetRoute> },
      {
        path: "/product-details",
        element: <ProductDetails/>
      },
      { path: "sentparsel", element: <PrivetRoute><SentParcel /></PrivetRoute>, loader: () => fetch("/serviceData.json").then(res => res.json()) },
        { path: "notificationsBall" , element: <NotificationsBall/>},
        {
          path: "/shoppingcatagory",
          element: <PrivetRoute> <ShopCategorie/> </PrivetRoute>
        },

      // Auth routes
      {
        path: "/",
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
          { path: "forgetpassword", element: <ForgotPassword /> },
        ]
      }
    ]
  },

  {
    path: "/dashboard",
    element: <DashBord />,
    children: [
      { path: "myparcels", element: <Myparcels /> },
      { path: "pending-deliveries", element: <RiderRoute><PendingDeliveries /></RiderRoute> },
      { path: "completed-deliveries", element: <RiderRoute><CompletedDeliveries /></RiderRoute> },
      { path: "makeadmin", element: <AdminRoute><MakeAdmin /></AdminRoute> },
      { path: "active-riders", element: <AdminRoute><ActiveRiders /></AdminRoute> },
      { path: "pending-riders", element: <AdminRoute><PandingRiders /></AdminRoute> },
      { path: "assign-riders", element: <AdminRoute><AssainRiders /></AdminRoute> },
      { path: "payment/:parcelId", element: <Payment /> },
      { path: "payment-history", element: <PaymentHistry /> },
      { path: "tracking", element: <TackParcel /> },
      { path: "tracking/:trackingId", element: <UpdateTracking /> },
      { path: "updateprofile", element: <UpdateProfiles /> },
    ]
  }
]);
