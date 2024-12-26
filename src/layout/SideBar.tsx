import { Link, useLocation, useNavigate } from "react-router-dom";
import { getSidebarOptions } from "../util/getSidebarOptions";
import BillBizz from "../assets/logo/BillBizzLogo.png";
import { sidebarRoutes, sidebarIcons } from "../types/rolePermissions";
import DashboardIcon from "../assets/icons/DashboardIcon";
import Settings from "../assets/icons/Settings";
import { useUser } from "../context/UserContext";

const Sidebar: React.FC = () => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user?.role) {
    return <div>Please log in to access the sidebar.</div>;
  }

  const sidebarOptions = getSidebarOptions(user?.role);

  const isActiveRoute = (route: string) => location.pathname.startsWith(route);

  
  
  

  return (
    <aside className="sidebar bg-primary min-h-screen overflow-y-auto hide-scrollbar w-[13%] pb-2">
      <div className="flex p-5 items-center gap-3">
        <img src={BillBizz} alt="billbizz logo" className="w-6" />
        <h1 className="text-secondary">NEX PORTAL</h1>
      </div>

      <Link to="/dashboard">
        <div className="mt-4 pl-4">
          <div
            className={`w-[180px] px-3 py-2 rounded-3xl items-center flex gap-3 ${
              isActiveRoute('/dashboard') ? 'bg-[#5A0000]' : ''
            }`}
          >
            <DashboardIcon />
            <h3 className="text-secondary text-sm font-medium">Dashboard</h3>
          </div>
        </div>
      </Link>

      {Object.entries(sidebarOptions).map(([category, options]) =>
        options.length > 0 ? (
          <div key={category} className="sidebar-category pl-7">
            <h3 className="text-[#d8cab6] text-xs mb-2 mt-3 cursor-default">
              {category}
            </h3>
            <ul>
              {options.map((option) => {
                const Icon = sidebarIcons[option];
                const route = sidebarRoutes[option];
                return (
                  <li
                    key={option}
                    onClick={() => navigate(route)}
                    className={`text-secondary text-sm my-2 cursor-pointer -ml-3 w-[180px] font-medium px-3 py-2 rounded-3xl items-center flex ${
                      isActiveRoute(route) ? 'bg-[#5A0000]' : ''
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <Icon />
                      <p>{option}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null
      )}

      <Link to="/settings">
        <div
          className={`w-[180px] px-3 py-2 rounded-3xl ml-4 items-center flex gap-3 ${
            isActiveRoute('/settings') ? 'bg-[#5A0000]' : ''
          }`}
        >
          <Settings />
          <h3 className="text-secondary text-sm font-medium">Settings</h3>
        </div>
      </Link>
    </aside>
  );
};

export default Sidebar;
