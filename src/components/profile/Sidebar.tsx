import { NavLink } from "react-router-dom";

const items = [
  { to: "/my-profile/personal-info", label: "Personal info" },
  { to: "/my-profile/documents", label: "Documents" },
  { to: "/my-profile/change-password", label: "Change password" },
];

 function Sidebar({ active }: { active: string; }) {
  return (
    <aside className="w-56 min-h-full border-r border-gray-200 bg-[#FAF6F1] py-12 px-4">
      <nav className="space-y-3">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block py-2 pl-2 rounded text-lg font-medium ${
                isActive ? "text-red-600" : "text-gray-600 hover:text-black"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
export default Sidebar;