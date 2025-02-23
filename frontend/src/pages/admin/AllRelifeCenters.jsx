import React, { useEffect, useState } from "react";
import apiClient from "../../api/Api";
import { toast } from "react-toastify";
import moment from "moment";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const AllReliefCenters = () => {
  const [centers, setCenters] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("latest"); // "latest" or "oldest"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // For inline expansion of details (volunteers/donations/resources)
  const [expandedCenter, setExpandedCenter] = useState(null);
  const [expandedSection, setExpandedSection] = useState("");
  const navigate = useNavigate();

  // For adding a new relief center
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCenterData, setNewCenterData] = useState({
    CenterName: "",
    Location: "",
    NumberOfVolunteersWorking: "",
    MaxVolunteersCapacity: "",
    ManagerID: "",
  });

  const [managers, setManagers] = useState([]);

  // Modify fetchAllusers to only get managers
  const fetchAllusers = async () => {
    setShowLoader(true);
    try {
      const dataResponse = await apiClient.getAllUsers();
      if (dataResponse.success) {
        // Filter users to only get Managers
        const managerUsers = dataResponse.data.filter(
          (user) => user.Role === "Manager"
        );
        setManagers(managerUsers);
      }
      setShowLoader(false);
    } catch (error) {
      toast.error("Error fetching managers");
      setShowLoader(false);
    }
  };

  const fetchAllReliefCenters = async () => {
    setShowLoader(true);
    try {
      const dataResponse = await apiClient.getAllReliefCenters();
      console.log("res relife ", dataResponse);
      // If the response is an array, use it directly.
      if (Array.isArray(dataResponse)) {
        setCenters(dataResponse);
      } else if (dataResponse.success) {
        setCenters(dataResponse.data);
      } else if (dataResponse.error) {
        toast.error(dataResponse.message);
      }
    } catch (error) {
      toast.error("An error occurred while fetching data.");
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    fetchAllReliefCenters();
    fetchAllusers();
  }, []);

  // Filter centers by search term (checks CenterName and Location)
  const filteredCenters = centers.filter((center) => {
    return (
      searchTerm === "" ||
      center.CenterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.Location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAddCenterSubmit = async (e) => {
    // Update your existing handleAddCenterSubmit function with this improved version

    e.preventDefault();
    try {
      // Convert numeric fields to numbers
      const formattedData = {
        ...newCenterData,
        NumberOfVolunteersWorking: Number(
          newCenterData.NumberOfVolunteersWorking
        ),
        MaxVolunteersCapacity: Number(newCenterData.MaxVolunteersCapacity),
        ManagerID: Number(newCenterData.ManagerID),
      };

      // Call the API service
      const response = await apiClient.createReliefCenter(formattedData);

      if (response) {
        toast.success("Relief center created successfully!");
        // Reset form and refresh data
        setShowAddModal(false);
        setNewCenterData({
          CenterName: "",
          Location: "",
          NumberOfVolunteersWorking: "",
          MaxVolunteersCapacity: "",
          ManagerID: "",
        });
        // Refresh the centers list
        await fetchAllReliefCenters();
      } else {
        toast.error(response.message || "Failed to create relief center");
      }
    } catch (error) {
      // Handle API errors
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create relief center. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Sort centers by created_at date
  const sortedCenters = [...filteredCenters].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedCenters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleCenters = sortedCenters.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Toggle the expanded row for a given center and section
  const toggleExpand = (centerId, section) => {
    if (expandedCenter === centerId && expandedSection === section) {
      setExpandedCenter(null);
      setExpandedSection("");
    } else {
      setExpandedCenter(centerId);
      setExpandedSection(section);
    }
  };

  // Render the expanded row based on the selected section
  const renderExpandedRow = (center) => {
    let content;
    if (expandedSection === "volunteers") {
      content =
        center.volunteers && center.volunteers.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Contact Info</th>
                <th className="px-2 py-1 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {center.volunteers.map((vol) => (
                <tr key={vol.VolunteerID} className="border-b border-gray-600">
                  <td className="px-2 py-1">{vol.Name}</td>
                  <td className="px-2 py-1">{vol.ContactInfo}</td>
                  <td className="px-2 py-1">{vol.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-2">No volunteers found.</p>
        );
    } else if (expandedSection === "donations") {
      content =
        center.donations && center.donations.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-2 py-1 text-left">Donor Name</th>
                <th className="px-2 py-1 text-left">Type</th>
                <th className="px-2 py-1 text-left">Quantity</th>
                <th className="px-2 py-1 text-left">Date Received</th>
              </tr>
            </thead>
            <tbody>
              {center.donations.map((don) => (
                <tr key={don.DonationID} className="border-b border-gray-600">
                  <td className="px-2 py-1">{don.DonorName}</td>
                  <td className="px-2 py-1">{don.DonationType}</td>
                  <td className="px-2 py-1">{don.Quantity}</td>
                  <td className="px-2 py-1">
                    {moment(don.DateReceived).format("LLL")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-2">No donations found.</p>
        );
    } else if (expandedSection === "resources") {
      content =
        center.resources && center.resources.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-2 py-1 text-left">Type</th>
                <th className="px-2 py-1 text-left">Quantity</th>
                <th className="px-2 py-1 text-left">Expiration Date</th>
              </tr>
            </thead>
            <tbody>
              {center.resources.map((res) => (
                <tr key={res.ResourceID} className="border-b border-gray-600">
                  <td className="px-2 py-1">{res.ResourceType}</td>
                  <td className="px-2 py-1">{res.Quantity}</td>
                  <td className="px-2 py-1">
                    {moment(res.ExpirationDate).format("LLL")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-2">No resources found.</p>
        );
    }

    return (
      <tr className="bg-gray-800">
        <td colSpan="7" className="p-4 border-t border-gray-600">
          {content}
        </td>
      </tr>
    );
  };

  // Handle changes for the add center form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCenterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Relief Centers</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Add New Relief Center
        </button>
      </div>

      {/* Search & Sort Controls */}
      <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex items-center mb-2 md:mb-0">
          <label htmlFor="search" className="mr-2 text-lg font-semibold">
            Search:
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-gray-800 text-white border border-gray-600 p-3 pr-10 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
              placeholder="Search by center name or location"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-3 top-3 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="20"
              height="20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm7 0l4 4"
              />
            </svg>
          </div>
        </div>
        <div>
          <label htmlFor="sortOrder" className="mr-2 text-lg font-semibold">
            Sort by Date:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={handleSortOrderChange}
            className="bg-gray-800 text-white border border-gray-600 p-2 rounded-md shadow-lg hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Relief Centers Table */}
      <div className="bg-gray-800 pb-4 rounded">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="px-4 py-2 text-center">Sr.</th>
              <th className="px-4 py-2 text-left">Center Name</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-center">Volunteers Working</th>
              <th className="px-4 py-2 text-center">Max Capacity</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {showLoader ? (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  <div className="flex justify-center items-center">
                    <ThreeDots color="#7542ff" height={80} width={80} />
                  </div>
                </td>
              </tr>
            ) : visibleCenters.length > 0 ? (
              visibleCenters.map((center, index) => (
                <React.Fragment key={center.CenterID || index}>
                  <tr className="hover:bg-gray-700">
                    <td className="px-4 py-2 text-center border-b border-gray-600">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 py-2 text-left border-b border-gray-600">
                      {center.CenterName}
                    </td>
                    <td className="px-4 py-2 text-left border-b border-gray-600">
                      {center.Location}
                    </td>
                    <td className="px-4 py-2 text-center border-b border-gray-600">
                      {center.NumberOfVolunteersWorking}
                    </td>
                    <td className="px-4 py-2 text-center border-b border-gray-600">
                      {center.MaxVolunteersCapacity}
                    </td>
                    <td className="px-4 py-2 text-center border-b border-gray-600">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 mr-1 rounded"
                        onClick={() =>
                          toggleExpand(center.CenterID, "volunteers")
                        }
                      >
                        Volunteers
                      </button>
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 mr-1 rounded"
                        onClick={() =>
                          toggleExpand(center.CenterID, "donations")
                        }
                      >
                        Donations
                      </button>
                      <button
                        className="bg-purple-500 hover:bg-purple-700 text-white px-2 py-1 rounded"
                        onClick={() =>
                          toggleExpand(center.CenterID, "resources")
                        }
                      >
                        Resources
                      </button>
                    </td>
                  </tr>
                  {expandedCenter === center.CenterID &&
                    renderExpandedRow(center)}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No relief centers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center items-center space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Add Relief Center Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 rounded-lg shadow-lg w-11/12 md:w-1/2 p-6">
            <h3 className="text-xl font-semibold mb-4">
              Add New Relief Center
            </h3>
            <form onSubmit={handleAddCenterSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Center Name
                </label>
                <input
                  type="text"
                  name="CenterName"
                  value={newCenterData.CenterName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="Location"
                  value={newCenterData.Location}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Volunteers Working
                  </label>
                  <input
                    type="number"
                    name="NumberOfVolunteersWorking"
                    value={newCenterData.NumberOfVolunteersWorking}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    name="MaxVolunteersCapacity"
                    value={newCenterData.MaxVolunteersCapacity}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
                  />
                </div>
              </div>
              {/* Replace Manager ID input with dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Select Manager
                </label>
                <select
                  name="ManagerID"
                  value={newCenterData.ManagerID}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
                >
                  <option value="">Select a Manager</option>
                  {managers.map((manager) => (
                    <option key={manager.UserID} value={manager.UserID}>
                      {manager.Name} ({manager.Email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                >
                  Add Center
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllReliefCenters;
