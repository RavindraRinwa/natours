import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../views2/App';
import axios from 'axios';
import { showAlert } from './alerts';

export const useAuth = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/v1/users/login', { email, password });

      if (res.data.status === 'success') {
        showAlert('success', 'Logged in successfully!');
        dispatch({
          type: 'USER',
          payload: {
            isAuthenticated: true,
            user: res.data.data.user,
          },
        });
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      showAlert('error', err.message || err.response?.data?.message);
    }
  };

  const logout = async () => {
    try {
      const res = await axios.get('/api/v1/users/logout');

      if (res.data.status === 'success') {
        dispatch({
          type: 'LOGOUT',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
        location.reload(true);
      }
    } catch (err) {
      showAlert('error', 'Error logging out! Try again.');
    }
  };

  return { login, logout };
};
