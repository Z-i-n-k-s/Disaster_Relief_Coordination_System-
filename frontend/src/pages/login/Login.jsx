import { Link, useNavigate } from "react-router-dom";
import bg from "../../assets/login.bg.jpg";
import { useState } from "react";
import {  toast, ToastContainer } from 'react-toastify';
import apiClient from "../../api/Api";

const bgStyle = {
  backgroundImage: `url(${bg})`,
  backgroundSize: "cover",
  backgroundPosition: "top",
  backgroundRepeat: "no-repeat",
  width: "100%",
};

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.login({
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        console.log("login Successful", response);
        const { role } = response.user_info;
        console.log("Role:", role);

        switch (role) {
          case "admin":
            toast.success(`Welcome to admin panel`);
            setTimeout(() => {
              navigate("/admin-panel");
            }, 1000);

            break;
          case "volunteer":
            toast.success(`Welcome to volunteer panel`);
            setTimeout(() => {
              navigate("/");
            }, 1000);

            break;
          case "user":
            toast.success(`Welcome to user panel`);
            setTimeout(() => {
              navigate("/");
            }, 1000);

            break;
          default:
            console.error("Invalid role");
        }
      } else {
        console.log("login failed", response);
        const errorMessage = response.message || "wrong!";
        toast.error(errorMessage, { position: "top-center" });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={bgStyle}>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="min-h-[650px] md:min-h-[750px] bg-gradient-to-r from-black/90 to-green-800/60 pt-32 pb-10 md:pt-48">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 text-white">
            {/* Left Side Text - Centered */}
            <div className="text-left p-20">
              <h1 className="text-5xl font-bold text-yellow-400 ">
                Welcome Back to Jonojibon Aid
              </h1>
              <p className="mt-6 text-lg text-gray-300 ">
                Login to your account to continue making a difference. Whether
                you’re here to donate or volunteer, your efforts matter.
              </p>
            </div>

            {/* Right Side Form - Less Width and Balanced */}
            <div className="bg-black text-white p-6 rounded-lg shadow-lg w-full md:w-[400px] mx-auto">
              <h2 className="text-3xl font-semibold mb-6 text-center">
                Login to Your Account
              </h2>
              {loading ? (
                <div className="flex flex-col items-center">
                  <div className="loader border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
                  <p className="mt-4 text-blue-500">Logging...</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={data.email}
                      onChange={handleOnChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={data.password}
                      onChange={handleOnChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <a
                      href="#"
                      className="text-yellow-300 text-sm hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="w-full p-3 bg-yellow-300 text-black font-bold rounded-md hover:bg-primary-dark focus:outline-none"
                    >
                      Log In
                    </button>
                  </div>
                </form>
              )}
              <div className="mt-6 text-center">
                <p className="text-sm">
                  Don’t have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-yellow-300 hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
