import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../../api/Api";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../store/userSlice"; 
import { FaSpinner } from "react-icons/fa";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);

  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleLogout = async () => {
      if (isLoggingOut) return;

      setIsLoggingOut(true);
      try {
        setLoading(true);
        const response = await apiClient.logout();

        if (response?.success) {
          dispatch(setUserDetails(null));
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");

          toast.success("Logged out successfully");
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          const errorMessage = response?.message || "Logout failed!";
          toast.error(errorMessage, { position: "top-center" });
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong!";
        toast.error(errorMessage, { position: "top-center" });
      } finally {
        setLoading(false);
      }
    };

    handleLogout();
  }, [navigate, isLoggingOut, dispatch]);

  return (
    <div className="flex justify-center items-center h-screen">
      {loading && (
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-4xl text-gray-600" />
          <p className="mt-2 text-gray-600">Logging out...</p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Logout;
