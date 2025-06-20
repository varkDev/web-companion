import './card.css'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Card() {
    const location = useLocation()
    const path = location.pathname.slice(1)
    const [typed, setTyped] = useState('')

    useEffect(() => {
        setTyped('')
        let i = 0
        const interval = setInterval(() => {
            setTyped(path.slice(0, i + 1))
            i++
            if (i >= path.length) clearInterval(interval)
        }, 60)
        return () => clearInterval(interval)
    }, [path])

    return (
        <div className="terminal-card">
            <div className="terminal-window">
                <p className="terminal-text">
                    Not found: <span className="incorrect-path">/{typed}</span>
                </p>
                <Link to="/home">
                    <button className="terminal-button">Return</button>
                </Link>
            </div>
        </div>
    );
}

export default Card