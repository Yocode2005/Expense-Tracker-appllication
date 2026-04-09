
import { useState } from 'react' // import useState for managing form state and other states in the component
import { useNavigate } from 'react-router-dom' // import useNavigate for navigation after login
import { loginStyles } from '../assets/dummyStyles' // import styles for login component
import { User } from 'lucide-react' // import User icon from lucide-react
import axios from 'axios' // import axios for API calls


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
const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/api/user/login`,{email,password},{headers: {"Content-Type": "application/json"}},);
      const data = res.data || {};
      const token = data.token || null;

      // to derive user profile
      let profile = data.user ?? null;
      if(!profile){
        const copy = {...data};
        delete copy.token;
        delete copy.user;

        if(Object.keys(copy).length){
          profile = copy;
        }
      }
      if(!profile && token){
        
      }
    } catch (error) {
      
    }
}

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