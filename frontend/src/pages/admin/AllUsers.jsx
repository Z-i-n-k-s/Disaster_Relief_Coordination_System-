import React, { useEffect, useState } from "react";
import apiClient from "../../api/Api";
import { toast } from "react-toastify";
import moment from "moment";
import { ThreeDots } from "react-loader-spinner";

const AllReliefCenters = () => {
  const [centers, setCenters] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("latest"); // "latest" or "oldest"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAllReliefCenters = async () => {
    setShowLoader(true);
    try {
      const dataResponse = await apiClient.getAllReliefCenters();
      if (dataResponse.success) {
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
  }, []);

  // Filter centers by search term (CenterName and Location)
  const filteredCenters = centers.filter((center) => {
    return (
      searchTerm === "" ||
      center.CenterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.Location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort centers by created_at date (even though it's not displayed)
  const sortedCenters = [...filteredCenters].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedCenters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleCenters = sortedCenters.slice(startIndex, startIndex + itemsPerPage);

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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-semibold mb-4">Relief Centers</h2>

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
            </tr>
          </thead>
          <tbody>
            {showLoader ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  <div className="flex justify-center items-center">
                    <ThreeDots color="#7542ff" height={80} width={80} />
                  </div>
                </td>
              </tr>
            ) : visibleCenters.length > 0 ? (
              visibleCenters.map((center, index) => (
                <tr key={center.CenterID || index} className="hover:bg-gray-700">
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
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
    </div>
  );
};

export default AllReliefCenters;
