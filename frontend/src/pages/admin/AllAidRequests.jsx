import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../../api/Api';
import { ThreeDots } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const ITEMS_PER_PAGE = 10;
const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed']; // Updated valid statuses
const REQUEST_TYPE_OPTIONS = ['all', 'Rescue', 'Aid']; // adjust as needed
const URGENCY_OPTIONS = ['all', 'Low', 'Medium', 'High'];

const AllAidRequests = () => {
  const user = useSelector((state) => state?.user?.user);
  const [aidRequests, setAidRequests] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  
  // Filter & Search state
  const [reqTypeFilter, setReqTypeFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all aid requests from the backend
  const fetchAllAidRequest = useCallback(async () => {
    if (!user?.UserID) return;
    setShowLoader(true);
    try {
      const dataResponse = await apiClient.getAllAidRequest();
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
    fetchAllAidRequest();
  }, [fetchAllAidRequest]);

  // Handle inline status update per row
  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      // Call backend update function (assuming it returns the updated request)
      const updatedRequest = await apiClient.updateAidRequestStatus(requestId, newStatus);
      if (updatedRequest) {
        setAidRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.RequestID === requestId ? { ...req, Status: newStatus } : req
          )
        );
        toast.success("Status updated successfully.");
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      toast.error("Error updating status.");
      console.error("Status update error:", error);
    }
  };

  // Filter and search aid requests
  const filteredRequests = aidRequests.filter((req) => {
    const matchesReqType = reqTypeFilter === 'all' || req.RequestType === reqTypeFilter;
    const matchesUrgency = urgencyFilter === 'all' || req.UrgencyLevel === urgencyFilter;
    const matchesStatus = statusFilter === 'all' || req.Status === statusFilter;
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      req.Description.toLowerCase().includes(lowerSearch) ||
      req.RequesterName.toLowerCase().includes(lowerSearch);
    return matchesReqType && matchesUrgency && matchesStatus && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentRequests = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

  // Handler for page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [reqTypeFilter, urgencyFilter, statusFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4 text-yellow-500">All Aid Requests</h1>
      
      {/* Filter & Search Controls */}
      <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Request Type Filter */}
          <div className="flex items-center">
            <label htmlFor="reqTypeFilter" className="mr-2 font-semibold">
              Request Type:
            </label>
            <select
              id="reqTypeFilter"
              value={reqTypeFilter}
              onChange={(e) => setReqTypeFilter(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded"
            >
              {REQUEST_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          {/* Urgency Filter */}
          <div className="flex items-center">
            <label htmlFor="urgencyFilter" className="mr-2 font-semibold">
              Urgency Level:
            </label>
            <select
              id="urgencyFilter"
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded"
            >
              {URGENCY_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          {/* Status Filter */}
          <div className="flex items-center">
            <label htmlFor="statusFilter" className="mr-2 font-semibold">
              Status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded"
            >
              <option value="all">all</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Search Box */}
        <div className="flex items-center">
          <label htmlFor="search" className="mr-2 font-semibold">
            Search:
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 p-2 rounded"
            placeholder="Search by description or name"
          />
        </div>
      </div>

      {/* Aid Requests Table */}
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
            ) : currentRequests.length > 0 ? (
              currentRequests.map((request, index) => (
                <tr key={request.RequestID} className="hover:bg-gray-700">
                  <td className="px-4 py-2 text-center border-b border-gray-600">
                    {index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}
                  </td>
                  <td className="px-4 py-2 text-left border-b border-gray-600 whitespace-nowrap">
                    {request.RequesterName}
                  </td>
                  <td className="px-4 py-2 text-left border-b border-gray-600 whitespace-nowrap">
                    {request.ContactInfo}
                  </td>
                  <td className="px-4 py-2 text-left border-b border-gray-600 whitespace-nowrap">
                    {request.RequestType}
                  </td>
                  <td className="px-4 py-2 text-left border-b border-gray-600">
                    {request.Description}
                  </td>
                  <td className="px-4 py-2 text-center border-b border-gray-600 whitespace-nowrap">
                    {request.UrgencyLevel}
                  </td>
                  <td className="px-4 py-2 text-center border-b border-gray-600 whitespace-nowrap">
                    <select
                      value={request.Status}
                      onChange={(e) =>
                        handleStatusUpdate(request.RequestID, e.target.value)
                      }
                      className="bg-gray-700 text-white border border-gray-600 p-1 rounded"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  No aid requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page ? 'bg-yellow-500 text-black' : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllAidRequests;
