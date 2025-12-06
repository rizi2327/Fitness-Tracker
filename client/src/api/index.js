import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api/v1'
});

export const UserSignUp = async(data) => API.post('/users/signup', data);
export const UserSignIn = async(data) => API.post('/users/signin', data);

// ✅ FIX 1: Backticks use karein
export const UserDashboard = async(token) => 
    API.get('/users/dashboard', {
        headers: { Authorization: `Bearer ${token}` }  // ✅ Backticks
    });

// ✅ FIX 2: Add forward slash
export const getWorkouts = async(token, date) =>
    await API.get(`/user/workout${date}`, {
        headers: {
            Authorization: `Bearer ${token}`  // ✅ Backticks
        }
    });

// ✅ FIX 3: Complete endpoint path
export const addWorkout = async(token, data) =>
    await API.post('/users/workout', data, {
        headers: {
            Authorization: `Bearer ${token}`  // ✅ Backticks
        }
    });