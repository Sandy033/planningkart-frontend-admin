import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Load user from localStorage
const loadUserFromStorage = () => {
    try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            return { token, user: JSON.parse(user) };
        }
    } catch (error) {
        console.error('Error loading user from storage:', error);
    }
    return { token: null, user: null };
};

const { token: storedToken, user: storedUser } = loadUserFromStorage();

// Async thunks
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            // Backend returns flat structure: { email, role, token, id, expiresIn, type }
            // Map it to the structure expected by the frontend
            const { token, email: userEmail, role, id } = response.data;
            const user = { email: userEmail, role, id };

            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { token, user };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const signup = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/signup', { ...userData });
            const { token, user } = response.data;

            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { token, user };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Signup failed');
        }
    }
);

export const signupOrganizer = createAsyncThunk(
    'auth/signupOrganizer',
    async (organizerData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/organizer/signup', organizerData);
            // Backend likely returns flat structure similar to login
            const { token, email: userEmail, role, id } = response.data;
            const user = { email: userEmail, role, id };

            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { token, user };
        } catch (error) {
            // Handle validation errors or server errors
            const message = error.response?.data?.message || 'Organizer signup failed';
            // If details exist (e.g. field-specific errors), you might want to include them
            // For now, returning the main message
            return rejectWithValue(message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: storedUser,
        token: storedToken,
        isAuthenticated: !!storedToken,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Signup
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Organizer Signup
            .addCase(signupOrganizer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupOrganizer.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(signupOrganizer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
