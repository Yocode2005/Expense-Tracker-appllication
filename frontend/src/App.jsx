
import React, { Children, useEffect, useState } from 'react'
import { Navigate, Route, Routes,useLocation,useNavigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'

const API_URL = "http://localhost:5000";

// to get transsaction from loclal storage
const getTransactionsFromStorage = () => {
  const saved  = localStorage.getItem("transactions");
  return saved ? JSON.parse(saved) : [];
}

// to protect the routes
const ProtectedRoutes = ({user,Children}) => {
  const localToken = localStorage.getItem("token");
  const sessionToken = sessionStorage.getItem("token");
  const hasToken = localToken || sessionToken;

  if(!user || !hasToken){
    return <Navigate to="/login" replace />
  }
  return Children;
};

// to scroll to top when page gets reload or new page is visited
const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({top : 0,left : 0, behavior : "auto"});
  },[location.pathname]);
  return null;
};



const App = () => {
  const [user,setUser] = React.useState(null);
  const [token,setToken] = React.useState(null);
  const [transactions,setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // to update user data both in state and storage
  const updateUserData = (updatedUser) => {
    setUser(updatedUser);
     const localToken = localStorage.getItem("token");
  const sessionToken = sessionStorage.getItem("token");

  if(localToken){
    localStorage.setItem('user',JSON.stringify(updatedUser));
  } else if (sessionToken){
    sessionStorage.setItem("user",JSON.stringify(updatedUser));
  }
  };

  //  try to load user with token when mounted
  useEffect(() => {
    (async () => {
      try {
      const localUserRaw = localStorage.getItem("user");
      const sessionUserRaw = sessionStorage.getItem("user");
      const localToken = localStorage.getItem("token");
      const sessionToken = sessionStorage.getItem("token");

      const storedUser = localUserRaw ? JSON.parse(localUserRaw) : sessionUserRaw ? JSON.parse(sessionUserRaw) : null;
      const storedToken = localToken || sessionToken || null;
      const tokenFromLocal = !!localToken;

      if(storedUser){
        setUser(storedUser);
        setToken(storedToken);
        setIsLoading(false);
        return;
      }
      if(storedToken){
        try {
          const res = await axios.get(`${API_URI}/api/users/me`,{
            headers : {Authorization : `Bearer ${storedToken}`}
          });
          const profile = res.data;
          persistAuth(profile,storedToken,tokenFromLocal);
        } catch (fetchErr) {
          console.warn("Could not fetch profile with the stored token",fetchErr);
          clearAuth();
        }
      }
    } catch (error) {
      console.error("error bootstrapping auth : ",error);
    } finally{
      setIsLoading(false);
      try {
        setTransactions(getTransactionsFromStorage());
      } catch (txErr) {
        console.error("Error loading transactions : ",txErr);
      }
    }
    })();
  },[]);

  useEffect(() => {
    try {
      
    } catch (error) {
      
    }
  })
 


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