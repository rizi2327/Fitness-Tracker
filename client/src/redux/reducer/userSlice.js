import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,      // ✅ Added loading state
    error: null         // ✅ Added error state
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Login successful
        loginSuccess: (state, action) => {
            state.currentUser = action.payload.user;
            state.loading = false;
            state.error = null;
            localStorage.setItem("fittrack-app-token", action.payload.token);
        },
        
        // Logout
        logout: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('fittrack-app-token');
        },
        
        // Loading state
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        
        // Error state
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        
        // Update user profile
        updateUser: (state, action) => {
            if (state.currentUser) {
                state.currentUser = { ...state.currentUser, ...action.payload };
            }
        }
    }
});

// Export actions
export const { 
    loginSuccess, 
    logout, 
    setLoading, 
    setError, 
    updateUser 
} = userSlice.actions;
export default userSlice.reducer;
