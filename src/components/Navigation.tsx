import { NavLink } from "react-router-dom";
import { BarChart2, Calendar, Sun } from "lucide-react";

const navItems = [
  { to: "/", label: "Today", icon: Sun },
  { to: "/progress", label: "Progress", icon: BarChart2 },
  { to: "/journey", label: "Journey", icon: Calendar },
];

export function Navigation() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-cream/95 backdrop-blur-md px-4 py-2 safe-area-bottom"
      aria-label="Main navigation"
    >
      <div className="max-w-lg mx-auto flex justify-around">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link-active" : "nav-link-inactive"}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-cream" : "text-olive"}`}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
