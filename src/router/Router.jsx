import {
  createBrowserRouter,
 
} from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/home/Home";
import Login from "../pages/Authntication.jsx/Login";
import AuthLayout from "../layout/AuthLayout";
import ForgotPassword from "../pages/Authntication.jsx/ForgetPassword";
import Register from "../pages/register/Register"
import Coverage from "../pages/coverage/Coverage";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
        {
            index: true,
            Component: Home
        },
        {
      path: '/coverage',
      Component: Coverage,
      loader: () => fetch('/Services.json')
        },
        {
          path: '/',
          Component: AuthLayout,
          children:[
            {
              path:'/login',
              Component: Login
            },
            {
           path: '/register',
           Component: Register
            },
            {
              path: '/forgetpasword',
              Component: ForgotPassword
            }
          ]
        }
       
    ]
  },

]);