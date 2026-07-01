import { useState } from "react";
import { motion, Variants } from "framer-motion";

import {
  TrendingUp, TrendingDown, Users, FileText, Briefcase, ClipboardList,
  Search, Filter, MoreHorizontal, CheckCircle, XCircle, AlertCircle, Eye
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { adminStats, mockJobs, mockUsers } from "../../data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const chartData = [
  { month: "Jan", jobs: 820, users: 4200, apps: 9800 },
  { month: "Feb", jobs: 932, users: 4800, apps: 11200 },
  { month: "Mar", jobs: 1100, users: 5600, apps: 13400 },
  { month: "Apr", jobs: 980, users: 5200, apps: 12100 },
  { month: "May", jobs: 1240, users: 6400, apps: 15600 },
  { month: "Jun", jobs: 1380, users: 7200, apps: 18200 },
];

const auditLogs = [
  { id: "1", action: "User registered", user: "nguyenvana@gmail.com", time: "2 minutes ago", type: "info" },
  { id: "2", action: "Job posted", user: "hr@techcorp.com", time: "15 minutes ago", type: "success" },
  { id: "3", action: "Job deleted", user: "admin@jobportal.com", time: "1 hour ago", type: "warning" },
  { id: "4", action: "Failed login attempt", user: "unknown@test.com", time: "2 hours ago", type: "error" },
  { id: "5", action: "Recruiter approved", user: "admin@jobportal.com", time: "3 hours ago", type: "success" },
];

const auditIcons: Record<string, React.ReactNode> = {
  info: <AlertCircle className="w-4 h-4 text-blue-500" />,
  success: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  warning: <AlertCircle className="w-4 h-4 text-amber-500" />,
  error: <XCircle className="w-4 h-4 text-red-500" />,
};

const statIcons = [Users, Users, Briefcase, ClipboardList];

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const stagger = (d = 0.09): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: d,
    },
  },
});

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userSearch, setUserSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");

  const filteredUsers = mockUsers.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredJobs = mockJobs.filter((j) =>
    j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
    j.company.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stat cards */}
            <motion.div
              className="grid grid-cols-2 xl:grid-cols-4 gap-4"
              variants={stagger(0.08)}
              initial="hidden"
              animate="show"
            >
              {adminStats.map((s, i) => {
                const Icon = statIcons[i];
                const isUp = s.change.startsWith("+");
                return (
                  <motion.div
                    key={s.label}
                    variants={fadeUp}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="bg-card border border-border rounded-2xl p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-bold flex items-center gap-0.5 ${isUp ? "text-emerald-600" : "text-red-500"}`}>
                        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {s.change}
                      </span>
                    </div>
                    <div className="text-2xl font-extrabold text-foreground mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Charts */}
            <motion.div
              className="grid lg:grid-cols-2 gap-6"
              variants={stagger(0.1)}
              initial="hidden"
              animate="show"
            >
              {[
                {
                  title: "Jobs Posted per Month",
                  chart: (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="jobs" fill="#2563eb" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ),
                },
                {
                  title: "User Growth",
                  chart: (
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="apps" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ),
                },
              ].map((c) => (
                <motion.div key={c.title} variants={fadeUp} className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-bold text-foreground mb-5">{c.title}</h3>
                  {c.chart}
                </motion.div>
              ))}
            </motion.div>

            {/* Audit log */}
            <motion.div
              className="bg-card border border-border rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h3 className="font-bold text-foreground mb-5">Recent Activity</h3>
              <div className="space-y-3">
                {auditLogs.map((log, i) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.06, duration: 0.4 }}
                    className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl hover:bg-muted/60 transition-colors"
                  >
                    {auditIcons[log.type]}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-foreground">{log.action}</span>
                      <span className="text-sm text-muted-foreground ml-2">by {log.user}</span>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{log.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case "users":
        return (
          <div className="space-y-5">
            <motion.div
              className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>User Management</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" placeholder="Search users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring w-full" />
                </div>
                <button className="p-2 border border-border rounded-xl hover:bg-muted"><Filter className="w-4 h-4" /></button>
              </div>
            </motion.div>
            <motion.div
              className="bg-card border border-border rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Email</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{user.avatar}</div>
                          <span className="font-semibold text-foreground">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{user.email}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          user.role === "ADMIN" ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          : user.role === "RECRUITER" ? "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400"
                          : "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                        }`}>{user.role}</span>
                      </td>
                      <td className="px-5 py-4">
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground"><MoreHorizontal className="w-4 h-4" /></button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        );

      case "jobs":
        return (
          <div className="space-y-5">
            <motion.div
              className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Job Management</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Search jobs..." value={jobSearch} onChange={(e) => setJobSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </motion.div>
            <motion.div
              className="bg-card border border-border rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Job Title</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Company</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Category</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredJobs.map((job, i) => (
                    <motion.tr
                      key={job.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-foreground">{job.title}</div>
                        <div className="text-xs text-muted-foreground">{job.location}</div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{job.company}</td>
                      <td className="px-5 py-4 hidden lg:table-cell"><span className="text-xs text-muted-foreground">{job.category}</span></td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full">{job.type}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1">
                          <button className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4" /></button>
                          <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-muted-foreground hover:text-red-600"><XCircle className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        );

      case "reports":
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Reports & Analytics</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-foreground mb-5">Applications per Month</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="apps" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-foreground mb-5">Platform Growth</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2.5} name="Users" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="jobs" stroke="#10b981" strokeWidth={2.5} name="Jobs" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        );

      case "audit":
        return (
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Audit Logs</h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">User</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[...auditLogs, ...auditLogs].map((log, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.35 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-5 py-4 font-medium text-foreground">{log.action}</td>
                      <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{log.user}</td>
                      <td className="px-5 py-4">{auditIcons[log.type]}</td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">{log.time}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <motion.div
          key={activeTab}
          className="max-w-6xl mx-auto px-4 sm:px-6 py-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
}
