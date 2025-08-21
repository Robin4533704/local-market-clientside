import {
  createBrowserRouter,
} from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/home/Home";
import Login from "../pages/Authntication.jsx/Login";
import AuthLayout from "../layout/AuthLayout";
import ForgotPassword from "../pages/Authntication.jsx/ForgetPassword";
import Register from "../pages/register/Register";
import Coverage from "../pages/coverage/Coverage";
import PrivetRoute from "../route/PrivetRoute";
import SentParsel from "../pages/sentparsel/SentParsel";
import DashBord from "../pages/dashbord/DashBord";
import Myparcels from "../pages/dashbord/Myparcels";

// ✅ Stripe Elements import
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




export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/coverage",
        Component: Coverage,
        loader: () => fetch("/Services.json"),
      },
      {
        path: "/forbidden",
        Component: Forbidden
      },
      {
        path:'beaider',
        element: <PrivetRoute> <BeARider/> </PrivetRoute>,
          loader: () => fetch("/Services.json"),
      },
       {
  path: '/updateprofile',
   Component: UpdateProfiles
},
{
  path: '/about',
  Component: About
},
{
path: '/contactus',
Component: ContactUs
},
{
  path: '/OrganicEssentials',
  element:  <OrganicEssentials/>
},
     
      {
        path: "/sentparsel",
        element: (
          <PrivetRoute>
            <SentParsel />
          </PrivetRoute>
        ),
        loader: () => fetch("/Services.json"),
      },
      {
        path: "/",
        Component: AuthLayout,
        children: [
          {
            path: "/login",
            Component: Login,
          },
          {
            path: "/register",
            Component: Register,
          },
         
          {
            path: "/forgetpasword",
            Component: ForgotPassword,
          },
        ],
      },
    ],
  },

  {
    path: "/dashboard",
    element: <DashBord />,
    children: [
      {
        path: "myparcels",
        element: <Myparcels />,
      },
      
        {
  path: "payment/:parcelId",
  element:  <Payment />
   
  
},
{
  path: 'updateprofile',
   Component: UpdateProfiles
},
{
  path: "payment-history",
  Component: PaymentHistry
},
{
  path: 'makeadmin',

  element: <AdminRoute> <MakeAdmin></MakeAdmin> </AdminRoute>
},

{
  path: 'active-riders',
  // Component: ActiveRiders
  element: <AdminRoute> <ActiveRiders></ActiveRiders> </AdminRoute>
},
{
  path: 'pending-riders',
 element: <AdminRoute> <PandingRiders></PandingRiders> </AdminRoute>
},
{
  path: 'tracking',
  Component : TackParcel
},
{
  path: 'tracking/:trackingId',
  Component: UpdateTracking
},
    ],
  },
]);
