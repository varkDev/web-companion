import './navbar.css'
import logo from '../../assets/logo/web_companion_tr.png'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for storage changes (e.g., login/logout in another tab)
        const onStorage = () => setIsLoggedIn(!!localStorage.getItem('token'));
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    // Also update state on every render (for SPA navigation)
    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <nav className="card-navbar">
            <Link to="/home">
                <img className="img" src={logo} alt="Logo" />
            </Link>
            <ul>
                {!isLoggedIn && <li><Link to="/login" className="navbar-items">Login</Link></li>}
                {!isLoggedIn && <li><Link to="/register" className="navbar-items">Register</Link></li>}
                {isLoggedIn && <li><button className="navbar-items logout-button" onClick={handleLogout}>Logout</button></li>}
                <li><Link to="/home" className="navbar-items">Home</Link></li>
                {isLoggedIn && <li><Link to="/settings" className="navbar-items"><i className="fa fa-gear"></i></Link></li>}
            </ul>
        </nav>
    );
}

export default Navbar;