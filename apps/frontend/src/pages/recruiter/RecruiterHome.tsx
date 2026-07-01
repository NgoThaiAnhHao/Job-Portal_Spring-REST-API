import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { TrendingUp, Users, Briefcase, XCircle, Eye, ChevronRight, Plus, MapPin, Clock } from "lucide-react";
import RecruiterNavbar from "../../components/navbar/RecruiterNavbar";
import { mockJobs, recruiterStats } from "../../data/mockData";

const statGradients = [
  "from-blue-500 to-blue-600",
  "from-violet-500 to-violet-600",
  "from-emerald-500 to-emerald-600",
  "from-slate-500 to-slate-600",
];
const statIcons = [Briefcase, Users, TrendingUp, XCircle];

const mockApplicants = [
  { id: "1", name: "Alex Nguyen", job: "Senior Frontend Engineer", date: "2024-06-29", status: "Interview" },
  { id: "2", name: "Linh Tran", job: "Senior Frontend Engineer", date: "2024-06-28", status: "Reviewed" },
  { id: "3", name: "Minh Pham", job: "Data Scientist", date: "2024-06-27", status: "Pending" },
  { id: "4", name: "Thu Nguyen", job: "UI/UX Designer", date: "2024-06-26", status: "Offered" },
  { id: "5", name: "Hoa Le", job: "Marketing Manager", date: "2024-06-25", status: "Rejected" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  Reviewed: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  Interview: "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400",
  Rejected: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  Offered: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
};

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

const stagger = (d = 0.08): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: d,
    },
  },
});

export default function RecruiterHome() {
  const [activeTab, setActiveTab] = useState<"all" | "open" | "closed">("all");

  const displayJobs = activeTab === "open" ? mockJobs.slice(0, 4)
    : activeTab === "closed" ? mockJobs.slice(4)
    : mockJobs;

  return (
    <div className="min-h-screen bg-background">
      <RecruiterNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <h1 className="text-2xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Recruiter Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">TechCorp Vietnam · Sarah Johnson</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" /> Post a New Job
          </motion.button>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={stagger(0.09)}
          initial="hidden"
          animate="show"
        >
          {recruiterStats.map((s, i) => {
            const Icon = statIcons[i];
            return (
              <motion.div
                key={s.label}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`bg-gradient-to-br ${statGradients[i]} rounded-2xl p-5 text-white cursor-default`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-5 h-5 text-white/70" />
                  <ChevronRight className="w-4 h-4 text-white/50" />
                </div>
                <div className="text-3xl font-extrabold mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
                <div className="text-sm font-semibold text-white/90">{s.label}</div>
                <div className="text-xs text-white/60 mt-0.5">{s.change}</div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Job postings */}
          <div className="lg:col-span-2" id="jobs">
            <motion.div
              className="flex items-center justify-between mb-5"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
            >
              <h2 className="text-xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                My Job Postings
              </h2>
              <div className="flex bg-muted rounded-xl p-1 gap-1">
                {(["all", "open", "closed"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                      activeTab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="space-y-3"
              variants={stagger(0.07)}
              initial="hidden"
              animate="show"
            >
              {displayJobs.map((job, idx) => {
                const isOpen = idx < 4;
                return (
                  <motion.div
                    key={job.id}
                    variants={fadeUp}
                    whileHover={{ y: -3, boxShadow: "0 12px 32px -8px rgba(0,0,0,0.07)" }}
                    className="bg-card border border-border rounded-2xl p-5 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm">
                          {job.companyLogo}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground group-hover:text-blue-600 transition-colors text-sm">{job.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <MapPin className="w-3 h-3" /> {job.location}
                            <Clock className="w-3 h-3 ml-1" /> {job.posted}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isOpen ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                          {isOpen ? "Open" : "Closed"}
                        </span>
                        <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">{job.salary}</span>
                      <span className="text-xs font-medium text-blue-600">{Math.floor(Math.random() * 30 + 5)} applicants</span>
                      <div className="flex flex-wrap gap-1 ml-auto">
                        {job.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right column */}
          <div id="applications" className="space-y-5">
            <motion.h2
              className="text-xl font-extrabold text-foreground"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Recent Applicants
            </motion.h2>

            <motion.div
              className="bg-card border border-border rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <div className="divide-y divide-border">
                {mockApplicants.map((app, i) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.4 }}
                    className="p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {app.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground text-sm truncate">{app.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{app.job}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-xs text-muted-foreground">{app.date}</span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColors[app.status] ?? ""}`}>{app.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Company profile */}
            <motion.div
              className="bg-card border border-border rounded-2xl p-5"
              id="company"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              <h3 className="font-bold text-foreground mb-4">Company Profile</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg">TC</div>
                <div>
                  <div className="font-bold text-foreground">TechCorp Vietnam</div>
                  <div className="text-xs text-muted-foreground">Software Engineering · Ho Chi Minh City</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[{ v: "500+", l: "Employees" }, { v: "2018", l: "Founded" }].map((s) => (
                  <div key={s.l} className="bg-muted/50 rounded-xl p-3 text-center">
                    <div className="text-xl font-extrabold text-blue-600">{s.v}</div>
                    <div className="text-xs text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2 border border-blue-200 dark:border-blue-800 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                Edit Profile
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
