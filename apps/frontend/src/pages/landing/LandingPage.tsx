import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, Variants, useInView } from "framer-motion";
import {
  Search, MapPin, ArrowRight, Star, CheckCircle, Zap, TrendingUp,
  Twitter, Linkedin, Github, Mail, Phone, Globe,
  Code2, Database, Palette, Megaphone, DollarSign, Users
} from "lucide-react";
import GuestNavbar from "../../components/navbar/GuestNavbar";
import { mockJobs, categories } from "../../data/mockData";

const categoryIcons: Record<string, React.ReactNode> = {
  "Software Engineering": <Code2 className="w-6 h-6" />,
  "Data Science": <Database className="w-6 h-6" />,
  "UI/UX Design": <Palette className="w-6 h-6" />,
  "Marketing": <Megaphone className="w-6 h-6" />,
  "Finance": <DollarSign className="w-6 h-6" />,
  "Human Resources": <Users className="w-6 h-6" />,
};

const typeColors: Record<string, string> = {
  "Full-time": "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "Remote": "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Part-time": "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Contract": "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "Internship": "bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

const whyCards = [
  { icon: Search, title: "Easy Job Search", desc: "Powerful filters to find the perfect opportunity from thousands of listings in seconds.", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
  { icon: CheckCircle, title: "Verified Employers", desc: "Every company is verified by our team to ensure safe, legitimate job opportunities.", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
  { icon: Zap, title: "Fast Applications", desc: "One-click apply with your saved profile — no repeated form-filling.", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
  { icon: TrendingUp, title: "Career Growth", desc: "Access curated tips, career advice, and mentorship resources to level up.", color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20" },
];

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const staggerContainer = (delay = 0.08): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: delay,
    },
  },
});

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <GuestNavbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-950">
        {/* dot grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* ambient blobs */}
        <motion.div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.35, 0.2, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left copy */}
            <motion.div
              variants={staggerContainer(0.1)}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20">
                <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                #1 Job Portal in Vietnam
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Find Your<br />
                <span className="text-blue-200">Dream Job</span> Today
              </motion.h1>

              <motion.p variants={fadeUp} className="text-blue-100 text-lg lg:text-xl mb-10 leading-relaxed max-w-lg">
                Connect talented professionals with leading companies across the country.
              </motion.p>

              <motion.form
                variants={fadeUp}
                onSubmit={handleSearch}
                className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2"
              >
                <div className="flex items-center gap-2 flex-1 px-3 py-2">
                  <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Job title, keywords..."
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="flex-1 outline-none bg-transparent text-foreground placeholder:text-muted-foreground text-sm"
                  />
                </div>
                <div className="w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-2 flex-1 px-3 py-2">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="City or remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 outline-none bg-transparent text-foreground placeholder:text-muted-foreground text-sm"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 justify-center"
                >
                  <Search className="w-4 h-4" /> Search
                </motion.button>
              </motion.form>

              <motion.p variants={fadeUp} className="mt-4 text-blue-200 text-sm">
                Popular: React Developer, Product Designer, Data Analyst, Marketing Manager
              </motion.p>
            </motion.div>

            {/* Right floating cards */}
            <div className="hidden lg:flex flex-col gap-4 items-end">
              {[
                { delay: 0.25, yAnim: [0, -10, 0], dur: 4, w: "w-72",
                  content: (
                    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 shadow-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">TC</div>
                        <div>
                          <div className="text-white font-semibold text-sm">Senior Frontend Engineer</div>
                          <div className="text-blue-200 text-xs">TechCorp Vietnam</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-200 text-xs">$3,000 – $5,000/mo</span>
                        <span className="bg-emerald-400/20 text-emerald-200 text-xs px-2 py-0.5 rounded-full">Full-time</span>
                      </div>
                    </div>
                  )
                },
                { delay: 0.45, yAnim: [0, 9, 0], dur: 3.5, w: "w-64",
                  content: (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/40 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <div className="text-foreground font-semibold text-sm">Application Sent!</div>
                        <div className="text-muted-foreground text-xs">2 minutes ago</div>
                      </div>
                    </div>
                  )
                },
                { delay: 0.65, yAnim: [0, -7, 0], dur: 5, w: "w-52",
                  content: (
                    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 shadow-xl">
                      <div className="text-white text-sm font-semibold mb-1">10,000+ Jobs</div>
                      <div className="text-blue-200 text-xs">Updated daily from top companies</div>
                    </div>
                  )
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  className={card.w}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: card.delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    animate={{ y: card.yAnim }}
                    transition={{ duration: card.dur, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {card.content}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              { label: "Jobs Available", target: 10000, suffix: "+", color: "text-blue-600" },
              { label: "Companies", target: 2000, suffix: "+", color: "text-emerald-600" },
              { label: "Job Seekers", target: 50000, suffix: "+", color: "text-violet-600" },
              { label: "Recruiters", target: 5000, suffix: "+", color: "text-amber-600" },
            ].map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="text-center">
                <div className={`text-3xl lg:text-4xl font-extrabold mb-1 ${s.color}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <AnimatedCounter target={s.target} suffix={s.suffix} />
                </div>
                <div className="text-muted-foreground text-sm font-medium">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="companies">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold text-foreground mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Browse by Category
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Find opportunities in the industry that suits you best.</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          variants={staggerContainer(0.07)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.name}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/login")}
              className="group bg-card hover:bg-blue-600 border border-border hover:border-blue-600 rounded-2xl p-5 flex flex-col items-center gap-3 transition-colors duration-200 hover:shadow-lg hover:shadow-blue-600/15"
            >
              <div className="text-blue-600 group-hover:text-white transition-colors">
                {categoryIcons[cat.name]}
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-foreground group-hover:text-white transition-colors leading-tight">{cat.name}</div>
                <div className="text-xs text-muted-foreground group-hover:text-blue-100 transition-colors mt-0.5">{cat.count.toLocaleString()} jobs</div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* ── Featured Jobs ─────────────────────────────────────── */}
      <section className="bg-muted/50 py-16" id="jobs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-between mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="text-3xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Featured Jobs
              </h2>
              <p className="text-muted-foreground">Hand-picked opportunities from top employers</p>
            </div>
            <button onClick={() => navigate("/login")} className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {mockJobs.map((job) => (
              <motion.div
                key={job.id}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: "0 24px 48px -12px rgba(37,99,235,0.13)" }}
                className="bg-card border border-border rounded-2xl p-5 flex flex-col group cursor-pointer hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-11 h-11 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                    {job.companyLogo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-sm group-hover:text-blue-600 transition-colors leading-tight">{job.title}</h3>
                    <p className="text-muted-foreground text-xs mt-0.5">{job.company}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${typeColors[job.type] ?? "bg-muted text-muted-foreground"}`}>
                    {job.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" /> {job.location}
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{job.salary}</div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-5 flex-1">
                  {job.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">{job.posted}</span>
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/login")}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Apply Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="about">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold text-foreground mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Why Choose JobPortal?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Built for job seekers and recruiters who value quality, speed, and trust.</p>
        </motion.div>
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {whyCards.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{card.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 overflow-hidden relative">
        <motion.div
          className="absolute -left-24 top-0 w-72 h-72 bg-white/5 rounded-full"
          animate={{ x: [0, 24, 0], y: [0, -14, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-16 bottom-0 w-56 h-56 bg-white/5 rounded-full"
          animate={{ x: [0, -18, 0], y: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.h2
            className="text-3xl font-extrabold text-white mb-4"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Ready to Start Your Journey?
          </motion.h2>
          <motion.p
            className="text-blue-100 text-lg mb-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join 50,000+ professionals who found their dream job on JobPortal.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/register")} className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-md">
              Get Started Free
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/login")} className="px-8 py-3 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
              Sign In
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>JobPortal</span>
              </div>
              <p className="text-sm leading-relaxed mb-5">Connecting talent with opportunity since 2024. Your career growth is our mission.</p>
              <div className="flex gap-3">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.15, backgroundColor: "#2563eb" }} className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4" />
                  </motion.button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">For Job Seekers</div>
              {["Browse Jobs", "Create Profile", "Saved Jobs", "Career Advice", "Salary Guide"].map((l) => (
                <button key={l} className="block text-sm hover:text-white transition-colors mb-2">{l}</button>
              ))}
            </div>
            <div>
              <div className="text-white font-semibold mb-4">For Recruiters</div>
              {["Post a Job", "Search Candidates", "Company Profile", "Pricing", "HR Solutions"].map((l) => (
                <button key={l} className="block text-sm hover:text-white transition-colors mb-2">{l}</button>
              ))}
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Contact Us</div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-400" /> hello@jobportal.vn</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-400" /> +84 28 1234 5678</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" /> Ho Chi Minh City, Vietnam</div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm">© 2024 JobPortal. All rights reserved.</span>
            <div className="flex gap-6 text-sm">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
                <button key={l} className="hover:text-white transition-colors">{l}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
