
import React, { useState } from 'react'
import { Route, Routes,useNavigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './components/Login.jsx'

const App = () => {
  const [user,setUser] = React.useState(null);
  const [token,setToken] = React.useState(null);
  const navigate = useNavigate();

  const clearAuth = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
    setUser(null);
    setToken(null);
  }

  const handleLogin = (userData,remember = false, tokenFromApi = null) => {
    presisAuth(userData, tokenFromApi, remember);
    navigate("/");
  }

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  }
  return (
   <>
   <Routes>

      <Route path='/login' element={<Login onLogin={handleLogin} />} />

      <Route element={<Layout />}>
        <Route path='/' element={<Dashboard />} />
      </Route>
   </Routes>
   </>
  )
}

export default App