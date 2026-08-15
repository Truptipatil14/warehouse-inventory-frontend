import {
  FaTachometerAlt,
  FaBoxes,
  FaTruck,
  FaTags,
  FaExchangeAlt,
  FaChartBar,
  FaBook,
  FaSignOutAlt,
  FaWarehouse,
  FaChevronRight,
  FaUserShield,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Products",
      path: "/products",
      icon: <FaBoxes />,
    },
    {
      name: "Categories",
      path: "/categories",
      icon: <FaTags />,
    },
    {
      name: "Suppliers",
      path: "/suppliers",
      icon: <FaTruck />,
    },
    {
      name: "Stock Movement",
      path: "/stock-movement",
      icon: <FaExchangeAlt />,
    },
    {
      name: "Stock Ledger",
      path: "/stock-ledger",
      icon: <FaBook />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <FaChartBar />,
    },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl">

      {/* ================= LOGO ================= */}

      <div className="border-b border-slate-800 px-6 py-6">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-blue-600/30">
            <FaWarehouse className="text-xl text-white" />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-wide">
              Warehouse
            </h1>

            <p className="text-xs text-slate-400">
              Management System
            </p>
          </div>

        </div>

      </div>

      {/* ================= MENU ================= */}

      <nav className="flex-1 overflow-y-auto px-4 py-6">

        <p className="mb-3 px-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          Main Menu
        </p>

        <div className="space-y-2">

          {menuItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3.5 transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >

              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white" />
                  )}

                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-all ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-cyan-400"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span className="flex-1 text-sm font-semibold">
                    {item.name}
                  </span>

                  <FaChevronRight
                    className={`text-xs transition-transform duration-200 ${
                      isActive
                        ? "translate-x-0 text-white"
                        : "-translate-x-1 text-slate-600 group-hover:translate-x-0 group-hover:text-slate-300"
                    }`}
                  />
                </>
              )}

            </NavLink>

          ))}

        </div>

      </nav>

      {/* ================= BOTTOM PANEL ================= */}

      <div className="border-t border-slate-800 bg-slate-950/80 p-4">

        {/* ================= ADMIN PANEL ================= */}

        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `mb-3 block rounded-2xl border transition-all duration-300 ${
              isActive
                ? "border-cyan-500/50 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 shadow-lg shadow-cyan-500/10"
                : "border-slate-800 bg-gradient-to-br from-slate-800/80 to-slate-900 hover:border-slate-700 hover:bg-slate-800"
            }`
          }
        >

          {({ isActive }) => (
            <div className="flex items-center gap-3 p-4">

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-blue-600/20 ${
                  isActive ? "ring-2 ring-cyan-400/40" : ""
                }`}
              >
                <FaUserShield />
              </div>

              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-bold text-white">
                  Admin Panel
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-400">
                  Inventory Administrator
                </p>

              </div>

              <FaChevronRight
                className={`text-xs transition-transform ${
                  isActive
                    ? "translate-x-0 text-cyan-400"
                    : "-translate-x-1 text-slate-600 group-hover:translate-x-0"
                }`}
              />

            </div>
          )}

        </NavLink>

        {/* ================= LOGOUT ================= */}

        <button
          type="button"
          onClick={logout}
          className="group flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-slate-400 transition-all duration-300 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20"
        >

          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 transition-all group-hover:bg-white/15">
            <FaSignOutAlt />
          </span>

          <span className="font-semibold">
            Logout
          </span>

          <FaChevronRight className="ml-auto text-xs opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;