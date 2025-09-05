import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode'; // Ensure jwt-decode is installed: npm install jwt-decode

const getInitialState = () => {
  const token = localStorage.getItem('token');
  let user = localStorage.getItem('user');
  let isAuthenticated = false;
  let isLoading = true;

  if (token && user) {
    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000;

      if (Date.now() < expirationTime) {
        isAuthenticated = true;
        user = JSON.parse(user);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Failed to decode or parse token/user from localStorage:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  isLoading = false; // Set to false after the synchronous check is done

  return {
    token: token,
    isAuthenticated: isAuthenticated,
    user: user,
    isLoading: isLoading, // Added isLoading state
  };
};


const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setLogin: (state, action) => { 
      const { token, user } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      state.isLoading = false;
      localStorage.setItem('token', token); // Persist token
      localStorage.setItem('user', JSON.stringify(user)); // Persist user
    },
    setLogout: (state) => { 
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.isLoading = false;
      localStorage.removeItem('token'); // Clear token
      localStorage.removeItem('user'); // Clear user  
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

// Ensure updateUserProfile is exported here
export const { setLogin, setLogout, setLoading, updateUserProfile } = authSlice.actions;

export default authSlice.reducer;