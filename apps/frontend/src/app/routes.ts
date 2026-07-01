import { createBrowserRouter } from "react-router";
import LandingPage from "../pages/landing/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import JobSeekerHome from "../pages/jobseeker/JobSeekerHome";
import RecruiterHome from "../pages/recruiter/RecruiterHome";
import AdminDashboard from "../pages/admin/AdminDashboard";
import RegisterPage from "../pages/auth/RegisterPage";


export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/login", Component: LoginPage },
  { path: "/register", Component: RegisterPage },
  { path: "/home", Component: JobSeekerHome },
  { path: "/recruiter/home", Component: RecruiterHome },
  { path: "/admin/home", Component: AdminDashboard },
  { path: "/register", Component: RegisterPage},
]);
