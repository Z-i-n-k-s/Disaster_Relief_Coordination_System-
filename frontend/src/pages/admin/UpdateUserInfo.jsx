import React, { useState, useEffect } from "react";
import { FaWindowClose } from "react-icons/fa";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import apiClient from "../../api/Api"; // Adjust the path as necessary

const UpdateUserInfo = ({ user, onClose, callFunc }) => {
  // Destructure the properties from the user object.
  const { UserID, Email, Name, Role, PhoneNo } = user;

  const [showLoader, setShowLoader] = useState(false);
  const [userRole, setUserRole] = useState(Role);
  const [userNewName, setUserNewName] = useState(Name);
  const [userNewEmail, setUserNewEmail] = useState(Email);
  const [userNewPhoneNo, setUserNewPhoneNo] = useState(PhoneNo);

  // State for centers and the selected center (for Volunteer/Manager roles)
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");

  // Fetch relief centers when role becomes Volunteer or Manager
  useEffect(() => {
    if (userRole === "Volunteer" || userRole === "Manager") {
      getReliefCenters();
    }
  }, [userRole]);

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

  const handleOnChangeSelect = (e) => {
    setUserRole(e.target.value);
  };

  const handleOnChangeName = (e) => {
    setUserNewName(e.target.value);
  };

  const handleOnChangeEmail = (e) => {
    setUserNewEmail(e.target.value);
  };

  const handleOnChangePhoneNo = (e) => {
    setUserNewPhoneNo(e.target.value);
  };

  const updateInfo = async () => {
    // Build the request data
    const requestData = {
      Name: userNewName,
      Email: userNewEmail,
      Role: userRole,
      PhoneNo: userNewPhoneNo,
    };

    // If the role is Volunteer or Manager, include the assigned center id
    if (userRole === "Volunteer" || userRole === "Manager") {
      requestData.AssignedCenter = selectedCenter;
    }

    setShowLoader(true);
    try {
      const responseData = await apiClient.updateUser(UserID, requestData);
      if (responseData.success) {
        toast.success(responseData.message);
        onClose();
        callFunc();
      } else {
        toast.error(responseData.message || "Failed to update user");
      }
    } catch (error) {
      toast.error(error.message || "Error updating user info");
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 w-full z-10 flex justify-center items-center bg-black bg-opacity-70">
      {showLoader ? (
        <div className="flex justify-center items-center bg-gray-900 shadow-lg p-6 w-full max-w-lg rounded-lg h-40">
          <ThreeDots type="ThreeDots" color="#FFD700" height={80} width={80} />
        </div>
      ) : (
        <div className="relative bg-gray-900 shadow-lg p-6 w-full max-w-lg rounded-lg text-white">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
            onClick={onClose}
          >
            <FaWindowClose size={24} />
          </button>
          <h1 className="pb-4 text-2xl font-semibold text-center text-white">
            Change User Details
          </h1>
          <div className="w-full">
            <p className="p-2 text-lg">
              <span className="font-medium text-gray-300">Current Name:</span> {Name}
            </p>
            <input
              type="text"
              placeholder="Enter new name"
              name="newName"
              value={userNewName}
              onChange={handleOnChangeName}
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white mb-4"
            />
            <p className="p-2 text-lg">
              <span className="font-medium text-gray-300">Current Email:</span> {Email}
            </p>
            <input
              type="email"
              placeholder="Enter new email"
              name="newEmail"
              value={userNewEmail}
              onChange={handleOnChangeEmail}
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white mb-4"
            />
            <p className="p-2 text-lg">
              <span className="font-medium text-gray-300">Current Phone Number:</span> {PhoneNo}
            </p>
            <input
              type="text"
              placeholder="Enter new phone number"
              name="newPhoneNo"
              value={userNewPhoneNo}
              onChange={handleOnChangePhoneNo}
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white mb-4"
            />
            <div className="flex items-center justify-between my-4">
              <p className="text-lg text-gray-300">
                <span className="font-medium">Role:</span>
              </p>
              <select
                className="border border-gray-700 px-4 py-2 rounded-lg bg-gray-800 text-white"
                value={userRole}
                onChange={handleOnChangeSelect}
              >
                {["Admin", "Manager", "User", "Volunteer"].map((roleOption) => (
                  <option value={roleOption} key={roleOption}>
                    {roleOption}
                  </option>
                ))}
              </select>
            </div>
            {(userRole === "Volunteer" || userRole === "Manager") && (
              <div className="flex items-center justify-between my-4">
                <p className="text-lg text-gray-300">
                  <span className="font-medium">Select Center:</span>
                </p>
                <select
                  className="border border-gray-700 px-4 py-2 rounded-lg bg-gray-800 text-white"
                  value={selectedCenter}
                  onChange={(e) => setSelectedCenter(e.target.value)}
                >
                  <option value="">Select a center</option>
                  {centers.map((center) => (
                    <option key={center.CenterID} value={center.CenterID}>
                      {center.CenterName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="bg-yellow-500 text-black font-semibold px-4 py-2 rounded-full shadow hover:bg-yellow-600 transition duration-300"
              onClick={updateInfo}
            >
              Change
            </button>
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded-full shadow ml-4 hover:bg-gray-500 transition duration-300"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default UpdateUserInfo;
