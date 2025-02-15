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
    <div className="fixed top-0 bottom-0 left-0 right-0 w-full z-10 flex justify-center items-center bg-slate-200 bg-opacity-50">
      {showLoader ? (
        <div className="flex justify-center items-center bg-white shadow-lg p-6 w-full max-w-lg rounded-lg h-40">
          <ThreeDots type="ThreeDots" color="#7542ff" height={80} width={80} />
        </div>
      ) : (
        <div className="relative bg-white shadow-lg p-6 w-full max-w-lg rounded-lg">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <FaWindowClose size={24} />
          </button>
          <h1 className="pb-4 text-2xl font-semibold text-center text-gray-800">
            Delete User ?
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
            <div className="text-gray-700 w-full text-center">
              <p className="p-2 text-lg">
                <span className="font-medium">Name:</span> {Name}
              </p>
              <p className="p-2 text-lg">
                <span className="font-medium">Email:</span> {Email}
              </p>
              <p className="p-2 text-lg">
                <span className="font-medium">Role:</span> {Role}
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="bg-red-400 text-black px-4 py-2 rounded-lg shadow hover:bg-red-600 hover:text-white transition duration-300"
                onClick={deleteUser}
              >
                Confirm
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow ml-4 hover:bg-gray-400 transition duration-300"
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
