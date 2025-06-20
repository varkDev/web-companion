import './form.css'
import { useState, useEffect } from 'react'
import createEmptyUser from '../../models/user.js'

function Form(){

  const [typed, setTyped] = useState('')

  const title = "Register"

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

  const [user, setUser] = useState(createEmptyUser());

  return (
        <div className="register-form">
          <div className="register-card">
            <h1 className="register-title">{typed}</h1>
            <form className="register-inputs">
                
                <label className="register-label">Username</label>
                  <input type="text" placeholder="Username" className="register-input" />
                
                <label className="register-label">Email</label>
                  <input type="email" placeholder="Email" className="register-input" />
                
                <label className="register-label">Password</label>
                  <input type="password" placeholder="Password" className="register-input" />
                
                <button type="submit" className="register-button">Submit</button>
            
            </form>
          </div>
        </div>
    )
}

export default Form;