import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

export const loginUser = (email, password) =>
  axios.post(`/auth/login`, { email, password });

export const registerUser = (email, name, password) =>
  axios.post(`/auth/register`, { email, name, password });

export const getTestDetails = (testId) => axios.get(`/tests/${testId}`);

export const startTest = () => axios.get(`/tests/start`);

export const submitAnswer = (testId, questionId, answer) =>
  axios.post(`/tests/${testId}/questions/${questionId}/answer`, { answer });

export const getTestResult = (testId) => axios.get(`/tests/${testId}/result`);

export const logoutUser = () => axios.get(`/auth/logout`);
