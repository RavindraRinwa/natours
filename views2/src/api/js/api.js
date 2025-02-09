import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: 'http://localhost:4000', // Change to your backend URL
  withCredentials: true, // Send cookies with requests
});

// Response interceptor to refresh token on 401 errors
api.interceptors.response.use(
  (response) => response, // Return response if successful
  async (error) => {
    const originalRequest = error.config;
    // If request fails due to expired token (401), try refreshing the token
    if (
      error.response &&
      error.response.status === 500 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Call refresh token API to generate new access token
        await axios.get('/api/v1/users/refresh-access-token', {
          withCredentials: true, // Ensure cookies are sent
        });

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
