import { Outlet, useLocation } from "react-router-dom";
import Footer from "../pages/shared/footer/Footer";
import Navbar from "../pages/shared/navbar/Navbar";
import { useEffect, useState } from "react";
import Context from "../context";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import apiClient from "../api/Api"; // Import the apiClient

const Main = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Loading state for fetching user details
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      setLoading(true); // Start loading
      const result = await apiClient.getUser();
      if (result.success) {
        dispatch(setUserDetails(result.data));
      }
      console.log("User details:", result);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false); // End loading after fetching
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const noHeaderFooter =
    location.pathname.includes("login") || location.pathname.includes("signup");

  return (
    <div>
      <Context.Provider
        value={{
          fetchUserDetails,
        }}
      >
        {noHeaderFooter || <Navbar />}
        
        {/* Show loading spinner if data is being fetched */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="loader border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
            <span className="mt-4 text-xl text-blue-500">Loading ...</span>
          </div>
        ) : (
          <Outlet />
        )}

        {noHeaderFooter || <Footer />}
      </Context.Provider>
    </div>
  );
};

export default Main;
