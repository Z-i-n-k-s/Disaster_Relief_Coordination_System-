import { Outlet, useLocation } from "react-router-dom";
import Footer from "../pages/shared/footer/Footer";
import Navbar from "../pages/shared/navbar/Navbar";
import { useEffect, useState } from "react";
import Context from "../context";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import apiClient from "../api/Api"; // Import the apiClient

const Main = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  
  // Loading state for fetching user details
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      setLoading(true); // Start loading
      const result = await apiClient.getUser();
      if (result.success) {
        dispatch(setUserDetails(result.data));
      }
      console.log("User details:", result.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false); // End loading after fetching
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Hide navbar & footer for login/signup pages OR if a user is logged in
  const noHeaderFooter =
    location.pathname.includes("login") || 
    location.pathname.includes("signup") || 
    !!user; // Hide navbar if user exists

  return (
    <div>
      <Context.Provider value={{ fetchUserDetails }}>
        {/* Conditionally render Navbar */}
        {!noHeaderFooter && <Navbar />}
        
        {/* Show loading spinner if data is being fetched */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="loader border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
            <span className="mt-4 text-xl text-blue-500">Loading ...</span>
          </div>
        ) : (
          <Outlet />
        )}

        {/* Conditionally render Footer */}
        {!noHeaderFooter && <Footer />}
      </Context.Provider>
    </div>
  );
};

export default Main;
