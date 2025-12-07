import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

export const UserSignUp = (data) => API.post("/users/signup", data);
export const UserSignIn = (data) => API.post("/users/signin", data);

export const getDashboradData = (token) =>
  API.get("/users/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getWorkouts = (token, date = "") =>
  API.get(`/users/workout?date=${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addWorkout = (token, data) =>
  API.post("/users/workout", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
