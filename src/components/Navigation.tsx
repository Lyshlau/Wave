import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Today", icon: TodayIcon },
  { to: "/progress", label: "Progress", icon: ProgressIcon },
  { to: "/journey", label: "Journey", icon: JourneyIcon },
];

export function Navigation() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-cream/95 backdrop-blur-md border-t border-sand/60 px-4 py-2 safe-area-bottom"
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
                <Icon active={isActive} />
                <span className="text-xs font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function TodayIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-6 h-6 ${active ? "text-cream" : "text-olive"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function ProgressIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-6 h-6 ${active ? "text-cream" : "text-olive"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function JourneyIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-6 h-6 ${active ? "text-cream" : "text-olive"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}
