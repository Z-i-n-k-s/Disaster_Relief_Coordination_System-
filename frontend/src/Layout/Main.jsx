import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../pages/shared/footer/Footer";
import Navbar from "../pages/shared/navbar/Navbar";
import { useEffect, useState } from "react";
import Context from "../context";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import apiClient from "../api/Api"; // Import the apiClient
import { toast } from "react-toastify";

const Main = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);

  const [fetching, setFetching] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  // Overall loading state is true if either fetching or redirecting is true.
  const loading = fetching || redirecting;

  const fetchUserDetails = async () => {
    try {
      setFetching(true);
      const result = await apiClient.getUser();
      if (result.success) {
        dispatch(setUserDetails(result.data));
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    // Check for persisted auth tokens in localStorage
    const token = localStorage.getItem("access_token");
    const ref_token = localStorage.getItem("refresh_token");
    if (token || ref_token) {
      fetchUserDetails();
    } else {
      setFetching(false);
    }
  }, []);

  // Role-based access redirection
  useEffect(() => {
    if (user?.Role) {
      let allowedPrefix = "";
      let defaultRedirect = "";
      switch (user.Role) {
        case "Admin":
          allowedPrefix = "/admin-panel";
          defaultRedirect = "/admin-panel/all-users";
          break;
        case "Volunteer":
          allowedPrefix = "/volunteer-panel";
          defaultRedirect = "/volunteer-panel"; // Adjust if needed
          break;
        case "User":
          allowedPrefix = "/user-panel";
          defaultRedirect = "/user-panel/request-aid";
          break;
        default:
          console.error("Invalid role");
      }
      // If the current route is outside the allowed panel, redirect.
      if (!location.pathname.startsWith(allowedPrefix)) {
        setRedirecting(true);
        toast.success(`Welcome to ${user.Role.toLowerCase()} panel`);
        setTimeout(() => {
          navigate(defaultRedirect);
          setRedirecting(false);
        }, 1000);
      }
    }
  }, [user, location.pathname, navigate]);

  // Hide header and footer when on login/signup pages OR when a user is logged in.
  // After logout (when user becomes null), header/footer will be visible again.
  const noHeaderFooter =
    location.pathname.includes("login") ||
    location.pathname.includes("signup") ||
    !!user;

  return (
    <div>
      <Context.Provider value={{ fetchUserDetails }}>
        {!noHeaderFooter && <Navbar />}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="loader border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
            <span className="mt-4 text-xl text-blue-500">Loading ...</span>
          </div>
        ) : (
          <Outlet />
        )}
        {!noHeaderFooter && <Footer />}
      </Context.Provider>
    </div>
  );
};

export default Main;
