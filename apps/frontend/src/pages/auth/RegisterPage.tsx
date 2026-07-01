import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Briefcase, Mail, Lock, Eye, EyeOff,
  Briefcase as BriefcaseIcon, UserCheck, ArrowLeft,
  RefreshCw, CheckCircle2, AlertCircle, ShieldCheck
} from "lucide-react";
import * as authApi from "../../services/auth";

type AccountType = "JOB_SEEKER" | "RECRUITER";
type Step = "form" | "otp";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

// ── OTP Input ──────────────────────────────────────────────────────────────
function OtpInput({
                    value,
                    onChange,
                    disabled,
                  }: {
  value: string[];
  onChange: (v: string[]) => void;
  disabled?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      const next = [...value];
      if (next[idx]) {
        next[idx] = "";
        onChange(next);
      } else if (idx > 0) {
        refs.current[idx - 1]?.focus();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[idx] = char;
    onChange(next);
    if (char && idx < OTP_LENGTH - 1) refs.current[idx + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((c, i) => { next[i] = c; });
    onChange(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    refs.current[focusIdx]?.focus();
  };

  return (
      <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handlePaste}>
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
            <motion.input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value[i] ?? ""}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKey(e, i)}
                disabled={disabled}
                whileFocus={{ scale: 1.08 }}
                className={`w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
            bg-input-background text-foreground
            ${value[i]
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "border-border focus:border-blue-400 dark:focus:border-blue-500"
                }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
            />
        ))}
      </div>
  );
}

// ── Countdown hook ─────────────────────────────────────────────────────────
function useCountdown(initial: number) {
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setSeconds(initial);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(timerRef.current!); return 0; }
        return s - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  return { seconds, start, active: seconds > 0 };
}

// ── Main component ─────────────────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate();

  // Step
  const [step, setStep] = useState<Step>("form");

  // Form state
  const [accountType, setAccountType] = useState<AccountType>("JOB_SEEKER");
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // OTP state
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpVerified, setOtpVerified] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const countdown = useCountdown(RESEND_COOLDOWN);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  // ── Step 1: Register ────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 5) {
      setError("Password must be at least 5 characters.");
      return;
    }

    setLoading(true);
    try {
      await authApi.register(
          form.email,
          form.password,
          form.confirmPassword,
          accountType
      );
      setStep("otp");
      countdown.start();
      setInfo("A 6-digit verification code has been sent to your email.");
    } catch (err: any) {
      setError(
          err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──────────────────────────────────────────────────
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join("");
    if (token.length < OTP_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authApi.verifyOtp(token);
      setOtpVerified(true);
      setTimeout(() => {
        navigate("/login");
      }, 1400);
    } catch (err: any) {
      setError(err.message ?? "Invalid or expired code. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ──────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (countdown.active) return;
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await authApi.resendOtp(form.email);
      countdown.start();
      setOtp(Array(OTP_LENGTH).fill(""));
      setInfo("A new verification code has been sent to your email.");
    } catch (err: any) {
      setError(
          err.response?.data?.message ||
          "Failed to resend. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 60 : -60,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.45,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -60 : 60,
      transition: {
        duration: 0.3,
      },
    }),
  };

  const isRecruiter = accountType === "RECRUITER";

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4 py-10 relative overflow-hidden">
        {/* background blobs */}
        <motion.div
            className="absolute top-10 right-10 w-80 h-80 bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none"
            animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute bottom-10 left-10 w-64 h-64 bg-violet-200/40 dark:bg-violet-900/20 rounded-full blur-3xl pointer-events-none"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
            className="w-full max-w-md relative"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-5 px-1">
            {(["form", "otp"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-500 ${
                      step === s ? "bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-800" :
                          (i === 1 && step === "otp") || otpVerified ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {i === 1 && otpVerified ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block transition-colors ${step === s ? "text-foreground" : "text-muted-foreground"}`}>
                {s === "form" ? "Account Info" : "Verify Email"}
              </span>
                  {i === 0 && <div className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${step === "otp" ? "bg-blue-500" : "bg-border"}`} />}
                </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
            <AnimatePresence mode="wait" custom={step === "otp" ? 1 : -1}>
              {step === "form" ? (
                  /* ── FORM STEP ─────────────────────────────────────── */
                  <motion.div
                      key="form"
                      custom={-1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="p-8"
                  >
                    {/* Header */}
                    <div className="text-center mb-7">
                      <Link to="/" className="inline-flex items-center gap-2 mb-5">
                        <motion.div
                            className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Briefcase className="w-5 h-5 text-white" />
                        </motion.div>
                        <span className="text-2xl font-extrabold text-blue-600" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>JobPortal</span>
                      </Link>
                      <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create an account</h1>
                      <p className="text-muted-foreground text-sm">Join thousands of professionals today</p>
                    </div>

                    {/* Role toggle */}
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">I am a...</p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { type: "JOB_SEEKER" as AccountType, icon: UserCheck, label: "Job Seeker", sub: "Looking for work", border: "border-blue-600 bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600" },
                          { type: "RECRUITER" as AccountType, icon: BriefcaseIcon, label: "Recruiter", sub: "Hiring talent", border: "border-violet-600 bg-violet-50 dark:bg-violet-900/20", text: "text-violet-600" },
                        ].map((opt) => (
                            <motion.button
                                key={opt.type}
                                type="button"
                                onClick={() => setAccountType(opt.type)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                                    accountType === opt.type ? opt.border : "border-border bg-muted/30 hover:border-muted-foreground/30"
                                }`}
                            >
                              <opt.icon className={`w-6 h-6 ${accountType === opt.type ? opt.text : "text-muted-foreground"}`} />
                              <span className={`text-sm font-bold ${accountType === opt.type ? opt.text : "text-muted-foreground"}`}>{opt.label}</span>
                              <span className="text-xs text-muted-foreground">{opt.sub}</span>
                            </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleRegister} className="space-y-4">
                      {error && (
                          <motion.div
                              initial={{ opacity: 0, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-700 dark:text-red-400"
                          >
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            {error}
                          </motion.div>
                      )}

                      {/* Email */}
                      <div>
                        <label className="text-sm font-semibold text-foreground mb-1.5 block">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                              type="email"
                              value={form.email}
                              onChange={update("email")}
                              placeholder="you@example.com"
                              required
                              className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all text-sm"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="text-sm font-semibold text-foreground mb-1.5 block">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                              type={showPwd ? "text" : "password"}
                              value={form.password}
                              onChange={update("password")}
                              placeholder="Min. 5 characters"
                              required
                              minLength={5}
                              maxLength={30}
                              className="w-full pl-10 pr-10 py-2.5 bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all text-sm"
                          />
                          <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {/* Password strength */}
                        {form.password.length > 0 && (
                            <div className="mt-2 flex gap-1">
                              {[5, 8, 12, 20].map((threshold, i) => (
                                  <div
                                      key={i}
                                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                          form.password.length >= threshold
                                              ? ["bg-red-400", "bg-amber-400", "bg-blue-500", "bg-emerald-500"][i]
                                              : "bg-border"
                                      }`}
                                  />
                              ))}
                            </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="text-sm font-semibold text-foreground mb-1.5 block">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                              type={showConfirm ? "text" : "password"}
                              value={form.confirmPassword}
                              onChange={update("confirmPassword")}
                              placeholder="Re-enter password"
                              required
                              className={`w-full pl-10 pr-10 py-2.5 bg-input-background border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm ${
                                  form.confirmPassword && form.confirmPassword !== form.password
                                      ? "border-red-400 focus:border-red-400"
                                      : "border-border focus:border-primary"
                              }`}
                          />
                          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {form.confirmPassword && form.confirmPassword !== form.password && (
                            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Passwords do not match
                            </p>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        By creating an account, you agree to our{" "}
                        <button type="button" className="text-blue-600 text-xs hover:underline">Terms of Service</button>{" "}and{" "}
                        <button type="button" className="text-blue-600 text-xs hover:underline">Privacy Policy</button>.
                      </p>

                      <motion.button
                          type="submit"
                          disabled={loading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full py-3 text-white font-bold rounded-xl transition-colors shadow-md disabled:opacity-60 ${
                              isRecruiter
                                  ? "bg-violet-600 hover:bg-violet-700 shadow-violet-600/20"
                                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                          }`}
                      >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                        <motion.span
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        Creating account...
                      </span>
                        ) : `Continue as ${isRecruiter ? "Recruiter" : "Job Seeker"}`}
                      </motion.button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                      Already have an account?{" "}
                      <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">Sign in</Link>
                    </p>
                  </motion.div>
              ) : (
                  /* ── OTP STEP ──────────────────────────────────────── */
                  <motion.div
                      key="otp"
                      custom={1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="p-8"
                  >
                    <AnimatePresence mode="wait">
                      {otpVerified ? (
                          /* Success state */
                          <motion.div
                              key="success"
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex flex-col items-center justify-center py-8 text-center"
                          >
                            <motion.div
                                className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-5"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                            >
                              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </motion.div>
                            <h2 className="text-2xl font-extrabold text-foreground mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              Email verified!
                            </h2>
                            <p className="text-muted-foreground text-sm">Your account has been created successfully.</p>
                            <p className="text-muted-foreground text-xs mt-1">Redirecting you now...</p>
                          </motion.div>
                      ) : (
                          /* OTP entry */
                          <motion.div key="entry" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {/* Back button */}
                            <button
                                onClick={() => { setStep("form"); setError(""); setOtp(Array(OTP_LENGTH).fill("")); }}
                                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                            >
                              <ArrowLeft className="w-4 h-4" /> Back
                            </button>

                            {/* Icon + heading */}
                            <div className="text-center mb-8">
                              <motion.div
                                  className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                  animate={{ rotate: [0, -6, 6, 0] }}
                                  transition={{ duration: 0.6, delay: 0.2 }}
                              >
                                <ShieldCheck className="w-8 h-8 text-blue-600" />
                              </motion.div>
                              <h2 className="text-2xl font-extrabold text-foreground mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                Check your email
                              </h2>
                              <p className="text-muted-foreground text-sm leading-relaxed">
                                We sent a 6-digit verification code to
                              </p>
                              <p className="font-semibold text-foreground text-sm mt-0.5">{form.email}</p>
                            </div>

                            <form onSubmit={handleVerify} className="space-y-5">

                              {/* OTP boxes */}
                              <OtpInput value={otp} onChange={setOtp} disabled={loading} />

                              {/* Error */}
                              <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-700 dark:text-red-400"
                                    >
                                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                      {error}
                                    </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Info */}
                              <AnimatePresence>
                                {info && !error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-sm text-blue-700 dark:text-blue-400"
                                    >
                                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                      {info}
                                    </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Verify button */}
                              <motion.button
                                  type="submit"
                                  disabled={loading || otp.join("").length < OTP_LENGTH}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-md shadow-blue-600/20"
                              >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                              <motion.span
                                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                              />
                              Verifying...
                            </span>
                                ) : "Verify Email"}
                              </motion.button>

                              {/* Resend */}
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
                                {countdown.active ? (
                                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                      <motion.div
                                          className="w-5 h-5 rounded-full border-2 border-muted-foreground/40 border-t-blue-500"
                                          animate={{ rotate: 360 }}
                                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      />
                                      Resend in{" "}
                                      <span className="font-bold text-foreground tabular-nums w-6 text-center">
                                {countdown.seconds}s
                              </span>
                                    </div>
                                ) : (
                                    <motion.button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={loading}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                      <RefreshCw className="w-3.5 h-3.5" />
                                      Resend code
                                    </motion.button>
                                )}
                              </div>
                            </form>
                          </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
  );
}
