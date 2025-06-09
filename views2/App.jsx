import React, { useReducer, createContext, useEffect } from 'react';
import './style.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './src/components/header/header.jsx';
import Footer from './src/components/footer/footer.jsx';
import HomePage from './src/pages/Dashboard/Overview1'; // Add your actual page components
import TourPage from './src/pages/tour/TourPage'; // For the individual tour details
import LoginPage from './src/pages/loginandsignup/login'; // For login page
import UserProfile from './src/pages/account/account.jsx'; // User profile page
import MyBookings from './src/pages/account/MyBookings';
import MyReviews from './src/pages/account/MyReviews.jsx';
import TourManagementPage from './src/pages/tour/tourManagement.jsx';
import BookingManagementPage from './src/pages/tour/bookingManagement.jsx';
import UserManagementPage from './src/pages/account/userManagement.jsx';
import api from './src/api/js/api.js';

import { initialState, reducer } from './reducer/UseReducer';
export const UserContext = createContext();

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/api/v1/users/me', {
          withCredentials: true,
        });
        if (res.data.status === 'success') {
          dispatch({
            type: 'USER',
            payload: { isAuthenticated: true, user: res.data.data.data },
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchUser();
  }, []);

  return (
    <Router>
      <UserContext.Provider value={{ state, dispatch }}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tour/:id" element={<TourPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/me" element={<UserProfile />} />
          <Route path="/my-bookings" element={<MyBookings />}></Route>
          <Route path="/my-reviews" element={<MyReviews />}></Route>
          <Route
            path="/tour-management"
            element={<TourManagementPage />}
          ></Route>
          <Route
            path="/booking-management"
            element={<BookingManagementPage />}
          ></Route>
          <Route
            path="/user-management"
            element={<UserManagementPage />}
          ></Route>
        </Routes>
        <Footer />
      </UserContext.Provider>
    </Router>
  );
};

export default App;
