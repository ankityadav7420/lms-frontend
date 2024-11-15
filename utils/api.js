import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

export const loginUser = (email, password) =>
  axios.post(`/api/auth/login`, { email, password });

export const registerUser = (email, name, password) =>
  axios.post(`/api/auth/register`, { email, name, password });
export const logoutUser = () => axios.get(`/api/auth/logout`);

export const getTestDetails = (testId) => axios.get(`/api/tests/${testId}`);

export const startTest = () => axios.get(`/api/tests/start`);

export const submitAnswer = (testId, questionId, answer) =>
  axios.post(`/api/tests/${testId}/questions/${questionId}/answer`, { answer });

export const getTestResult = (testId) =>
  axios.get(`/api/tests/${testId}/result`);
