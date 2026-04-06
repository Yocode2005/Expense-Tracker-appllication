
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginStyles } from '../assets/dummyStyles'
import { User } from 'lucide-react'
import axios from 'axios'


const Login = ({onLogin, API_URL = "http://localhost:5000/api"}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // to fetch profile
  const fetchProfile  = async (token) => {
    if(!token) return null;
    const res = await axios.get(`${API_URL}/api/user/me`,{
      headers :{Authorization: `Bearer ${token}`}
    });
    return res.data;
  };

  const persistAuth = (profile, token) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    try {
      if(token) storage.setItem("token", token);
      if(profile) storage.setItem("user",JSON.stringify(profile)); 
    } catch (error) {
      console.error("Storage Error :", error);
    }
  }

// to login


  return (
    <div className={loginStyles.pageContainer}>
      <div className={loginStyles.cardContainer}>
        <div className={loginStyles.header}>
          <div className={loginStyles.avatar}>
            <User className=" w-10 h-10 text-white" />
          </div>
          <h1 className={loginStyles.headerTitle}>Welcome Back</h1>
          <p className={loginStyles.headerSubtitle}>Sign in to your ExpenseTracker account</p>
        </div>
      </div>
    </div>
  )
}

export default Login