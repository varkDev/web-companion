import './navbar.css'
import logo from '../../assets/logo/web_companion_tr.png'

function Navbar(){
    return(
        <nav className="card-navbar">
            <img class="img" src={logo} alt="Logo"/>
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Login</a></li>
                <li><a href="#">Register</a></li>
            </ul>
        </nav>  
    );
}

export default Navbar