import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { ThreeDots } from "react-loader-spinner";
import apiClient from "../../api/Api";

const UserDonations = () => {
  // States for donation data and loader
  const [donations, setDonations] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  // States for filtering, sorting, and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDonationType, setFilterDonationType] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch donations from the backend
  const fetchUsersDonations = async () => {
    setShowLoader(true);
    try {
      const dataResponse = await apiClient.getUsersDonations();
      if (dataResponse.success) {
        setDonations(dataResponse.data);
      } else {
        toast.error(dataResponse.message);
      }
    } catch (error) {
      toast.error("Error fetching donations");
      console.error("Error:", error);
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    fetchUsersDonations();
  }, []);

  // Filtering: donation type and search by date received
  const filteredDonations = donations.filter((donation) => {
    const typeMatches =
      filterDonationType === "all" ||
      donation.DonationType.toLowerCase() === filterDonationType.toLowerCase();
    const searchMatches =
      searchTerm === "" ||
      moment(donation.DateReceived)
        .format("YYYY-MM-DD")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return typeMatches && searchMatches;
  });

  // Sorting by DateReceived (latest or oldest)
  const sortedDonations = [...filteredDonations].sort((a, b) => {
    const dateA = new Date(a.DateReceived);
    const dateB = new Date(b.DateReceived);
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedDonations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleDonations = sortedDonations.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Reset to first page when filters change
  const handleDonationTypeChange = (e) => {
    setFilterDonationType(e.target.value);
    setCurrentPage(1);
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
    <div className="min-h-screen bg-black text-white p-4">
       <div>
        <h1 className="text-4xl font-bold text-yellow-600 mt-5 pb-10">All Donations</h1>
      </div>
      {/* Filters, Sorting, and Search Controls */}
      <div className="mb-4 space-y-4">
        {/* First Row: Filter and Search */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Filter by Donation Type */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label htmlFor="donationTypeFilter" className="text-lg font-semibold text-white">
              Filter by Donation Type:
            </label>
            <select
              id="donationTypeFilter"
              value={filterDonationType}
              onChange={handleDonationTypeChange}
              className="bg-black text-white border border-white p-2 rounded-md shadow-lg hover:border-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All</option>
              <option value="Food">Food</option>
              <option value="Clothes">Clothes</option>
              <option value="Money">Money</option>
              <option value="Water">Water</option>
            </select>
          </div>
          {/* Search by Date Received */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label htmlFor="search" className="text-lg font-semibold text-white">
              Search by Date (YYYY-MM-DD):
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-black text-white border border-white p-3 pr-10 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-64"
                placeholder="e.g., 2023-08-15"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-3 top-3 text-white"
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
        </div>
        {/* Second Row: Sort by Date */}
        <div className="flex items-center gap-2">
          <label htmlFor="sortOrder" className="text-lg font-semibold text-white">
            Sort by Date:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={handleSortOrderChange}
            className="bg-black text-white border border-white p-2 rounded-md shadow-lg hover:border-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
  
      {/* Donations Table */}
    
      <div className="bg-black pb-4 rounded border border-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black text-white">
              <th className="px-4 py-2 text-center border border-white">Sr.</th>
              <th className="px-4 py-2 text-left border border-white">Donor Name</th>
              <th className="px-4 py-2 text-left border border-white">Donation Type</th>
              <th className="px-4 py-2 text-center border border-white">Quantity</th>
              <th className="px-4 py-2 text-center border border-white">Date Received</th>
              <th className="px-4 py-2 text-center border border-white">Associated Center</th>
            </tr>
          </thead>
          <tbody>
            {showLoader ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  <div className="flex justify-center items-center">
                    <ThreeDots color="#7542ff" height={80} width={80} />
                  </div>
                </td>
              </tr>
            ) : visibleDonations.length > 0 ? (
              visibleDonations.map((donation, index) => (
                <tr key={donation.DonationID} className="hover:bg-black transition duration-200">
                  <td className="px-4 py-2 text-center border-b border-white">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-2 text-left border-b border-white">
                    {donation.DonorName}
                  </td>
                  <td className="px-4 py-2 text-left border-b border-white">
                    {donation.DonationType}
                  </td>
                  <td className="px-4 py-2 text-center border-b border-white">
                    {donation.Quantity}
                  </td>
                  <td className="px-4 py-2 text-center border-b border-white">
                    {moment(donation.DateReceived).format("LLL")}
                  </td>
                  <td className="px-4 py-2 text-center border-b border-white">
                    {donation.AssociatedCenter}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No donations found.
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
          className="bg-black border border-white hover:bg-black text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-black border border-white hover:bg-black text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
  

};

export default UserDonations;
