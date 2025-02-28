import React, { useEffect, useState, useCallback } from "react";
import apiClient from "../../api/Api";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ITEMS_PER_PAGE = 10;
const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];
const REQUEST_TYPE_OPTIONS = ["all", "Rescue", "Aid"];
const URGENCY_OPTIONS = ["all", "Low", "Medium", "High"];

const AllAidRequests = () => {
  const user = useSelector((state) => state?.user?.user);
  const [aidRequests, setAidRequests] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  // Filter & search state
  const [reqTypeFilter, setReqTypeFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // State for volunteers, modal display, selected request, and prep volunteers
  const [allVolunteers, setAllVolunteers] = useState([]);
  const [showVolunteersModal, setShowVolunteersModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  // Stores objects: { VolunteerID, PreparationID } for volunteers already asked
  const [prepVolunteers, setPrepVolunteers] = useState([]);

  // Fetch all aid requests
  const fetchAllAidRequest = useCallback(async () => {
    if (!user?.UserID) return;
    setShowLoader(true);
    try {
      const dataResponse = await apiClient.getAllAidRequest();
      if (dataResponse) {
        setAidRequests(dataResponse);
      } else {
        toast.error(dataResponse?.message || "No data received.");
      }
    } catch (error) {
      toast.error("Error fetching aid requests");
      console.error("Error:", error);
    } finally {
      setShowLoader(false);
    }
  }, [user]);

  // Modified createAidPrep function that accepts RequestID, Status, and VolunteerID
  const createAidPrep = useCallback(
    async (requestId, status, volunteerId) => {
      if (!user?.UserID) return;
      setShowLoader(true);
      try {
        const payload = { RequestID: requestId, Status: status };
        if (volunteerId) {
          payload.VolunteerID = volunteerId;
        }
        const dataResponse = await apiClient.createAidPrep(payload);
        if (dataResponse && dataResponse.success) {
          return dataResponse.data; // Expected to contain PreparationID
        } else {
          toast.error(dataResponse?.message || "No data received.");
        }
      } catch (error) {
        toast.error("Error creating aid prep");
        console.error("Error:", error);
      } finally {
        setShowLoader(false);
      }
    },
    [user]
  );

  // Function to ask a specific volunteer to prep
  const addVolunteersToAidPrep = useCallback(
    async (requestId, status, volunteerId) => {
      if (!user?.UserID) return;
      setShowLoader(true);
      try {
        const aidPrepData = await createAidPrep(requestId, status, volunteerId);
        if (aidPrepData && aidPrepData.PreparationID) {
          const dataResponse = await apiClient.createAidPrepVolunteer(
            aidPrepData.PreparationID,
            volunteerId
          );
          if (dataResponse && dataResponse.success) {
            // Add the volunteer to prepVolunteers so that his button changes to "Asked"
            setPrepVolunteers((prev) => [
              ...prev,
              {
                VolunteerID: volunteerId,
                PreparationID: aidPrepData.PreparationID,
              },
            ]);
            toast.success("Aid prep created successfully.");
          }
        }
      } catch (error) {
        toast.error("Error creating aid prep for volunteer");
        console.error("Error:", error);
      } finally {
        setShowLoader(false);
      }
    },
    [user, createAidPrep]
  );

  // Fetch volunteers already asked for aid prep for a specific request
  const fetchAllAidPrepVolunteers = useCallback(
    async (requestId) => {
      if (!user?.UserID) return;
      setShowLoader(true);
      try {
        // Call the API method with the specific RequestID
        const dataResponse = await apiClient.getAidPrepVolunteer(requestId);
        if (dataResponse && dataResponse.success) {
          setPrepVolunteers(dataResponse.data);
        } else {
          toast.error(dataResponse?.message || "No data received.");
        }
      } catch (error) {
        toast.error("Error fetching aid prep volunteers");
        console.error("Error:", error);
      } finally {
        setShowLoader(false);
      }
    },
    [user]
  );

  // Fetch all volunteers (complete list)
  const fetchAllVolunteers = useCallback(async () => {
    if (!user?.UserID) return;
    setShowLoader(true);
    try {
      const dataResponse = await apiClient.getAllVolunteers();
      if (dataResponse && dataResponse.success) {
        setAllVolunteers(dataResponse.data);
      } else {
        toast.error(dataResponse?.message || "No data received.");
      }
    } catch (error) {
      toast.error("Error fetching volunteers");
      console.error("Error:", error);
    } finally {
      setShowLoader(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAllAidRequest();
    fetchAllVolunteers();
  }, [fetchAllAidRequest, fetchAllVolunteers]);

  // Handle inline status update (now used only to update to "In Progress")
  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const updatedRequest = await apiClient.updateAidRequestStatus(
        requestId,
        newStatus
      );
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
    const matchesReqType =
      reqTypeFilter === "all" || req.RequestType === reqTypeFilter;
    const matchesUrgency =
      urgencyFilter === "all" || req.UrgencyLevel === urgencyFilter;
    const matchesStatus = statusFilter === "all" || req.Status === statusFilter;
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
  const currentRequests = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [reqTypeFilter, urgencyFilter, statusFilter, searchTerm]);

  // When "Ask Volunteers" is clicked, store the selected request and fetch already asked volunteers
  const handleShowVolunteers = (request) => {
    setSelectedRequest(request);
    fetchAllAidPrepVolunteers(request.RequestID);
    setShowVolunteersModal(true);
  };

  // Handler for asking a specific volunteer to prep using their VolunteerID
  const handleAskToMakePrepForVolunteer = async (volunteerId) => {
    if (!selectedRequest) {
      toast.error("No selected request.");
      return;
    }
    await addVolunteersToAidPrep(
      selectedRequest.RequestID,
      selectedRequest.Status,
      volunteerId
    );
    // If the request's status is still "Pending", update it to "In Progress"
    if (selectedRequest.Status === "Pending") {
      await handleStatusUpdate(selectedRequest.RequestID, "In Progress");
      setSelectedRequest((prev) => ({ ...prev, Status: "In Progress" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4 text-yellow-500">
        All Aid Requests
      </h1>

      {/* Filter & Search Controls */}
      <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex flex-col md:flex-row gap-4">
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
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
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
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
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
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
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
              <th className="px-4 py-2 text-center">Prep Aid</th>
            </tr>
          </thead>
          <tbody>
            {showLoader ? (
              <tr>
                <td colSpan="8" className="p-4">
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
                  {/* Status column now shows text only */}
                  <td className="px-4 py-2 text-center border-b border-gray-600 whitespace-nowrap">
                    {request.Status}
                  </td>
                  <td className="px-4 py-2 text-center border-b border-gray-600">
                    <button
                      onClick={() => handleShowVolunteers(request)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Ask Volunteers
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center">
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
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal to display all volunteers with individual "Ask to Make Prep" buttons */}
      {showVolunteersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded p-6 w-11/12 max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Volunteers</h2>
            <div className="max-h-80 overflow-y-auto">
              {allVolunteers.length > 0 ? (
                allVolunteers.map((volunteer) => {
                  // Compare IDs as numbers for proper matching
                  const isAsked = prepVolunteers.some(
                    (item) =>
                      Number(item.VolunteerID) ===
                      Number(volunteer.VolunteerID)
                  );
                  return (
                    <div
                      key={volunteer.VolunteerID}
                      className="mb-2 border-b border-gray-600 pb-2 flex items-center justify-between"
                    >
                      <div>
                        <span>Name:&nbsp;</span>
                        <span className="font-semibold mr-2">
                          {volunteer.Name}
                        </span>
                        <span className="ml-2">&nbsp;Center:&nbsp;</span>
                        <span className="mr-2">
                          {volunteer.reliefCenter?.CenterName || "N/A"}
                        </span>
                      </div>
                      {isAsked ? (
                        <button
                          disabled
                          className="bg-gray-600 text-white px-3 py-1 rounded cursor-not-allowed"
                        >
                          Asked
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleAskToMakePrepForVolunteer(
                              volunteer.VolunteerID
                            )
                          }
                          className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Ask to Make Prep
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>No volunteers found.</p>
              )}
            </div>
            <button
              onClick={() => setShowVolunteersModal(false)}
              className="mt-4 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAidRequests;
