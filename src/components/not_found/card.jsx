import './card.css'
import { Link, useLocation } from 'react-router-dom'

function Card() {
    const location = useLocation()
    const path = location.pathname.slice(1)

    return (
        <div className="terminal-card">
            <div className="terminal-window">
                <p className="terminal-text">
                    Not found: {<span className="incorrect-path"> /{path}</span>}
                </p>
                <Link to="/home">
                    <button className="terminal-button">Return</button>
                </Link>
            </div>
        </div>
    );
}

export default Card