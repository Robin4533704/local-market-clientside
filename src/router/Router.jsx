import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/home/Home";
import Login from "../pages/Authntication.jsx/Login";
import AuthLayout from "../layout/AuthLayout";
import ForgotPassword from "../pages/Authntication.jsx/ForgetPassword";
import Register from "../pages/register/Register";
import Coverage from "../pages/coverage/Coverage";
import PrivetRoute from "../route/PrivetRoute";
import Myparcels from "../pages/dashbord/Myparcels";
// Stripe Elements
import Payment from "../pages/dashbord/paymentmethod/Payment";
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

import ProductDetails from "../pages/home/ShopCategories/ProductDetails";
import PublicData from "../pages/dashbord/pandingdelivery/ProductList/PublicData";
import OrderListTable from "../pages/dashbord/pandingdelivery/ProductList/PriceTrends/OrderListTable";
import Checkout from "../pages/home/banner/Checkout";
import AddProducts from "../pages/dashbord/pandingdelivery/ProductList/PriceTrends/AddProducts";
import AddTable from "../pages/dashbord/pandingdelivery/ProductList/PriceTrends/AddTable";
import ManageWatchlist from "../pages/dashbord/pandingdelivery/ProductList/Watchlist";
import MyOrders from "../pages/dashbord/pandingdelivery/ProductList/PriceTrends/Myorder";

import MyProductsVendor from "../pages/dashbord/pandingdelivery/ProductList/PriceTrends/MyProducts";
import AddProductVendor from "../pages/home/ShopCategories/AddProductVandor";
import MakeVendor from "../pages/dashbord/MakeVendor";
import VendorRoute from "../route/VendorRoute";
import UpdateProduct from "../pages/dashbord/pandingdelivery/ProductList/PriceTrends/UpdateProduct";
import AddAdvertisement from "../pages/dashbord/pandingdelivery/AddAdvertisement/AddAdvertisement";
import MyAdvertisements from "../pages/dashbord/pandingdelivery/AddAdvertisement/MyAdvertisements";
import UpdateAdvertisement from "../pages/dashbord/pandingdelivery/AddAdvertisement/UpdateAdvertisement";
import AdminAllProducts from "../adminpanel/AdminAllProducts";
import AdminAllUsers from "../pages/home/banner/amincomponet/AdminAllUsers";
import AdminUpdate from "../adminpanel/AdminUpdate";
import AdminAllAdvertisements from "../adminpanel/AdminAllAdvertisements";
import AdminAllOrders from "../adminpanel/AdminAllOrders";
import Dashboard from "../adminpanel/DashBord";
import PriceTrends from "../pages/dashbord/pandingdelivery/ProductList/PriceTrends";
import ProductEdit from "../pages/dashbord/pandingdelivery/ProductList/ProductEdit";
import OrderDetails from "../pages/dashbord/pandingdelivery/ProductList/PriceTrends/OrderDetails";
import ErrorPage from "../pages/Errorpage";
import ParcelPayment from "../pages/dashbord/paymentmethod/parcelPayment";



export const router = createBrowserRouter([
  {
    path: "/",
    
    element: <RootLayout />,
    children: [
      { index: true,
        
        element: <Home /> },

      { path: "coverage", element: <Coverage />, loader: () => fetch("/Services.json")},
      { path: "forbidden", element: <Forbidden /> },
      { path: "beaider", element: <PrivetRoute><BeARider /></PrivetRoute>, loader: () => fetch("/Services.json") },
     
      { path: "updateprofile", element: <UpdateProfiles /> },
      { path: "pending-deliveries", element: <RiderRoute><PendingDeliveries /></RiderRoute> },
      { path: "about", element: <About /> },
      { path: "contactus", element: <ContactUs /> },
      { path: "OrganicEssentials", element: <OrganicEssentials /> },
      { path: "productlist/:id", element: <PrivetRoute><ProductList /></PrivetRoute> },
      { path: "productcard/:id", element: <PrivetRoute><ProductCard /></PrivetRoute> },
    
   
      {
        path: "/product-details/:id",
        element: <ProductDetails/>
      },

      {
        path: "/PublicData",
        element: <PrivetRoute><PublicData/></PrivetRoute>
      },
     
      {
     path: "/editproducts/:id",
     element:<ProductEdit/>
      },
   
    {
  path: "/checkout/:productId",
  element: <Checkout />
}
,
{
 path: "/addtable",
 element: <PrivetRoute><AddTable/></PrivetRoute>
},
{
  path: "/addproduct",
  element:<PrivetRoute><AddProducts></AddProducts></PrivetRoute>
},
{ path: "/sentparsel", element: <PrivetRoute><SentParcel /></PrivetRoute>, loader: () => fetch("/serviceData.json").then(res => res.json()) },

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
    element: <Dashboard/>,
     errorElement: <ErrorPage />,
    children: [
      { path: "myparcels", element: <Myparcels /> },
      { path: "pending-deliveries", element: <RiderRoute><PendingDeliveries /></RiderRoute> },
      { path: "completed-deliveries", element: <RiderRoute><CompletedDeliveries /></RiderRoute> },
      { path: "makeadmin", element: <AdminRoute><MakeAdmin /></AdminRoute> },

      {
        path: "makevendor", element: <AdminRoute> <MakeVendor/> </AdminRoute>
      },

      { path: "active-riders", element: <AdminRoute><ActiveRiders /></AdminRoute> },
      { path: "pending-riders", element: <AdminRoute><PandingRiders /></AdminRoute> },
      { path: "assign-riders", element: <AdminRoute><AssainRiders /></AdminRoute> },
      { path: "payment/:parcelId", element: <Payment /> },
      { path: "parcelpayment/:parcelId", element: <ParcelPayment/>},
     
      { path: "tracking", element: <TackParcel /> },
      { path: "tracking/:trackingId", element: <PrivetRoute><UpdateTracking /></PrivetRoute> },
      { path: "updateprofile", element: <UpdateProfiles />
        
      },
      
     
       {
         path:"price-trends", element: <PrivetRoute> <PriceTrends></PriceTrends> </PrivetRoute>,
       },
       {
        path: "myorder",
        element: <MyOrders/>
       },
      {
     path: "my-advertisements",
     element: <MyAdvertisements/>
      },
       {
        path:"watchlist" ,element: <PrivetRoute><ManageWatchlist/></PrivetRoute>
       },
       {
  path: "make-vendor",
  element: <AdminRoute><MakeVendor /></AdminRoute>
},

       {
  path: "myproductvandor",
  element: <MyProductsVendor/>
},
{
  path: "update-product/:id",
 element: <UpdateProduct/>
},
{
   path: "AdminUpdate/:id", element: <AdminUpdate /> 
},
 {
       path: "addproductvandor",
       element: <AddProductVendor/>
      },
      {
        path:"Add-Advertisement",
        element: <VendorRoute> <AddAdvertisement/> </VendorRoute>
      },
      {
        path: "update-advertisement/:id",
        element: <VendorRoute><UpdateAdvertisement/> </VendorRoute>
      },
      {
        path: "AdminAllProducts",
        element: <AdminRoute><AdminAllProducts/></AdminRoute>
      },
      {
      path: "AdminAllAdvertisements",
      element: <AdminAllAdvertisements/>
      },
      {
     path: "AdminAllOrders",
     element: <AdminAllOrders/>
      },
      {
        path: "adminuserall",
        element: <AdminAllUsers/>
      },
       {
        path: "orderlist", element:<OrderListTable/> 
      },
       {
        path: "myorder",
        element: <MyOrders/>
       },
  
        {
  path: "order-details/:id", 
  element: <OrderDetails />
}

          
      ]
  }
]);
