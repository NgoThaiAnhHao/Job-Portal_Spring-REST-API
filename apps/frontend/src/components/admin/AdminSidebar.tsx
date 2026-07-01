import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Briefcase, LayoutDashboard, Users, FileText, BarChart3, Shield,
  LogOut, Menu, X, Bell, ChevronRight
} from "lucide-react";
import {logout} from "../../services/auth";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { label: "User Management", icon: Users, id: "users" },
  { label: "Job Management", icon: FileText, id: "jobs" },
  { label: "Reports", icon: BarChart3, id: "reports" },
  { label: "Audit Logs", icon: Shield, id: "audit" },
];

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {

    try {

      await logout();

    } catch (e) {

      console.error(e);

    } finally {

      localStorage.removeItem(
          "accessToken"
      );

      localStorage.removeItem(
          "refreshToken"
      );

      localStorage.removeItem(
          "role"
      );

      navigate("/login");
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-sidebar-border ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-bold text-base leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>JobPortal</div>
            <div className="text-blue-300 text-xs font-medium">Admin Panel</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === item.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            AU
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold truncate">Admin User</div>
              <div className="text-blue-300 text-xs truncate">admin@jobportal.com</div>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors text-sm font-medium ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-sidebar transition-all duration-300 ${collapsed ? "w-16" : "w-64"} flex-shrink-0 h-screen sticky top-0`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-blue-700 transition-colors z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <X className="w-3 h-3" />}
        </button>
        <SidebarContent />
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden flex items-center justify-between bg-sidebar px-4 h-14 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>JobPortal</span>
          <span className="text-xs text-blue-300 font-medium">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-sidebar-foreground hover:text-white">
            <Bell className="w-5 h-5" />
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-sidebar-foreground hover:text-white">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full bg-sidebar">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
