export type Role = "ADMIN" | "RECRUITER" | "JOBSEEKER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  company?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: string;
  type: "Full-time" | "Part-time" | "Remote" | "Contract" | "Internship";
  category: string;
  posted: string;
  description: string;
  tags: string[];
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "Pending" | "Reviewed" | "Interview" | "Rejected" | "Offered";
}

export const mockUsers: User[] = [
  { id: "1", name: "Admin User", email: "admin@jobportal.com", role: "ADMIN", avatar: "AU" },
  { id: "2", name: "Sarah Johnson", email: "sarah@techcorp.com", role: "RECRUITER", avatar: "SJ", company: "TechCorp" },
  { id: "3", name: "Alex Nguyen", email: "alex@gmail.com", role: "JOBSEEKER", avatar: "AN" },
];

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "TechCorp Vietnam",
    companyLogo: "TC",
    location: "Ho Chi Minh City",
    salary: "$3,000 – $5,000",
    type: "Full-time",
    category: "Software Engineering",
    posted: "2 days ago",
    description: "Build world-class React applications for millions of users.",
    tags: ["React", "TypeScript", "TailwindCSS"],
  },
  {
    id: "2",
    title: "Data Scientist",
    company: "Analytics Hub",
    companyLogo: "AH",
    location: "Hanoi",
    salary: "$2,500 – $4,000",
    type: "Full-time",
    category: "Data Science",
    posted: "1 day ago",
    description: "Drive data-driven decisions with ML models and analytics.",
    tags: ["Python", "TensorFlow", "SQL"],
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: "Creative Studio",
    companyLogo: "CS",
    location: "Da Nang",
    salary: "$1,800 – $3,000",
    type: "Full-time",
    category: "UI/UX Design",
    posted: "3 days ago",
    description: "Design elegant experiences for consumer-facing products.",
    tags: ["Figma", "Prototyping", "User Research"],
  },
  {
    id: "4",
    title: "Marketing Manager",
    company: "GrowthLab",
    companyLogo: "GL",
    location: "Remote",
    salary: "$2,000 – $3,500",
    type: "Remote",
    category: "Marketing",
    posted: "5 days ago",
    description: "Lead growth marketing campaigns across digital channels.",
    tags: ["SEO", "Google Ads", "Analytics"],
  },
  {
    id: "5",
    title: "Financial Analyst",
    company: "FinTech Co.",
    companyLogo: "FC",
    location: "Ho Chi Minh City",
    salary: "$2,200 – $3,800",
    type: "Full-time",
    category: "Finance",
    posted: "1 week ago",
    description: "Model financial scenarios and advise on investment decisions.",
    tags: ["Excel", "Financial Modeling", "CFA"],
  },
  {
    id: "6",
    title: "HR Business Partner",
    company: "PeopleFirst",
    companyLogo: "PF",
    location: "Hanoi",
    salary: "$1,500 – $2,800",
    type: "Full-time",
    category: "Human Resources",
    posted: "4 days ago",
    description: "Partner with leadership to build high-performing teams.",
    tags: ["Talent Acquisition", "HRIS", "Culture"],
  },
];

export const mockApplications: Application[] = [
  { id: "1", jobId: "1", jobTitle: "Senior Frontend Engineer", company: "TechCorp Vietnam", appliedDate: "2024-06-28", status: "Interview" },
  { id: "2", jobId: "3", jobTitle: "UI/UX Designer", company: "Creative Studio", appliedDate: "2024-06-25", status: "Reviewed" },
  { id: "3", jobId: "4", jobTitle: "Marketing Manager", company: "GrowthLab", appliedDate: "2024-06-20", status: "Pending" },
];

export const categories = [
  { name: "Software Engineering", icon: "💻", count: 1240 },
  { name: "Data Science", icon: "📊", count: 580 },
  { name: "UI/UX Design", icon: "🎨", count: 340 },
  { name: "Marketing", icon: "📣", count: 720 },
  { name: "Finance", icon: "💰", count: 460 },
  { name: "Human Resources", icon: "👥", count: 290 },
];

export const stats = [
  { label: "Jobs Available", value: "10,000+", color: "text-blue-600" },
  { label: "Companies", value: "2,000+", color: "text-emerald-600" },
  { label: "Job Seekers", value: "50,000+", color: "text-violet-600" },
  { label: "Recruiters", value: "5,000+", color: "text-amber-600" },
];

export const careerTips = [
  { title: "Craft a Standout Resume", desc: "Tailor your resume to each job posting — highlight measurable achievements over generic duties.", tag: "Resume" },
  { title: "Ace Your Next Interview", desc: "Practice the STAR method for behavioral questions and research the company deeply beforehand.", tag: "Interview" },
  { title: "Build Your LinkedIn Presence", desc: "A complete, keyword-optimized profile gets 40× more recruiter views than an incomplete one.", tag: "Networking" },
];

export const adminStats = [
  { label: "Total Users", value: "52,348", change: "+12%", color: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  { label: "Total Recruiters", value: "5,124", change: "+8%", color: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" },
  { label: "Total Jobs", value: "10,842", change: "+23%", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  { label: "Total Applications", value: "128,900", change: "+31%", color: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
];

export const recruiterStats = [
  { label: "Jobs Posted", value: "24", change: "Active listings" },
  { label: "Total Applicants", value: "312", change: "Across all jobs" },
  { label: "Open Positions", value: "18", change: "Currently hiring" },
  { label: "Closed Jobs", value: "6", change: "Positions filled" },
];
