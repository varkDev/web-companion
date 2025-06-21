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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User registered:', user);
    setUser(createEmptyUser());
  }

  return (
        <div className="register-form">
          <div className="register-card">
            <h1 className="register-title">{typed}</h1>
            <form className="register-inputs" onSubmit={handleSubmit}>
                
                <label className="register-label">Username</label>
                  <input 
                  type="text" 
                  name="username"
                  placeholder="Username" 
                  className="register-input" 
                  value={user.username}
                  onChange={handleChange}
                  />
                
                <label className="register-label">Email</label>
                  <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  className="register-input" 
                  value={user.email}
                  onChange={handleChange}
                  />
                
                <label className="register-label">Password</label>
                  <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  className="register-input"
                  value={user.password}
                  onChange={handleChange}
                  />
                
                <button className="register-button" type="submit">Submit</button>
            
            </form>
          </div>
        </div>
    )
}

export default Form;