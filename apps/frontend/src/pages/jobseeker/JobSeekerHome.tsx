import { useState } from "react";
import { motion, Variants } from "framer-motion";import { Search, MapPin, Bookmark, BookmarkCheck, ArrowRight, Clock, Lightbulb } from "lucide-react";
import JobSeekerNavbar from "../../components/navbar/JobSeekerNavbar";
import { mockJobs, mockApplications, careerTips } from "../../data/mockData";

const statusColors: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  Reviewed: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  Interview: "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400",
  Rejected: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  Offered: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
};

const typeColors: Record<string, string> = {
  "Full-time": "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "Remote": "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Part-time": "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Contract": "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "Internship": "bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const stagger = (d = 0.08): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: d
    }
  }
});

export default function JobSeekerHome() {
  const [savedJobs, setSavedJobs] = useState<string[]>(["2"]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSave = (id: string) =>
    setSavedJobs((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const filteredJobs = mockJobs.filter((j) =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const savedJobsList = mockJobs.filter((j) => savedJobs.includes(j.id));

  return (
    <div className="min-h-screen bg-background">
      <JobSeekerNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome banner */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-7 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Welcome back 👋</p>
            <h1 className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Good morning, Alex!
            </h1>
            <p className="text-blue-100 text-sm">
              You have <span className="font-bold text-white">3 active applications</span> and{" "}
              <span className="font-bold text-white">1 interview scheduled</span>.
            </p>
          </div>
          <div className="flex-shrink-0 bg-white/10 backdrop-blur rounded-2xl p-4 text-white text-center min-w-[110px]">
            <div className="text-3xl font-extrabold">78%</div>
            <div className="text-xs text-blue-200 mt-1">Profile complete</div>
            <div className="mt-2 w-full bg-white/20 rounded-full h-1.5">
              <motion.div
                className="bg-white h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "78%" }}
                transition={{ delay: 0.4, duration: 0.9, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left — recommended + applications */}
          <div className="lg:col-span-2 space-y-8">
            <section id="jobs">
              <motion.div
                className="flex items-center justify-between mb-5"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.45 }}
              >
                <h2 className="text-xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Recommended Jobs
                </h2>
                <button className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-700">
                  See all <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>

              <motion.div
                className="relative mb-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search jobs or companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </motion.div>

              <motion.div
                className="space-y-3"
                variants={stagger(0.07)}
                initial="hidden"
                animate="show"
              >
                {filteredJobs.slice(0, 4).map((job) => (
                  <motion.div
                    key={job.id}
                    variants={fadeUp}
                    whileHover={{ y: -3, boxShadow: "0 12px 32px -8px rgba(37,99,235,0.1)" }}
                    className="bg-card border border-border rounded-2xl p-5 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                        {job.companyLogo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-foreground group-hover:text-blue-600 transition-colors text-sm">{job.title}</h3>
                            <p className="text-muted-foreground text-xs">{job.company}</p>
                          </div>
                          <motion.button
                            onClick={() => toggleSave(job.id)}
                            whileTap={{ scale: 0.85 }}
                            className="text-muted-foreground hover:text-blue-600 transition-colors flex-shrink-0"
                          >
                            {savedJobs.includes(job.id)
                              ? <BookmarkCheck className="w-4 h-4 text-blue-600" />
                              : <Bookmark className="w-4 h-4" />}
                          </motion.button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" /> {job.location}
                          </div>
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{job.salary}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[job.type] ?? ""}`}>{job.type}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {job.tags.map((tag) => (
                            <span key={tag} className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {job.posted}</span>
                      <motion.button
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Apply Now
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* Applications table */}
            <section id="applications">
              <motion.h2
                className="text-xl font-extrabold text-foreground mb-5"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                My Applications
              </motion.h2>
              <motion.div
                className="bg-card border border-border rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Job</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Applied</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockApplications.map((app, i) => (
                      <motion.tr
                        key={app.id}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07, duration: 0.4 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="font-semibold text-foreground text-sm">{app.jobTitle}</div>
                          <div className="text-xs text-muted-foreground">{app.company}</div>
                        </td>
                        <td className="px-5 py-4 text-xs text-muted-foreground hidden sm:table-cell">{app.appliedDate}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[app.status] ?? ""}`}>{app.status}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Saved Jobs */}
            <section id="saved">
              <motion.h2
                className="text-lg font-extrabold text-foreground mb-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Saved Jobs
              </motion.h2>
              <motion.div
                className="space-y-3"
                variants={stagger(0.08)}
                initial="hidden"
                animate="show"
              >
                {savedJobsList.length === 0 ? (
                  <motion.div variants={fadeUp} className="bg-card border border-border rounded-2xl p-6 text-center text-muted-foreground text-sm">
                    No saved jobs yet. Bookmark jobs to view them here.
                  </motion.div>
                ) : savedJobsList.map((job) => (
                  <motion.div
                    key={job.id}
                    variants={fadeUp}
                    whileHover={{ y: -2 }}
                    className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs">
                        {job.companyLogo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground text-sm truncate">{job.title}</div>
                        <div className="text-xs text-muted-foreground">{job.company} · {job.location}</div>
                      </div>
                      <motion.button onClick={() => toggleSave(job.id)} whileTap={{ scale: 0.85 }} className="text-blue-600 hover:text-muted-foreground flex-shrink-0">
                        <BookmarkCheck className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* Career Tips */}
            <section>
              <motion.h2
                className="text-lg font-extrabold text-foreground mb-4 flex items-center gap-2"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <Lightbulb className="w-5 h-5 text-amber-500" /> Career Tips
              </motion.h2>
              <motion.div
                className="space-y-3"
                variants={stagger(0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {careerTips.map((tip) => (
                  <motion.div
                    key={tip.title}
                    variants={fadeUp}
                    whileHover={{ y: -2 }}
                    className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5">
                        {tip.tag}
                      </span>
                      <div>
                        <div className="font-semibold text-foreground text-sm mb-1">{tip.title}</div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
