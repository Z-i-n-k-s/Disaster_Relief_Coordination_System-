import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../../api/Api';
import { ThreeDots } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const UserAidRequests = () => {
  const user = useSelector((state) => state?.user?.user);
  const [aidRequests, setAidRequests] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  // Using useCallback so the function is memoized and added as dependency to useEffect.
  const fetchUsersAidRequest = useCallback(async () => {
    if (!user?.UserID) return;
    setShowLoader(true);
    try {
      const dataResponse = await apiClient.getUsersAidRequest(user.UserID);
      if (dataResponse) {
        setAidRequests(dataResponse);
      } else {
        toast.error(dataResponse?.message || 'No data received.');
      }
    } catch (error) {
      toast.error("Error fetching aid requests");
      console.error("Error:", error);
    } finally {
      setShowLoader(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsersAidRequest();
  }, [fetchUsersAidRequest]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4 text-yellow-500">User Aid Requests</h1>

      <div className="bg-gray-800 rounded overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="px-4 py-2 text-center">Sr.</th>
              <th className="px-4 py-2 text-left">Requester Name</th>
              <th className="px-4 py-2 text-left">Contact Info</th>
              <th className="px-4 py-2 text-left">Request Type</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-center">Urgency Level</th>
              <th className="px-4 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {showLoader ? (
              <tr>
                <td colSpan="7" className="p-4">
                  <div className="flex justify-center items-center">
                    <ThreeDots color="#7542ff" height={80} width={80} />
                  </div>
                </td>
              </tr>
            ) : aidRequests.length > 0 ? (
              aidRequests.map((request, index) => (
                <tr key={request.RequestID} className="hover:bg-gray-700">
                  <td className="px-4 py-2 text-center border-b border-gray-600">{index + 1}</td>
                  <td className="px-4 py-2 text-left border-b border-gray-600 whitespace-nowrap">{request.RequesterName}</td>
                  <td className="px-4 py-2 text-left border-b border-gray-600 whitespace-nowrap">{request.ContactInfo}</td>
                  <td className="px-4 py-2 text-left border-b border-gray-600 whitespace-nowrap">{request.RequestType}</td>
                  <td className="px-4 py-2 text-left border-b border-gray-600">{request.Description}</td>
                  <td className="px-4 py-2 text-center border-b border-gray-600 whitespace-nowrap">{request.UrgencyLevel}</td>
                  <td className="px-4 py-2 text-center border-b border-gray-600 whitespace-nowrap">{request.Status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center">No aid requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAidRequests;
