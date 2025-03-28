import  { useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { FaUserLarge } from "react-icons/fa6";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import apiClient from "../../api/Api";


const DeleteUserDetails = ({ onClose, user, callFunc }) => {
  const [showLoader, setShowLoader] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Destructure necessary properties from the user object
  const { UserID, Email, Name, Role, profilePic } = user;

  const deleteUser = async () => {
    setShowLoader(true);
    try {
      const dataResponse = await apiClient.deleteUser(UserID);
      if (dataResponse.success) {
        toast.success(dataResponse.message);
        callFunc(); // Refresh or update the parent component if needed
        onClose();
      } else {
        toast.error(dataResponse.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error(error.message || "Error deleting user");
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
            Delete User?
          </h1>
          <div className="flex flex-col items-center">
            {imgError || !profilePic ? (
              <FaUserLarge className="w-24 h-24 text-gray-500 rounded-full shadow-md mt-4" />
            ) : (
              <img
                src={profilePic}
                alt="Profile"
                className="w-24 h-24 rounded-full shadow-md mt-4"
                onError={() => setImgError(true)}
              />
            )}
            <div className="w-full text-center text-gray-300">
              <p className="p-2 text-lg">
                <span className="font-medium text-gray-400">Name:</span> {Name}
              </p>
              <p className="p-2 text-lg">
                <span className="font-medium text-gray-400">Email:</span> {Email}
              </p>
              <p className="p-2 text-lg">
                <span className="font-medium text-gray-400">Role:</span> {Role}
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition duration-300"
                onClick={deleteUser}
              >
                Confirm
              </button>
              <button
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg shadow ml-4 hover:bg-yellow-600 transition duration-300"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default DeleteUserDetails;
