import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, CalendarCheck, BookOpen, MessageSquare, Brain,
  Users, BarChart3, LogOut, GraduationCap
} from "lucide-react";

const staffLinks = [
  { to: "/staff", label: "Dashboard", icon: LayoutDashboard },
  { to: "/staff/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/staff/progress", label: "Academic Progress", icon: BookOpen },
  { to: "/staff/messages", label: "Messages", icon: MessageSquare },
  { to: "/staff/insights", label: "AI Insights", icon: Brain },
];

const hodLinks = [
  { to: "/hod", label: "Dashboard", icon: LayoutDashboard },
  { to: "/hod/staff", label: "Staff Management", icon: Users },
  { to: "/hod/attendance", label: "Attendance Monitor", icon: CalendarCheck },
  { to: "/hod/progress", label: "Academic Progress", icon: BookOpen },
  { to: "/hod/communication", label: "Communication", icon: MessageSquare },
  { to: "/hod/analytics", label: "Analytics & AI", icon: BarChart3 },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const links = user?.role === "ROLE_HOD" ? hodLinks : staffLinks;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col shrink-0">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-sidebar-foreground">SmartPortal</h1>
              <p className="text-[11px] text-sidebar-foreground/60">
                {user?.role === "ROLE_HOD" ? "HOD Admin" : "Staff Portal"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-medium text-sidebar-foreground/90 truncate">{user?.name}</p>
            <p className="text-[11px] text-sidebar-foreground/50 truncate">{user?.department}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
