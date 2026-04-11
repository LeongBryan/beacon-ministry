import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  CalendarDays,
  User,
  Megaphone,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import logo from "@/assets/logo.jpeg";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Home" },
  { to: "/files", icon: FolderOpen, label: "Ministry Files" },
  { to: "/roster", icon: CalendarDays, label: "Serving Roster" },
  { to: "/my-schedule", icon: User, label: "My Schedule" },
  { to: "/announcements", icon: Megaphone, label: "Announcements" },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar text-sidebar-foreground transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
            <img src={logo} alt="BCC Logo" className="w-12 h-12 rounded-lg object-cover" />
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-sidebar-foreground leading-tight truncate">
                Bethesda CC
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Internal Hub</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto md:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <item.icon size={22} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User area */}
          <div className="px-4 py-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-semibold text-sm">
                ST
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Sarah Tan</p>
                <p className="text-xs text-sidebar-foreground/50">Ministry Leader</p>
              </div>
              <button className="text-sidebar-foreground/40 hover:text-sidebar-foreground">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-background border-b border-border md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-muted text-foreground"
          >
            <Menu size={22} />
          </button>
          <img src={logo} alt="BCC" className="w-8 h-8 rounded-md object-cover" />
          <span className="font-semibold text-foreground">Bethesda CC Hub</span>
        </div>

        <div className="p-6 md:p-8 max-w-6xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
