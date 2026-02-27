import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

export const loginUser = (email, password) =>
  axios.post(`/api/auth/login`, { email, password });

export const registerUser = (email, name, password) =>
  axios.post(`/api/auth/register`, { email, name, password });
export const logoutUser = () => axios.get(`/api/auth/logout`);

// Fetch test details by unique URL (used in the public test link)
export const getTestDetails = (uniqueURL) =>
  axios.get(`/api/tests/url/${uniqueURL}`);

export const startTest = () => axios.post(`/api/tests/start`);
export const nextQuestion = (testId) =>
  axios.get(`/api/tests/${testId}/questions`);

export const submitAnswer = (testId, questionId, answer) =>
  axios.post(`/api/tests/${testId}/answer`, { questionId, answer });
// Fetch test details by test ID (for internal/admin use)
export const getTestResult = (testId) =>
  axios.get(`/api/tests/${testId}/result`);

// Courses & profile
export const getCourses = () => axios.get(`/api/courses`);
export const getCourseById = (id) => axios.get(`/api/courses/${id}`);
export const getProfile = () => axios.get(`/api/courses/me/profile`);
export const getCurrentUser = () => axios.get(`/api/users/me`);
