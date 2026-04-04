import React from 'react'
import { loginStyles } from '../assets/dummyStyles'


const Login = ({onLogin, API_URL = "http://localhost:5000/api"}) => {
  return (
    <div className={loginStyles.pageContainer}>
      <div className={loginStyles.cardContainer}>
        <div className={loginStyles.header}>
          <div className={loginStyles.avatar}>
            <User className=" w-10 h-10 text-white" />
          </div>
          <h1></h1>
        </div>
      </div>
    </div>
  )
}

export default Login