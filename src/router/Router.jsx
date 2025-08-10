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

// ✅ Stripe publishable key দিয়ে instance তৈরি
 // ← এখানে তোমার Stripe public key বসাও

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
        path:'beaider',
        element: <PrivetRoute> <BeARider/> </PrivetRoute>,
          loader: () => fetch("/Services.json"),
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
  path: "payment-history",
  Component: PaymentHistry
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
