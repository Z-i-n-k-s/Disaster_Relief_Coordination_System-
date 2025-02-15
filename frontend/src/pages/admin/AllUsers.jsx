import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { ThreeDots } from "react-loader-spinner";
import Context from "../../context";
import apiClient from "../../api/Api";
import UpdateUserInfo from "./UpdateUserInfo";
import DisplayUserDetails from "./DisplayUserDetails";
import DeleteUserDetails from "./DeleteUserDetails";

const AllUsers = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [allUser, setAllUsers] = useState([]);
  const [openUpdateUser, setOpenUpdateUser] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUserDetails, setOpenUserDetails] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    Email: "",
    Name: "",
    Role: "",
    _id: "",
    PhoneNo: "",
  });
  const [data, setData] = useState({
    email: "",
  });

  // New state for search term
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination and sorting states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterRole, setFilterRole] = useState("all"); // all, Admin, User, Volunteer
  const [sortOrder, setSortOrder] = useState("latest"); // latest or oldest

  const fetchAllusers = async () => {
    setShowLoader(true);
    const dataResponse = await apiClient.getAllUsers();
    if (dataResponse.success) {
      setAllUsers(dataResponse.data);
      setShowLoader(false);
    }
    if (dataResponse.error) {
      toast.error(dataResponse.message);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    fetchAllusers();
  }, []);

  // Combine role and search filtering
  const filteredUsers = allUser.filter((user) => {
    const roleMatches =
      filterRole === "all" ||
      user.Role.toLowerCase() === filterRole.toLowerCase();
    const searchMatches =
      searchTerm === "" ||
      user.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Email.toLowerCase().includes(searchTerm.toLowerCase());
    return roleMatches && searchMatches;
  });

  // Sort the filtered users by created_at
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Reset to first page when filter, sort, or search changes
  const handleFilterChange = (e) => {
    setFilterRole(e.target.value);
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
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Sorting, Filtering, and Search Controls */}
      <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex flex-col md:flex-row md:gap-4">
          <div className="mb-2 md:mb-0">
            <label
              htmlFor="roleFilter"
              className="mr-2 text-lg font-semibold text-gray-200"
            >
              Filter by Role:
            </label>
            <select
              id="roleFilter"
              value={filterRole}
              onChange={handleFilterChange}
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-md shadow-lg hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
              <option value="Volunteer">Volunteer</option>
            </select>
          </div>
          <div className="mb-2 md:mb-0 flex items-center">
            <label
              htmlFor="search"
              className="mr-2 text-lg font-semibold text-gray-200"
            >
              Search:
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-gray-800 text-white border border-gray-600 p-3 pr-10 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                placeholder="Search by name or email"
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
        </div>
        <div>
          <label
            htmlFor="sortOrder"
            className="mr-2 text-lg font-semibold text-gray-200"
          >
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

      {/* Users Table */}
      <div className="bg-gray-800 pb-4 rounded">
        <table className="w-full userTable border-collapse">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="px-4 py-2 text-center">Sr.</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone No</th>
              <th className="px-4 py-2 text-center">Role</th>
              <th className="px-4 py-2 text-center">Join Date</th>
              <th className="px-4 py-2 text-center">Action</th>
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
            ) : visibleUsers.length > 0 ? (
              visibleUsers.map((el, index) => (
                <tr key={el.UserID || index} className="hover:bg-gray-700">
                  <td className="px-4 py-2 text-center border-b border-gray-600">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-2 text-left border-b border-gray-600">
                    {el?.Name}
                  </td>
                  <td className="px-4 py-2 text-left border-b border-gray-600">
                    {el?.Email}
                  </td>
                  <td className="px-4 py-2 text-left border-b border-gray-600">
                    {el?.PhoneNo}
                  </td>
                  <td className="px-4 py-2 text-center border-b border-gray-600">
                    {el?.Role}
                  </td>
                  <td className="px-4 py-2 text-center border-b border-gray-600">
                    {moment(el?.created_at).format("LLL")}
                  </td>
                  <td className="px-4 py-2 text-center border-b border-gray-600">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-green-500 p-2 rounded-full hover:bg-green-700"
                        onClick={() => {
                          setUpdateUserDetails(el);
                          setOpenUpdateUser(true);
                        }}
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="bg-red-500 p-2 rounded-full hover:bg-red-700"
                        onClick={() => {
                          setUpdateUserDetails(el);
                          setOpenDelete(true);
                        }}
                      >
                        <MdDelete />
                      </button>
                      <button
                        className="bg-blue-500 p-2 rounded-full hover:bg-blue-700"
                        onClick={() => {
                          setUpdateUserDetails(el); // 'el' contains the full user object
                          setOpenUserDetails(true);
                        }}
                      >
                        <ImProfile />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No users found.
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

      {/* Modals */}
      {openUpdateUser && (
        <UpdateUserInfo
          onClose={() => setOpenUpdateUser(false)}
          user={updateUserDetails}
          callFunc={fetchAllusers}
        />
      )}
      {openUserDetails && (
        <DisplayUserDetails
          onClose={() => setOpenUserDetails(false)}
          user={updateUserDetails} // Passing the full user data
          callFunc={fetchAllusers}
        />
      )}
      {openDelete && (
          <DeleteUserDetails
          onClose={() => setOpenDelete(false)}
          user={updateUserDetails} // Passing the full user data
          callFunc={fetchAllusers}
        />
      )}
    </div>
  );
};

export default AllUsers;
