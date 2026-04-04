
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginStyles } from '../assets/dummyStyles'
import { User } from 'lucide-react'


const Login = ({onLogin, API_URL = "http://localhost:5000/api"}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
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