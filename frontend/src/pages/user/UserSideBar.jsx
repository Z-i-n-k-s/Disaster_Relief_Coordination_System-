import React from "react";
import { NavLink } from "react-router-dom";
import { FaUsers, FaBuilding, FaHandsHelping, FaClipboardList, FaChartBar, FaBars } from "react-icons/fa";
import { FaRightFromBracket, FaUserLarge } from "react-icons/fa6";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

const UserSideBar = ({ isOpen, setIsOpen, user }) => {
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
        {[
          { to: "/user-panel/request-aid", icon: <FaUsers />, label: "Request For Aid" },
          { to: "/user-panel/donate", icon: <FaBuilding />, label: "Donate" },
          { to: "/user-panel/all-aid-requests", icon: <FaHandsHelping />, label: "All Aid Requests" },
          { to: "/user-panel/all-donations", icon: <FaClipboardList />, label: "All Donations" }, 
          { to: "/user-panel/user-logout", icon: <FaRightFromBracket />, label: "LogOut" }
        ].map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            data-tooltip-id={!isOpen ? to : ""}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded transition-all hover:bg-yellow-500 hover:text-black ${
                isActive ? "bg-yellow-500 text-black" : "text-white"
              }`
            }
          >
            {icon}
            {isOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default UserSideBar;
