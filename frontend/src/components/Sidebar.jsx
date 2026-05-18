import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextInstance";
import chtLogo from "../assets/cht-logo.png";

export default function Sidebar({ role }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Bookings", path: "/admin/bookings", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
    { name: "Tour Packages", path: "/admin/tour-packages", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { name: "Customers", path: "/admin/clients", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { name: "User Roles", path: "/admin/employees", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  ];

  const userItems = [
    { name: "Dashboard", path: "/user/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "New Booking", path: "/bookings/step/1", icon: "M12 4v16m8-8H4" },
    { name: "Customers", path: "/user/clients", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { name: "Tour Packages", path: "/user/tour-packages", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { name: "Trips", path: "/user/trips", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" },
    { name: "Hotels", path: "/user/hotels", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" },
    { name: "Transportation", path: "/user/transportation", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
    { name: "Payments", path: "/user/payments", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  const items = role === "admin" ? adminItems : userItems;

  return (
    <aside className="cv-sidebar flex flex-col font-['Arimo-Regular',Helvetica] overflow-hidden select-none">
      <div className="border-[#e2e8f0] border-b border-solid shrink-0 w-full px-[41px] py-[8px]">
        <div className="h-[73px] w-[162px] relative flex items-center justify-center">
          <img 
            src={chtLogo} 
            alt="CHT Travel Logo" 
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
          />
        </div>
      </div>

      <nav className="flex-1 w-full flex flex-col gap-[4px] pt-[16px] px-[16px] overflow-y-auto no-scrollbar">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center w-full gap-[12px] h-[48px] pl-[16px] rounded-[8px] transition-all duration-300 group ${
                isActive 
                  ? "bg-[#007bff] text-white shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]" 
                  : "text-[#64748b] hover:bg-slate-100/50 hover:text-[#1e293b]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <svg
                  className={`w-[20px] h-[20px] fill-none stroke-current transition-colors shrink-0 ${
                    isActive ? "text-white stroke-[2]" : "text-[#64748b] stroke-[2] group-hover:text-[#1e293b]"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className={`text-[16px] leading-[24px] whitespace-nowrap transition-colors ${
                  isActive ? "text-white font-medium" : "text-[#64748b] group-hover:text-[#1e293b]"
                }`}>
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-[#e2e8f0] border-solid border-t h-[81px] shrink-0 w-full pt-[17px] px-[16px] mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-[12px] h-[48px] pl-[16px] transition-all duration-300 group hover:bg-red-50 text-[#64748b] hover:text-red-500 rounded-[8px]"
        >
          <svg className="w-[20px] h-[20px] fill-none stroke-current stroke-[2] shrink-0 transition-colors" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-[16px] leading-[24px] whitespace-nowrap transition-colors">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
