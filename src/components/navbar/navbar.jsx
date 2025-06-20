import './navbar.css'
import logo from '../../assets/logo/web_companion_tr.png'
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav className="card-navbar">
            <Link to="/home">
                <img className="img" src={logo} alt="Logo" />
            </Link>
            <ul>
                <li><Link to="/home" className="navbar-items">Home</Link></li>
                <li><Link to="/login" className="navbar-items">Login</Link></li>
                <li><Link to="/register" className="navbar-items">Register</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar
