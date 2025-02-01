import {
    createBrowserRouter,

  } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home/home/Home";
import Login from "../pages/login/Login";
import SignUp from "../pages/signup/SignUp";
import DonateForm from "../pages/donateForm/DonateForm";
import AdminPanel from "../pages/Admin/AdminPanel";
import VolunteerPanel from "../pages/volunteer/VolunteerPanel";

 export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main> </Main>,
      children:[
      {
        path:'/',
        element:<Home></Home>
      },
      {
        path:"donateform",
        element:<DonateForm></DonateForm>
      },
      {
        path:'login',
        element:<Login></Login>
      },
      {
        path:"signup",
        element:<SignUp></SignUp>
      },
      {
        path: "admin-panel",
        element: <AdminPanel />,
        
      },
      {
        path: "volunteer-panel",
        element: <VolunteerPanel />,
        
      },
      ]
    },
  ]);