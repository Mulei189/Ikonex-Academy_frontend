import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menuItems = [
    { path: "/", label: "Dashboard" },
    { path: "/class-streams", label: "Class Streams" },
    { path: "/students", label: "Students" },
    { path: "/subjects", label: "Subjects" },
    { path: "/assessments", label: "Assessments" },
    { path: "/results", label: "Results" },
    { path: "/reports", label: "Reports" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>IKONEX ACADEMY</h2>
      </div>

      <nav>
        <ul className="menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "menu-link active-link"
                    : "menu-link"
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}