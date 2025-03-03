import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

import VolunteerSideBar from "./VolunteerSideBar";


const VolunteerPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (user?.Role !== "Volunteer") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-[calc(100vh-120px)] flex">
      <VolunteerSideBar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        user={user}
      />
      <main className="flex-grow border-l transition-all">
        <Outlet />
      </main>
    </div>
  );
};

export default VolunteerPanel;
