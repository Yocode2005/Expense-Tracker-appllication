import React, { useCallback, useEffect, useState } from 'react'
import { profileStyles } from '../assets/dummyStyles'
import Modal from "react-modal";
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = "http://localhost:5000/api";
Modal.setAppElement('#root');
// Move PasswordInput component outside of ProfilePage to prevent recreation on every render
const PasswordInput = memo(({ name, label, value, error, showField, onToggle, onChange, disabled }) => (
  <div>
    <label className={profileStyles.passwordLabel}>
      {label}
    </label>
    <div className={profileStyles.passwordContainer}>
      <input
        type={showField ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className={`${profileStyles.inputWithError} ${
          error ? 'border-red-300' : 'border-gray-200'
        }`}
        placeholder={`Enter ${label.toLowerCase()}`}
        disabled={disabled}
        // Add key prop to help React identify the input
        key={`password-input-${name}`}
      />
      <button
        type="button"
        onClick={onToggle}
        className={profileStyles.passwordToggle}
        disabled={disabled}
      >
        {showField ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
    {error && (
      <p className={profileStyles.errorText}>{error}</p>
    )}
  </div>
));

PasswordInput.displayName = 'PasswordInput';

const Profile = ({user: onUpdateProfile, onLogout}) => {
    const navigate = useNavigate();
  const [user, setUser] = useState({ 
    name: '', 
    email: '',
    joinDate: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState({ ...user });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const getAuthToken = useCallback(() => localStorage.getItem("token") || sessionStorage.getItem("token"),[]);

  // API request
  const handleApiRequest = useCallback(async(method,getEndPoints,data = null) => {
    const token = getAuthToken();
    if(!token){
        navigate("/login");
        return null;
    }

    try {
        setLoading(true);
        const config = {
            method,
            url : `${BASE_URL}${endpoint}`,
            headers : {Authorization : `Bearer ${token}`},
        };
        if(data) config.data = data;
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error(`${method} request error : `,error);
        if(error.response?.status === 401){
            navigate("/login");
        }
        throw error;
    } finally {
        setLoading(false);
    }
  },[getAuthToken,navigate],)

  // to fetch current user 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await handleApiRequest("get","/user/me");
      } catch (error) {
        
      }
    }
  })
  return (
    <div>Profile</div>
  )
}

export default Profile