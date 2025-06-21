import Navbar from './components/navbar/navbar.jsx'
import { Home, RegisterForm, Login, NotFound } from './pages'
import { Routes, Route, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet/>
    </>
  )
}

function App() {

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element= {<Home/>} />
          <Route path="/login" element={<Login />} />          <Route path="/register" element={<RegisterForm />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
} 

export default App
