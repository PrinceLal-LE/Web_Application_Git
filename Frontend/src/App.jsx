import { Routes, Route, BrowserRouter, useLocation, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { Home } from './views/home.jsx';
import { CommonAuth } from './auth/Components/CommonAuth.jsx';
import { Login } from './auth/Components/Login.jsx';
import { MyConnect } from './views/myConnect.jsx';
import { SkillConnect } from './views/skillConnect.jsx';
import { CareerConnect } from './views/careerConnect.jsx';
import { MessagePanel } from './views/messagePanel.jsx';
import { Navbar } from './component/Navbar/Navbar.jsx';
import { useSelector, useDispatch } from 'react-redux'; 
import { setLogout } from './store/authSlice'; 
import { Profile } from './views/profile.jsx';
import { LogoutComponent } from './component/Logout/Logout';
import { EmailVerification } from './views/auth/EmailVerification.jsx';
import { ForgotPassword } from './views/auth/ForgotPassword.jsx';
import { PrivacyPolicy } from './views/Footer/privacy-policy.jsx';
// A private route component to guard routes
const PrivateRoute = ({ children }) => {
  // Use useSelector to get the isAuthenticated state and isLoading state from Redux
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);

  // If still loading, render a loading indicator
  if (isLoading) {
    return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h2>Loading...</h2>
    </div>;
  }

  // If not authenticated, redirect to the login page
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};


const MainApplicationLayout = () => {
  const location = useLocation();

  // Use useSelector to get the isAuthenticated and isLoading state from Redux
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);

  // Hide Navbar on specific authentication paths
  const hideNavbar = ['/login', '/login-or-signup', '/register','/email-verification','/forgot-password'].includes(location.pathname);

  // If the app is still loading the auth state, don't render the layout yet
  if (isLoading) {
    return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h2>Loading...</h2>
    </div>;
  }

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public Routes - Accessible to anyone */}
        <Route path="/login" element={<Login />} />
        <Route path="/login-or-signup" element={<CommonAuth />} />
        <Route path="/register" element={<CommonAuth />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/logout" element={<LogoutComponent />} />

        
        {/* Private/Protected Routes - Only accessible if authenticated */}
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/my-connect" element={<PrivateRoute><MyConnect /></PrivateRoute>} />
        <Route path="/skill-connect" element={<PrivateRoute><SkillConnect /></PrivateRoute>} />
        <Route path="/career-connect" element={<PrivateRoute><CareerConnect /></PrivateRoute>} />
        <Route path="/messaging" element={<PrivateRoute><MessagePanel /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        {/* Redirect from root based on authentication status */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />

        {/* Fallback for any other path */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  // This useEffect hook will handle the logic for multi-tab synchronization.
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Check if the changed item is our token or user data
      if (e.key === 'token' || e.key === 'user') {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        // If token or user is removed in another tab, dispatch logout
        if (!token || !user) {
          if (isAuthenticated) {
            console.log('Detected logout from another tab. Logging out...');
            Swal.fire({
                icon: 'error',
                title: 'Logout!',
                text: 'You have been logged out from another tab.',
                confirmButtonText: 'OK'
            });
            dispatch(setLogout());
          }
        }
        // If a new token is set (e.g., login in another tab),
        // the Redux state will be re-initialized when the page is reloaded,
        // or you could dispatch a new loginSuccess action here if needed.
        // The `getInitialState` handles this on page refresh, and the `storage` event
        // handles cross-tab sync.
      }
    };

    // Add the event listener to the window
    window.addEventListener('storage', handleStorageChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch, isAuthenticated]);
  return <>
    <BrowserRouter>
      <MainApplicationLayout /> {/* Main application layout is now a child of BrowserRouter */}
    </BrowserRouter>
  </>
}

export default App;