import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Briefcase, Bell, Menu, X, LayoutDashboard, FileText, PlusCircle, Users, Building2, LogOut, ChevronDown } from "lucide-react";
import {logout} from "../../services/auth";

const navLinks = [
  { label: "Dashboard", to: "/recruiter/home", icon: LayoutDashboard },
  { label: "My Jobs", to: "/recruiter/home#jobs", icon: FileText },
  { label: "Create Job", to: "/recruiter/home#create", icon: PlusCircle },
  { label: "Applications", to: "/recruiter/home#applications", icon: Users },
  { label: "Company Profile", to: "/recruiter/home#company", icon: Building2 },
];

export default function RecruiterNavbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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


  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/recruiter/home" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-600" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              JobPortal
            </span>
            <span className="hidden sm:inline ml-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
              Recruiter
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.to}
                className="px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
                <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">SJ</div>
                <span className="text-sm font-medium">Sarah Johnson</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-xl shadow-lg py-1 z-50">
                  <a href="/recruiter/home#company" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <Building2 className="w-4 h-4" /> Company Profile
                  </a>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white dark:bg-slate-900 px-4 py-3 space-y-1">
          {navLinks.map((l) => (
            <a key={l.label} href={l.to} onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted">
              <l.icon className="w-4 h-4" /> {l.label}
            </a>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 border-t border-border mt-2 pt-3">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
