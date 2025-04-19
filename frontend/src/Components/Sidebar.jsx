import { ChevronFirst, ChevronLast, MoreVertical, User } from "lucide-react";
import { createContext, useContext, useState } from "react";

export const SidebarContext = createContext();

export default function Sidebar({ children, username, changeExpanded }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className="h-screen fixed">
      <nav
        className={`h-full flex flex-col bg-white border-r shadow-sm transition-all duration-300 ${
          expanded ? "w-64" : "w-16"
        }`}
      >
        {/* Header */}
        <div className="px-3 pt-2 pb-4 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`transition-all duration-300 overflow-hidden ${
              expanded ? "w-32" : "hidden"
            }`}
            alt="Logo"
          />
          <button
            onClick={() =>
              setExpanded((curr) => {
                changeExpanded(!curr);
                return !curr;
              })
            }
            className="p-2 rounded-full bg-gray-300 hover:bg-gray-200 transition"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Items */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        {/* Footer */}
        <div className="border-t flex p-3 items-center">
          <div className="bg-gray-200 p-2 rounded-full">
            <User />
          </div>
          <div
            className={`transition-all duration-300 overflow-hidden ${
              expanded ? "ml-3 w-52" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{username}</h4>
              <span className="text-xs text-gray-600">
                kaif.221459.it@mhssce.ac.in
              </span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert, onClick }) {
  const { expanded } = useContext(SidebarContext);
  return (
    <li
      onClick={onClick}
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-gradient-to-tr from-indigo-400 to-indigo-200 text-indigo-800"
          : "hover:bg-indigo-100 text-gray-600"
      }`}
    >
      {icon}
      <span
        className={`transition-all duration-700 whitespace-nowrap overflow-hidden ${
          expanded ? "ml-2" : "w-0"
        }`}
      >
        {text}
      </span>

      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded-full bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-0 -translate-x-3 transition-all duration-300 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
