// Header.js
import React, { useContext } from 'react';
import { UserContext } from '../../../App';
import { useAuth } from '../../api/js/login';

const Header = () => {
  const { state } = useContext(UserContext); // Just use state here, no need for dispatch
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <nav className="nav nav--tours">
        <a className="nav__el" href="/">
          All tours
        </a>
      </nav>
      <div className="header__logo">
        <img src="/img/logo-white.png" alt="Natours logo" />
      </div>
      <nav className="nav nav--user">
        {state.isAuthenticated ? (
          <>
            <a
              className="nav__el nav__el--logout"
              href="#"
              onClick={handleLogout}
            >
              Log out
            </a>
            <a className="nav__el" href="/me">
              <img
                className="nav__user-img"
                src={`/img/users/${state.user?.photo}`} // Use state.user.photo
                alt={`Photo of ${state.user?.name}`}
              />
              <span>{state.user?.name.split(' ')[0]}</span>
            </a>
          </>
        ) : (
          <>
            <a className="nav__el" href="/login">
              Log in
            </a>
            <a className="nav__el nav__el--cta" href="#">
              Sign up
            </a>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
