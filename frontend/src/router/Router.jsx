import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home/home/Home";
import Login from "../pages/login/Login";
import SignUp from "../pages/signup/SignUp";
import DonateForm from "../pages/donateForm/DonateForm";
import AboutUs from "../pages/aboutus/AboutUs";
import AdminPanel from "../pages/admin/AdminPanel";
import AllUsers from "../pages/admin/AllUsers";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main> </Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "donateform",
        element: <DonateForm></DonateForm>,
      },
      {
        path: "aboutus",
        element: <AboutUs></AboutUs>,
      },
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "signup",
        element: <SignUp></SignUp>,
      },
      // {
      //   path: "user-panel",
      //   element: <UserPanel />,
      //   children: [
      //     {
      //       path: "request-aid",
      //       element: <RequestAid />,
      //     },
      //     {
      //       path: "donate",
      //       element: <Donate />,
      //     },
      //     {
      //       path: "all-aid-requests",
      //       element: <UserAidRequests />,
      //     },
      //     {
      //       path: "all-donations",
      //       element: <UserDonations />,
      //     },
      //   ],
      // },
      // {
      //   path: "volunteer-panel",
      //   element: <VolunteerPanel />,
      //   children: [
      //     {
      //       path: "assigned-tasks",
      //       element: <AssignedTasks />,
      //     },
      //     {
      //       path: "aids-prepared",
      //       element: <AidsPrepared/>,
      //     },
      //     {
      //       path: "all-participations",
      //       element: <AllParticipations />,
      //     },
        
      //   ],
      // },
       {
        path: "admin-panel",
        element: <AdminPanel />,
        children: [
          {
            path: "all-users",
            element: <AllUsers />,
          },
          // {
          //   path: "all-relief-centers",
          //   element: <AllRelifeCenters />,
          // },
          // {
          //   path: "all-aid-requests",
          //   element: <AllAidRequests/>,
          // },
          // {
          //   path: "aid-preparations",
          //   element: <AidPreparations />,
          // },
          // {
          //   path: "aid-reports",
          //   element: <AidReports />,
          // },
        ],
      },
    ],
  },
]);
