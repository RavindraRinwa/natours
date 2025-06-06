import React, { useState, useEffect } from 'react';
import api from '../../api/js/api.js';
import { updateSettings } from '../../api/js/updateSettings';

const NavItem = ({ link, text, icon, active }) => {
  return (
    <li className={`${active ? 'side-nav--active' : ''}`}>
      <a href={link}>
        <svg>
          <use xlinkHref={`img/icons.svg#icon-${icon}`} />
        </svg>
        {text}
      </a>
    </li>
  );
};

const UserSettings = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', photo: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/api/v1/users/me', {
          withCredentials: true,
        });
        if (res.data.status === 'success') {
          setUser(res.data.data.data);
          setFormData({
            name: res.data.data.data.name,
            email: res.data.data.data.email,
            photo: res.data.data.data.photo,
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    if (formData.photo) form.append('photo', formData.photo);
    await updateSettings(form, 'data');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    await updateSettings(
      {
        passwordCurrent: passwordData.currentPassword,
        password: passwordData.newPassword,
        passwordConfirm: passwordData.confirmPassword,
      },
      'password'
    );
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            <NavItem link="#" text="Settings" icon="settings" active={true} />
            <NavItem link="/my-bookings" text="My bookings" icon="briefcase" />
            <NavItem link="/my-reviews" text="My reviews" icon="star" />
            <NavItem link="#" text="Billing" icon="credit-card" />
            {user?.role === 'admin' && (
              <div className="admin-nav">
                <h5 className="admin-nav__heading">Admin</h5>
                <ul className="side-nav">
                  <NavItem
                    link="/tour-management"
                    text="Manage tours"
                    icon="map"
                  />
                  <NavItem link="#" text="Manage users" icon="users" />
                  <NavItem link="#" text="Manage reviews" icon="star" />
                  <NavItem
                    link="/booking-management"
                    text="Manage bookings"
                    icon="briefcase"
                  />
                </ul>
              </div>
            )}
          </ul>
        </nav>

        <div className="user-view__content">
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">
              Your account settings
            </h2>
            <form className="form form-user-data" onSubmit={handleSaveSettings}>
              <div className="form__group">
                <label className="form__label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  className="form__input"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form__group ma-bt-md">
                <label className="form__label" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  className="form__input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form__group form__photo-upload">
                <img
                  className="form__user-photo"
                  src={`img/users/${formData.photo}`}
                  alt="User photo"
                />
                <input
                  className="form__upload"
                  type="file"
                  accept="image/*"
                  id="photo"
                  name="photo"
                  onChange={handlePhotoChange}
                />
                <label htmlFor="photo">Choose new photo</label>
              </div>
              <div className="form__group right">
                <button className="btn btn--small btn--green" type="submit">
                  Save settings
                </button>
              </div>
            </form>
          </div>
          <div className="line">&nbsp;</div>
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Password change</h2>
            <form
              className="form form-user-password"
              onSubmit={handleChangePassword}
            >
              <div className="form__group">
                <label className="form__label" htmlFor="password-current">
                  Current password
                </label>
                <input
                  id="password-current"
                  className="form__input"
                  type="password"
                  name="currentPassword"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="8"
                />
              </div>
              <div className="form__group">
                <label className="form__label" htmlFor="password">
                  New password
                </label>
                <input
                  id="password"
                  className="form__input"
                  type="password"
                  name="newPassword"
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="8"
                />
              </div>
              <div className="form__group ma-bt-lg">
                <label className="form__label" htmlFor="password-confirm">
                  Confirm password
                </label>
                <input
                  id="password-confirm"
                  className="form__input"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="8"
                />
              </div>
              <div className="form__group right">
                <button
                  className="btn btn--small btn--green btn--save-password"
                  type="submit"
                >
                  Save password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserSettings;
