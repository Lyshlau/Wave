import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";

export function Layout() {
  return (
    <div className="min-h-screen bg-cream">
      <main className="max-w-lg mx-auto px-5 pt-8 pb-28">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}
