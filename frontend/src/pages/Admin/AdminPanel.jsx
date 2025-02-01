import { Outlet } from "react-router-dom";
import Sidebar, { SidebarProvider } from "../Sidebar/AdminSidebar";

const AdminPanel = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-5 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;
