import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bg from "../../assets/signup.jpg";
import { toast, ToastContainer } from "react-toastify";
import apiClient from "../../api/Api";

const bgStyle = {
  backgroundImage: `url(${bg})`,
  backgroundSize: "cover",
  backgroundPosition: "top",
  backgroundRepeat: "no-repeat",
  width: "100%",
};

const SignUp = () => {
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [data, setData] = useState({
    Email: "",
    Password: "",
    Name: "",
    Password_confirmation: "",
    PhoneNo: "",
    AssignedCenter: "",
    Role: "",
  });
  const [loading, setLoading] = useState(false); // State for loader
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.Password !== data.Password_confirmation) {
      console.error("Password and Confirm Password are not the same");
      toast.error("Password and Confirm Password do not match!");
      return;
    }
   
    setLoading(true); // Show loader
    
    try {
      const role = isVolunteer ? "Volunteer" : "User";
      const requestData = {
        Email: data.Email,
        Password: data.Password,
        Password_confirmation: data.Password_confirmation,
        Name: data.Name,
        Role: role,
        PhoneNo: data.PhoneNo,
      };

      if (isVolunteer) {
        requestData.AssignedCenter = data.AssignedCenter;
      }
      console.log("data to submit",requestData)

      const response = await apiClient.register(requestData);
      
      if (response.success) {
        console.log("Registration Successful", response);
        toast.success("Registration Successful!");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.error("Error during registration", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false); // Hide loader
    }
  };
  const [centers, setCenters] = useState([]);

  const getReliefCenters = async () => {
    try {
      const response = await apiClient.getReliefCenters();
      console.log("API Response:", response); // Debugging

      if (!Array.isArray(response)) {
        console.error("Expected an array but got:", response);
        return;
      }

      // Extract only CenterID and CenterName
      const filteredCenters = response.map(({ CenterID, CenterName }) => ({
        CenterID,
        CenterName,
      }));

      setCenters(filteredCenters);
    } catch (error) {
      console.error("Error fetching relief centers:", error);
    }
  };

  useEffect(() => {
    getReliefCenters();
  }, []);

  return (
    <div style={bgStyle}>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="min-h-[650px] md:min-h-[750px] bg-gradient-to-r from-black/90 to-green-900/70 pt-32 pb-10 md:pt-48">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 text-white">
            {/* Left Side Text */}
            <div className="text-left p-20">
              <h1 className="text-5xl font-bold text-yellow-400">
                {isVolunteer
                  ? "Become a Volunteer"
                  : "Join Us in Making a Difference"}
              </h1>
              <p className="mt-6 text-lg text-gray-300">
                {isVolunteer
                  ? "Sign up to volunteer with Jonojibon Aid and help disaster victims in Bangladesh. Your time and dedication can bring hope to those in need."
                  : "Sign up to be a part of Jonojibon Aid. Your contribution can help disaster victims in Bangladesh and bring hope to those in need. Whether you are donating or volunteering, every effort counts."}
              </p>
            </div>

            {/* Right Side Form */}
            <div className="bg-black text-white p-6 rounded-lg shadow-lg w-full md:w-[400px] mx-auto">
              <h2 className="text-3xl font-semibold mb-6 text-center">
                {isVolunteer ? (
                  <>
                    <span className="text-yellow-300">Volunteer</span> Signup
                  </>
                ) : (
                  <>
                    Sign Up for <br />
                    <span className="text-yellow-300"> Jonojibon Aid</span>
                  </>
                )}
              </h2>
              {loading ? (
                <div className="flex flex-col items-center">
                  <div className="loader border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
                  <p className="mt-4 text-blue-500">Registering...</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      type="text"
                      name="Name"
                      value={data.Name}
                      onChange={handleOnChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="Email"
                      value={data.Email}
                      onChange={handleOnChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {/* // {isVolunteer && ( */}
                  <div>
                    <label className="block text-sm font-medium">
                      Contact Info
                    </label>
                    <input
                      type="text"
                      name="PhoneNo"
                      value={data.PhoneNo}
                      onChange={handleOnChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  {/* //  )} */}

                  {/* Password Fields */}
                  <div>
                    <label className="block text-sm font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      name="Password"
                      value={data.Password}
                      onChange={handleOnChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="Password_confirmation"
                      value={data.Password_confirmation}
                      onChange={handleOnChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                  {isVolunteer && (
                    <div>
                      <label className="block text-sm font-medium">
                        Select Center
                      </label>
                      <select
                        name="AssignedCenter"
                        value={data.AssignedCenter}
                        required
                        onChange={handleOnChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option
                          value=""
                          className="bg-black text-white text-center text-2xl"
                        >
                          Select a Center
                        </option>
                        {centers.map((center) => (
                          <option
                            key={center.CenterID}
                            value={center.CenterID} // Store CenterID as value
                            className="bg-gray-300 text-black"
                          >
                            {center.CenterName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="w-full p-3 bg-yellow-300 text-black font-bold rounded-md hover:bg-primary-dark focus:outline-none"
                    >
                      {isVolunteer ? "Sign Up as Volunteer" : "Sign Up"}
                    </button>
                  </div>
                </form>
              )}
              {/* Switch between Normal Signup and Volunteer Signup */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsVolunteer(!isVolunteer)}
                  className="text-yellow-300 hover:underline"
                >
                  {isVolunteer
                    ? "Switch to Regular Signup"
                    : "Sign Up as Volunteer"}
                </button>
              </div>

              {!isVolunteer && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-300">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-yellow-300 hover:underline"
                    >
                      Login here
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
