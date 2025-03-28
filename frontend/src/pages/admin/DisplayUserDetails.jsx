import React from "react";

const DisplayUserDetails = ({ onClose, user }) => {
  if (!user) return null; // Prevent rendering if no user data

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-2xl text-white w-96 border border-gray-700">
        <h2 className="text-3xl font-bold mb-4 text-center text-yellow-600">User Details</h2>
        <div className="space-y-3">
          <p><span className="font-semibold text-gray-300">Name:</span> {user.Name}</p>
          <p><span className="font-semibold text-gray-300">Email:</span> {user.Email}</p>
          <p><span className="font-semibold text-gray-300">Role:</span> {user.Role}</p>
          <p><span className="font-semibold text-gray-300">Phone Number:</span> {user.PhoneNo}</p>
        </div>

        {user.Role.toLowerCase() === "user" && (
          <div className="mt-4 border-t border-gray-700 pt-3">
            <p><span className="font-semibold text-green-400">Donations Count:</span> {user.donationsCount}</p>
            <p><span className="font-semibold text-red-400">Aid Requests Count:</span> {user.aidRequestsCount}</p>
          </div>
        )}

        {user.Role.toLowerCase() === "manager" && user.managedCenters && (
          <div className="mt-4 border-t border-gray-700 pt-3">
            <p className="font-semibold text-blue-400">Managed Center(s):</p>
            <ul className="list-disc list-inside pl-3 text-gray-300">
              {user.managedCenters.map((center) => (
                <li key={center.CenterID}>{center.CenterName}</li>
              ))}
            </ul>
          </div>
        )}

        {user.Role.toLowerCase() === "volunteer" && user.assignedCenter && (
          <p className="mt-4 border-t border-gray-700 pt-3">
            <span className="font-semibold text-yellow-400">Assigned Center:</span> {user.assignedCenter.CenterName}
          </p>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="bg-yellow-600 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisplayUserDetails;
