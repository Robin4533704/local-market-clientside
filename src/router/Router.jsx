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
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../pages/dashbord/paymentmethod/PaymentFrom";
import Payment from "../pages/dashbord/paymentmethod/Payment";

// ✅ Stripe publishable key দিয়ে instance তৈরি
const stripePromise = loadStripe("pk_test_YourPublicKeyHere"); // ← এখানে তোমার Stripe public key বসাও

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
        // ✅ Wrapped with <Elements> to fix the error
        element: <Payment/>
      
      },
    ],
  },
]);
