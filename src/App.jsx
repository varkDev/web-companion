import Navbar from './components/navbar/navbar.jsx'
import { Home } from './pages'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/home" element= {<Home/>} />
      </Routes>
    </>
  )
} 

export default App
