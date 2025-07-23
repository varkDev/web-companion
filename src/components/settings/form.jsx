import { useState, useEffect } from 'react';
import './form.css';
import { fetchMe, updateUser } from '../../api/userApi';
import createEmptyUser from '../../models/user.js';

function SettingsForm() {
  const [user, setUser] = useState(createEmptyUser());
  const [typed, setTyped] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const title = "Settings";

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
      .then(data => setUser(data))
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

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h1 className="settings-title">{typed}</h1>
        {error && <div className="settings-error">{error}</div>}
        {success && <div className="settings-success success-glow">{success}</div>}
        <form className="settings-inputs" onSubmit={handleSubmit}>
          <label className="settings-label">Username</label>
          <input
            type="text"
            name="username"
            className="settings-input"
            value={user.username}
            onChange={handleChange}
          />
          <label className="settings-label">Full Name</label>
          <input
            type="text"
            name="full_name"
            className="settings-input"
            value={user.full_name}
            onChange={handleChange}
          />
          <label className="settings-label">Email</label>
          <input
            type="email"
            name="email"
            className="settings-input"
            value={user.email}
            onChange={handleChange}
          />
          <label className="settings-label">Description</label>
          <input
            type="text"
            name="description"
            className="settings-input"
            value={user.description}
            onChange={handleChange}
          />
          <label className="settings-label">Location</label>
          <input
            type="text"
            name="location"
            className="settings-input"
            value={user.location}
            onChange={handleChange}
          />
          <label className="settings-label">Website</label>
          <input
            type="text"
            name="website"
            className="settings-input"
            value={user.website}
            onChange={handleChange}
          />
          <label className="settings-label">Twitter</label>
          <input
            type="text"
            name="twitter"
            className="settings-input"
            value={user.social_links?.twitter || ''}
            onChange={handleSocialChange}
          />
          <label className="settings-label">GitHub</label>
          <input
            type="text"
            name="github"
            className="settings-input"
            value={user.social_links?.github || ''}
            onChange={handleSocialChange}
          />
          <label className="settings-label">LinkedIn</label>
          <input
            type="text"
            name="linkedin"
            className="settings-input"
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