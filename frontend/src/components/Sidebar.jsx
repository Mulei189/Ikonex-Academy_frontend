
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>IKONEX ACADEMY</h2>

      <nav>
        <ul>
          <li><NavLink
                to="/"
                className={({ isActive }) =>
                    isActive ? "active-link" : ""
                }
                >
                Dasboard
                </NavLink>
          </li>
          <li><NavLink
                to="/class-streams"
                className={({ isActive }) =>
                    isActive ? "active-link" : ""
                }
                >
                Streams
                </NavLink>
          </li>
          <li><NavLink
                    to="/students"
                    className={({ isActive }) =>
                        isActive ? "active-link" : ""
                    }
                >   
                Students
                </NavLink>
          </li>
          <li><NavLink
                    to="/subjects"
                    className={({ isActive }) =>
                        isActive ? "active-link" : ""
                    }
                >   
                Subjects
                </NavLink>
          </li>
          <li><NavLink
                    to="/assessments"
                    className={({ isActive }) =>
                        isActive ? "active-link" : ""
                    }
                >   
                Assessments
                </NavLink>
          </li>
          <li><NavLink
                    to="/results"
                    className={({ isActive }) =>
                        isActive ? "active-link" : ""
                    }
                >   
                Results
                </NavLink>
          </li>
          <li><NavLink
                    to="/reports"
                    className={({ isActive }) =>
                        isActive ? "active-link" : ""
                    }
                >   
                Reports
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}