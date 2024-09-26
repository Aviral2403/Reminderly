import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:8000/api/auth";
axios.defaults.withCredentials = true; // Ensures cookies are sent with requests

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null, // Initial state from localStorage
  isAuthenticated: !!localStorage.getItem('user'), // Set isAuthenticated based on presence of user in localStorage
  error: null,
  isLoading: false,
  isCheckingAuth: true, // For tracking the auth check process
  message: null,

  // Signup function
  signup: async (email, password, username, fullname) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, { email, password, username, fullname });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user in localStorage
    } catch (error) {
      set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
      throw error;
    }
  },

  // Login function
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user in localStorage
    } catch (error) {
      set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
      throw error;
    }
  },

  // Logout function
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, error: null, isLoading: false });
      localStorage.removeItem('user'); // Remove user from localStorage
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  // Verify Email function
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Update user in localStorage
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error verifying email", isLoading: false });
      throw error;
    }
  },

  // Forgot Password function
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  // Reset Password function
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  },

  // Check authentication status function
  checkAuth: async () => {
    const localStorageObject = localStorage.getItem('user');
    const json = JSON.parse(localStorageObject);
    const id = json ? json._id : null;
    const response = await axios.get(`${API_URL}/check-auth?userID=${id}`);
    console.log(response.data);
    set({ isCheckingAuth: true, error: null });
    try {
      set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
      localStorage.removeItem('user');
      throw error;
    }
  }
}));
