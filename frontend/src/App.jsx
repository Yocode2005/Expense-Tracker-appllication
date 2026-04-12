
import React, { useState } from 'react'
import { Route, Routes,useNavigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'

const App = () => {
  const [user,setUser] = React.useState(null);
  const [token,setToken] = React.useState(null);
  const navigate = useNavigate();

// to save the token and user data in local storage or session storage based on remember me option
   const persistAuth = (userObj, tokenStr, remember = false) => {
    try {
      if (remember) {
        if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
        if (tokenStr) localStorage.setItem("token", tokenStr);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      } else {
        if (userObj) sessionStorage.setItem("user", JSON.stringify(userObj));
        if (tokenStr) sessionStorage.setItem("token", tokenStr);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
      setUser(userObj || null);
      setToken(tokenStr || null);
    } catch (err) {
      console.error("persistAuth error:", err);
    }
  };


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
    persistAuth(userData, tokenFromApi, remember);
    navigate("/");
  }

  const handleSignup = (userData, remember = false, tokenFromApi = null) => {
    persistAuth(userData, tokenFromApi, remember);
    navigate("/");
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  }
  return (
   <>
   <Routes>

      <Route path='/login' element={<Login onLogin={handleLogin} />} />
      <Route path='/signup' element={<Signup onSignup={handleSignup} />} />

      <Route element={<Layout  user={user} onLogout={handleLogout}/>}>
        <Route path='/' element={<Dashboard />} />
      </Route>
   </Routes>
   </>
  )
}

export default App