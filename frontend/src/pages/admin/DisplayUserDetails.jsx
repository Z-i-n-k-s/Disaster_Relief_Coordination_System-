import React from "react";

const DisplayUserDetails = ({ onClose, user, callFunc }) => {




  console.log("user id ",user);
  if (!user) return null; // Prevent rendering if no user data

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded shadow-lg text-white w-96">
        <h2 className="text-2xl mb-4">User Details</h2>
        <p>
          <strong>Name:</strong> {user.Name}
        </p>
        <p>
          <strong>Email:</strong> {user.Email}
        </p>
        <p>
          <strong>Role:</strong> {user.Role}
        </p>
        <p>
          <strong>Phone Number:</strong> {user.PhoneNo}
        </p>

        {/* For Users: Show donations and aid requests */}
        {user.Role.toLowerCase() === "user" && (
          <>
            <p>
              <strong>Donations Count:</strong> {user.donationsCount}
            </p>
            <p>
              <strong>Aid Requests Count:</strong> {user.aidRequestsCount}
            </p>
          </>
        )}

        {/* For Managers: List managed centers */}
        {user.Role.toLowerCase() === "manager" && user.managedCenters && (
          <div>
            <p>
              <strong>Managed Center(s):</strong>
            </p>
            <ul className="list-disc list-inside">
              {user.managedCenters.map((center) => (
                <li key={center.CenterID}>{center.CenterName}</li>
              ))}
            </ul>
          </div>
        )}

        {/* For Volunteers: Show assigned center */}
        {user.Role.toLowerCase() === "volunteer" && user.assignedCenter && (
          <p>
            <strong>Assigned Center:</strong> {user.assignedCenter.CenterName}
          </p>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisplayUserDetails;
