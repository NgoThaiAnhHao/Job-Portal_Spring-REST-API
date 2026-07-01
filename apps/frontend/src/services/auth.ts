import axios from "axios";
import api from "./api";

const API_URL = "http://localhost:8080/api/auth";

// ==================== LOGIN ====================
export const login = async (
    email: string,
    password: string
) => {

    const response = await axios.post(
        `${API_URL}/login`,
        {
            email,
            password
        },
        {
            withCredentials: true
        }
    );

    return response.data;
};

// ==================== LOGOUT ====================
export const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
        throw new Error("Refresh token not found");
    }

    await axios.post(
        "http://localhost:8080/api/auth/logout",
        null,
        {
            params: {
                refreshToken
            }
        }
    );

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
};


// ==================== REGISTER ====================

export const register = async (
    email: string,
    password: string,
    confirmPassword: string,
    userTypeRole: "JOB_SEEKER" | "RECRUITER"
) => {

    const response = await axios.post(
        `${API_URL}/register`,
        {
            email,
            password,
            confirmPassword,
            userTypeRole,
            provider: "LOCAL"
        }
    );

    return response.data;
};

// ==================== VERIFY OTP ====================

export const verifyOtp = async (token: string) => {

    return axios.post(
        `${API_URL}/verify-otp`,
        null,
        {
            params: {
                token
            }
        }
    );
};

// ==================== RESEND OTP ====================

export const resendOtp = async (email: string) => {

    return axios.post(
        `${API_URL}/resend-verify-otp`,
        null,
        {
            params: {
                email
            }
        }
    );
};

// ==================== REFRESH TOKEN ====================

export const refreshAccessToken = async () => {

    const refreshToken = localStorage.getItem("refreshToken");

    const response = await axios.get(
        `${API_URL}/refresh-token`,
        {
            params: {
                refreshToken
            }
        }
    );

    return response.data;
};
