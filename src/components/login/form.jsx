import { useState, useEffect } from 'react';
import { loginUser } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';
import './form.css';

function LoginForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: '', password: '' });
  const [typed, setTyped] = useState('')
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const title = "Login";

  useEffect(() => {
    setTyped('')
    let i = 0
    const interval = setInterval(() => {
      setTyped(title.slice(0, i + 1))
      i++
      if (i >= title.length) clearInterval(interval)
    }, 60) 
    return () => clearInterval(interval)
  }, [title])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(user);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store JWT token to localStorage
        setSuccess('Login successful!');
        navigate('/home'); // Redirect to home page or dashboard  
        setError('');
        // Optionally: save user info/token, redirect, etc.
        console.log('Logged in:', data.user);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed');
        setSuccess('');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      setSuccess('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">{typed}</h1>
        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="login-input"
            value={user.email}
            onChange={handleChange}
            required
          />
          <label className="login-label">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="login-input"
            value={user.password}
            onChange={handleChange}
            required
          />
          <button className="login-button" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;