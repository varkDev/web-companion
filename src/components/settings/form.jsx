
import { useState, useEffect, useRef } from 'react';
import './form.css';
import { fetchMe, updateUser } from '../../api/userApi';
import createEmptyUser from '../../models/user.js';
import defaultProfile from '../../assets/profile/default.jpg';

function SettingsForm() {
  const [user, setUser] = useState(createEmptyUser());
  const [initialUser, setInitialUser] = useState(createEmptyUser());
  const [typed, setTyped] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const title = "Settings";
  const fileInputRef = useRef(null);
  // Handle profile picture upload
  const handleProfilePicClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // reset
      fileInputRef.current.click();
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only .png and .jpg files are allowed');
      return;
    }
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUser(prev => ({ ...prev, profile_picture: ev.target.result }));
      setError('');
    };
    reader.readAsDataURL(file);
    // TODO: You may want to upload the file to the server here
  };

  useEffect(() => {
    setTyped('');
    let i = 0;
    const interval = setInterval(() => {
      setTyped(title.slice(0, i + 1));
      i++;
      if (i >= title.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [title]);

  useEffect(() => {
    fetchMe()
      .then(data => {
        setUser(data);
        setInitialUser(data);
      })
      .catch(() => setError('Could not fetch user info'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [name]: value
      }
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(user);
      if (response.ok) {
        setSuccess('Profile updated!');
        setError('');
        setInitialUser(user);
      } else {
        const error = await response.json();
        setError('Update failed: ' + (error.error || 'Unknown error'));
        setSuccess('');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      setSuccess('');
    }
  };

  const isChanged = (field, nested = false) => {
    if (!nested) return user[field] !== initialUser[field];
    return (user.social_links?.[field] || '') !== (initialUser.social_links?.[field] || '');
  };

  return (
    <div className="settings-container">
      <div className="settings-card">

        <h1 className="settings-title">{typed}</h1>

        <div className="profile-summary">
          <input
            type="file"
            accept="image/png, image/jpeg"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleProfilePicChange}
          />
          <img
            className={`profile-picture profile-picture-clickable${isChanged('profile_picture') ? ' settings-input-changed' : ''}`}
            src={user.profile_picture && user.profile_picture.trim() !== '' ? user.profile_picture : defaultProfile}
            alt="Profile"
            onClick={handleProfilePicClick}
            title="Click to change profile picture"
          />
          <div className="profile-info">
            <div className="profile-name">
              {user.username}
              {user.full_name && user.full_name.trim() && (
                <span> a.k.a. {user.full_name}</span>
              )}
            </div>
            <div className="profile-description">"{user.description}"</div>
          </div>
        </div>

        {error && <div className="settings-error">{error}</div>}
        {success && <div className="settings-success success-glow">{success}</div>}
        <form className="settings-inputs" onSubmit={handleSubmit}>
          <label className="settings-label">Username</label>
          <input
            type="text"
            name="username"
            className={`settings-input${isChanged('username') ? ' settings-input-changed' : ''}`}
            value={user.username}
            onChange={handleChange}
          />
          <label className="settings-label">Full Name</label>
          <input
            type="text"
            name="full_name"
            className={`settings-input${isChanged('full_name') ? ' settings-input-changed' : ''}`}
            value={user.full_name}
            onChange={handleChange}
          />
          <label className="settings-label">Email</label>
          <input
            type="email"
            name="email"
            className={`settings-input${isChanged('email') ? ' settings-input-changed' : ''}`}
            value={user.email}
            onChange={handleChange}
          />
          <label className="settings-label">Description</label>
          <input
            type="text"
            name="description"
            className={`settings-input${isChanged('description') ? ' settings-input-changed' : ''}`}
            value={user.description}
            onChange={handleChange}
          />
          <label className="settings-label">Location</label>
          <input
            type="text"
            name="location"
            className={`settings-input${isChanged('location') ? ' settings-input-changed' : ''}`}
            value={user.location}
            onChange={handleChange}
          />
          <label className="settings-label">Website</label>
          <input
            type="text"
            name="website"
            className={`settings-input${isChanged('website') ? ' settings-input-changed' : ''}`}
            value={user.website}
            onChange={handleChange}
          />
          <label className="settings-label">Twitter</label>
          <input
            type="text"
            name="twitter"
            className={`settings-input${isChanged('twitter', true) ? ' settings-input-changed' : ''}`}
            value={user.social_links?.twitter || ''}
            onChange={handleSocialChange}
          />
          <label className="settings-label">GitHub</label>
          <input
            type="text"
            name="github"
            className={`settings-input${isChanged('github', true) ? ' settings-input-changed' : ''}`}
            value={user.social_links?.github || ''}
            onChange={handleSocialChange}
          />
          <label className="settings-label">LinkedIn</label>
          <input
            type="text"
            name="linkedin"
            className={`settings-input${isChanged('linkedin', true) ? ' settings-input-changed' : ''}`}
            value={user.social_links?.linkedin || ''}
            onChange={handleSocialChange}
          />
          <button className="settings-button" type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default SettingsForm;