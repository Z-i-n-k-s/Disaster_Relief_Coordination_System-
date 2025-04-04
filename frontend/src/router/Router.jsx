import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home/home/Home";
import Login from "../pages/login/Login";
import SignUp from "../pages/signup/SignUp";
import DonateForm from "../pages/donateForm/DonateForm";
import AboutUs from "../pages/aboutus/AboutUs";
import AdminPanel from "../pages/admin/AdminPanel";
import AllUsers from "../pages/admin/AllUsers";
import Logout from "../pages/logout/Logout";
import AllRelifeCenters from "../pages/admin/AllRelifeCenters";
import AllAidRequests from "../pages/admin/AllAidRequests";
import AidPreparations from "../pages/admin/AidPreparations";
import AidReports from "../pages/admin/AidReports";
import UserPanel from "../pages/user/UserPanel";
import RequestAid from "../pages/user/RequestAid";
import Donate from "../pages/user/Donate";
import UserAidRequests from "../pages/user/UserAidRequests";
import UserDonations from "../pages/user/UserDonations";
import AssignedTasks from "../pages/volunteer/AssignedTasks";
import VolunteerPanel from "../pages/volunteer/VolunteerPanel";
import AffectedAreas from "../pages/admin/AffectedAreas";
import RescueTrackingTasks from "../pages/volunteer/RescueTrackingTasks";

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
      {
        path: "user-panel",
        element: <UserPanel />,
        children: [
          {
            path: "request-aid",
            element: <RequestAid />,
          },
          {
            path: "donate",
            element: <Donate />,
          },
          {
            path: "all-aid-requests",
            element: <UserAidRequests />,
          },
          {
            path: "all-donations",
            element: <UserDonations />,
          },
          {
            path: "user-logout",
            element: <Logout />,
          },
        ],
      },
      {
        path: "volunteer-panel",
        element: <VolunteerPanel />,
        children: [
          {
            path: "assigned-tasks",
            element: <AssignedTasks />,
          },
          {
            path: "tracking-tasks",
            element: <RescueTrackingTasks />,
          },
          {
            path: "vol-logout",
            element: <Logout />,
          },
        
        ],
      },
       {
        path: "admin-panel",
        element: <AdminPanel />,
        children: [
          {
            path: "all-users",
            element: <AllUsers />,
          },
          {
            path: "affected-area",
            element: <AffectedAreas />,
          },
          {
            path: "all-relief-centers",
            element: <AllRelifeCenters />,
          },
          {
            path: "all-aid-requests",
            element: <AllAidRequests/>,
          },
          {
            path: "aid-preparations",
            element: <AidPreparations />,
          },
          {
            path: "aid-reports",
            element: <AidReports/>,
          },
          {
            path: "admin-logout",
            element: <Logout />,
          },
        ],
      },
    ],
  },
]);
