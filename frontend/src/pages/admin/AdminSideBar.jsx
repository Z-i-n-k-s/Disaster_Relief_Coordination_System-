import React from "react";
import { NavLink } from "react-router-dom";
import { FaUsers, FaBuilding, FaHandsHelping, FaClipboardList, FaChartBar, FaBars } from "react-icons/fa";
import { FaUserLarge } from "react-icons/fa6";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

const AdminSideBar = ({ isOpen, setIsOpen, user }) => {
  return (
    <div
      className={`bg-black customShadow min-h-screen transition-all duration-300 ${
        isOpen ? "w-60" : "w-16"
      }`}
    >
      {/* Profile Section */}
      <div className="h-32 flex flex-col justify-center items-center p-4 border-b border-gray-700">
        <div className="text-5xl cursor-pointer relative">
          
            <FaUserLarge className="text-white" />
          
        </div>
        {isOpen && (
          <>
            <p className="capitalize text-lg font-bold text-white mt-2">
              {user?.Name}
            </p>
            <p className="text-sm text-white">{user?.Role}</p>
          </>
        )}
      </div>

      {/* Toggle Button */}
      <div className="h-16 flex items-center justify-center border-b border-gray-700">
        <button onClick={() => setIsOpen(!isOpen)} className="text-xl text-white">
          <FaBars />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 p-4">
        {/* All Users */}
        {!isOpen && (
          <Tooltip id="all-users" place="right" effect="solid">
            <span>All Users</span>
          </Tooltip>
        )}
        <NavLink
          to="all-users"
          data-tooltip-id={!isOpen ? "all-users" : ""}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded transition-all text-black hover:bg-yellow-500 hover:text-black ${
              isActive ? "bg-yellow-500 text-black" : ""
            }`
          }
        >
          <FaUsers className="text-xl" />
          {isOpen && <span>All Users</span>}
        </NavLink>

        {/* All Relief Centers */}
        {!isOpen && (
          <Tooltip id="all-relief-centers" place="right" effect="solid">
            <span>All Relief Centers</span>
          </Tooltip>
        )}
        <NavLink
          to="all-relief-centers"
          data-tooltip-id={!isOpen ? "all-relief-centers" : ""}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded transition-all text-white hover:bg-yellow-500 hover:text-black ${
              isActive ? "bg-yellow-500 text-black" : ""
            }`
          }
        >
          <FaBuilding className="text-xl" />
          {isOpen && <span>All Relief Centers</span>}
        </NavLink>

        {/* All Aid Requests */}
        {!isOpen && (
          <Tooltip id="all-aid-requests" place="right" effect="solid">
            <span>All Aid Requests</span>
          </Tooltip>
        )}
        <NavLink
          to="all-aid-requests"
          data-tooltip-id={!isOpen ? "all-aid-requests" : ""}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded transition-all text-white hover:bg-yellow-500 hover:text-black ${
              isActive ? "bg-yellow-500 text-black" : ""
            }`
          }
        >
          <FaHandsHelping className="text-xl" />
          {isOpen && <span>All Aid Requests</span>}
        </NavLink>

        {/* Aid Preparations */}
        {!isOpen && (
          <Tooltip id="aid-preparations" place="right" effect="solid">
            <span>Aid Preparations</span>
          </Tooltip>
        )}
        <NavLink
          to="aid-preparations"
          data-tooltip-id={!isOpen ? "aid-preparations" : ""}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded transition-all text-white hover:bg-yellow-500 hover:text-black ${
              isActive ? "bg-yellow-500 text-black" : ""
            }`
          }
        >
          <FaClipboardList className="text-xl" />
          {isOpen && <span>Aid Preparations</span>}
        </NavLink>

        {/* Aid Reports */}
        {!isOpen && (
          <Tooltip id="aid-reports" place="right" effect="solid">
            <span>Aid Reports</span>
          </Tooltip>
        )}
        <NavLink
          to="aid-reports"
          data-tooltip-id={!isOpen ? "aid-reports" : ""}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded transition-all text-white hover:bg-yellow-500 hover:text-black ${
              isActive ? "bg-yellow-500 text-black" : ""
            }`
          }
        >
          <FaChartBar className="text-xl" />
          {isOpen && <span>Aid Reports</span>}
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSideBar;
