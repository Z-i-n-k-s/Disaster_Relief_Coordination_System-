import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const AffectedAreas = () => {
  // Demo data for affected areas
  const demoData = [
    { AreaID: 1, AreaName: "Downtown", AreaType: "Flood", SeverityLevel: "High", Population: 1500 },
    { AreaID: 2, AreaName: "Uptown", AreaType: "Earthquake", SeverityLevel: "Medium", Population: 800 },
    { AreaID: 3, AreaName: "Midtown", AreaType: "Fire", SeverityLevel: "Low", Population: 1200 },
  ];

  const [areas, setAreas] = useState(demoData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openNewModal, setOpenNewModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => setFilterType(e.target.value);
  const handleSeverityFilterChange = (e) => setFilterSeverity(e.target.value);

  // Filter areas based on search term, Area Type, and Severity Level
  const filteredAreas = areas.filter((area) => {
    const matchesSearch = area.AreaName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || area.AreaType === filterType;
    const matchesSeverity = filterSeverity === "all" || area.SeverityLevel === filterSeverity;
    return matchesSearch && matchesType && matchesSeverity;
  });

  const handleEdit = (area) => {
    setSelectedArea(area);
    setOpenEditModal(true);
  };

  const handleDelete = (area) => {
    setSelectedArea(area);
    setOpenDeleteModal(true);
  };

  const handleNewArea = () => {
    setSelectedArea({ AreaName: "", AreaType: "Flood", SeverityLevel: "Low", Population: "" });
    setOpenNewModal(true);
  };

  // Save new or edited area
  const saveArea = () => {
    if (selectedArea.AreaID) {
      // Edit existing area
      setAreas((prev) =>
        prev.map((area) => (area.AreaID === selectedArea.AreaID ? selectedArea : area))
      );
    } else {
      // Add new area with simulated auto-increment AreaID
      const newArea = {
        ...selectedArea,
        AreaID: areas.length ? areas[areas.length - 1].AreaID + 1 : 1,
      };
      setAreas((prev) => [...prev, newArea]);
    }
    setOpenEditModal(false);
    setOpenNewModal(false);
    setSelectedArea(null);
  };

  // Confirm deletion of area
  const confirmDelete = () => {
    setAreas((prev) => prev.filter((area) => area.AreaID !== selectedArea.AreaID));
    setOpenDeleteModal(false);
    setSelectedArea(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header with New Area Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-yellow-500">Affected Areas</h1>
        <button 
          onClick={handleNewArea}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
        >
          New Area
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex flex-col md:flex-row md:gap-4">
          <div className="flex items-center">
            <label htmlFor="filterType" className="mr-2 text-lg font-semibold text-gray-200">
              Filter by Area Type:
            </label>
            <select
              id="filterType"
              value={filterType}
              onChange={handleFilterChange}
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-md shadow-lg hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All</option>
              <option value="Flood">Flood</option>
              <option value="Earthquake">Earthquake</option>
              <option value="Fire">Fire</option>
            </select>
          </div>
          <div className="flex items-center">
            <label htmlFor="filterSeverity" className="mr-2 text-lg font-semibold text-gray-200">
              Filter by Severity:
            </label>
            <select
              id="filterSeverity"
              value={filterSeverity}
              onChange={handleSeverityFilterChange}
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-md shadow-lg hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
        <div className="flex items-center">
          <label htmlFor="search" className="mr-2 text-lg font-semibold text-gray-200">
            Search:
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-gray-800 text-white border border-gray-600 p-3 pr-10 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
              placeholder="Search by Area Name"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 18a8 8 0 100-16 8 8 0 000 16zm7 0l4 4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Areas Table */}
      <div className="bg-gray-800 pb-4 rounded">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="px-4 py-2 text-center">Sr.</th>
              <th className="px-4 py-2 text-left">Area Name</th>
              <th className="px-4 py-2 text-left">Area Type</th>
              <th className="px-4 py-2 text-left">Severity Level</th>
              <th className="px-4 py-2 text-left">Population</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAreas.length > 0 ? (
              filteredAreas.map((area, index) => (
                <tr key={area.AreaID} className="hover:bg-gray-700">
                  <td className="px-4 py-2 text-center border-b border-gray-600">{index + 1}</td>
                  <td className="px-4 py-2 text-left border-b border-gray-600">{area.AreaName}</td>
                  <td className="px-4 py-2 text-left border-b border-gray-600">{area.AreaType}</td>
                  <td className="px-4 py-2 text-left border-b border-gray-600">{area.SeverityLevel}</td>
                  <td className="px-4 py-2 text-left border-b border-gray-600">{area.Population}</td>
                  <td className="px-4 py-2 text-center border-b border-gray-600">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-green-500 text-white p-2 rounded-full transition-transform duration-200 transform hover:scale-110"
                        onClick={() => handleEdit(area)}
                      >
                       
                        <FiEdit />
                      </button>
                      <button
                        className="bg-red-500 p-2 rounded-full hover:bg-red-700"
                        onClick={() => handleDelete(area)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No areas found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/New Area Modal */}
      {(openEditModal || openNewModal) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4 text-yellow-500">
              {selectedArea && selectedArea.AreaID ? "Edit Area" : "New Area"}
            </h2>
            <div className="mb-4">
              <label className="block text-yellow-500 mb-1">Area Name:</label>
              <input
                type="text"
                value={selectedArea?.AreaName || ""}
                onChange={(e) =>
                  setSelectedArea({ ...selectedArea, AreaName: e.target.value })
                }
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-yellow-500 mb-1">Area Type:</label>
              <select
                value={selectedArea?.AreaType || "Flood"}
                onChange={(e) =>
                  setSelectedArea({ ...selectedArea, AreaType: e.target.value })
                }
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              >
                <option value="Flood">Flood</option>
                <option value="Earthquake">Earthquake</option>
                <option value="Fire">Fire</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-yellow-500 mb-1">Severity Level:</label>
              <select
                value={selectedArea?.SeverityLevel || "Low"}
                onChange={(e) =>
                  setSelectedArea({ ...selectedArea, SeverityLevel: e.target.value })
                }
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-yellow-500 mb-1">Population:</label>
              <input
                type="number"
                value={selectedArea?.Population || ""}
                onChange={(e) =>
                  setSelectedArea({ ...selectedArea, Population: e.target.value })
                }
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setOpenEditModal(false);
                  setOpenNewModal(false);
                  setSelectedArea(null);
                }}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveArea}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {openDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4 text-yellow-500">Delete Area</h2>
            <p className="mb-4">
              Are you sure you want to delete the area:{" "}
              <span className="font-bold">{selectedArea?.AreaName}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setOpenDeleteModal(false);
                  setSelectedArea(null);
                }}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffectedAreas;