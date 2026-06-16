import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'
import axios from "axios"
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import logo from '../assets/logo.jpg'
import google from '../assets/google.jpg'

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdRemoveRedEye } from "react-icons/md";

import { serverUrl } from "../App.jsx"
import { setUserData } from '../redux/userSlice.js';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/firebase';

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const googleAuth = async (req, res, next) => {
    setLoading(true)
    try {
      const response = await signInWithPopup(auth, provider)
      console.log(response);
      let guser = response.user
      let name = guser.displayName
      let email = guser.email
      let photoUrl = guser.photoURL

      const result = await axios.post(`${serverUrl}/auth/googleauth`, { gname: name, gemail: email, photoUrl }, { withCredentials: true })

      console.log(result, 'gauth');

      dispatch(setUserData(result.data.user))

      navigate("/")
      toast.success("Google authentication successful!")
    } catch (error) {
      console.log(error);
      toast.error(error.response && error.response.data && error.response.data.message ? error.response.data.message : "Continue with Google failed");
    }
    setLoading(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/auth/login`, {
        email, password
      }, { withCredentials: true });
      console.log(result);
      dispatch(setUserData(result.data.user))
      navigate("/")
      setLoading(false);

      toast.success("Login successful!")
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response && error.response.message && error.response.data.message ? error.response.data.message : "Login failed");
    }
  }

  return (
    <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
      <form className='w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex'>

        {/* left div */}
        <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3 '>
          {/* heading */}
          <div>
            <h1 className='font-semibold text-[black] text-2xl'>Welcome back</h1>
            <h2 className='text-[#999797] text-[18px]'>Login to your account</h2>
          </div>

          {/* email */}
          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
            <label htmlFor="email" className='font-semibold'>
              Email
            </label>
            <input id='email' type="text" className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]' placeholder='Your email' onChange={(e) => setEmail(e.target.value)} value={email} />
          </div>

          {/* password */}
          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3 
          relative'>
            <label htmlFor="password" className='font-semibold'>
              Password
            </label>
            <input id='password' type={showPassword === true ? "text" : "password"} className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]' placeholder='Your password' onChange={(e) => setPassword(e.target.value)} value={password} />

            {/* show or hide pw icon */}
            {!showPassword && <MdOutlineRemoveRedEye className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={() => setShowPassword(prev => !prev)} />}
            {showPassword && <MdRemoveRedEye className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={() => setShowPassword(prev => !prev)} />}
          </div>

          {/* button */}
          <button className='w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]' onClick={handleLogin} disabled={loading}>
            {
              loading ? <ClipLoader size={30} color='white' /> : "Login"
            }
          </button>
          <span className='text-[13px] cursor-pointer text-[#585757]' onClick={() => navigate("/forgotpassword")}>Forget your password?</span>

          {/* or continue with */}
          <div className='w-[80%] flex items-center gap-2'>
            <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
            <div className='w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center '>Or continue with</div>
            <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
          </div>

          {/* with google */}
          <div className='w-[80%] h-[40px] border-1 border-[black] rounded-[5px] flex items-center justify-center cursor-pointer' disabled={loading} onClick={googleAuth}>
            <img src={google} alt="" className='w-[25px]' />
            {loading ? <ClipLoader size={30} color='black' /> : <span className='text-[18px] text-gray-500'>Google</span>}

          </div>

          {/* or signup */}
          <div className='text-[#6f6f6f]'>
            Don't have an account? <span className='underline underline-offset-1 text-[black]'><Link to={"/signup"}> Sign up</Link></span>
          </div>
        </div>


        {/* right div */}
        <div className='w-[50%] h-[100%] rounded-r-2xl bg-[black] md:flex items-center justify-center flex-col hidden'>
          <img src={logo} className='w-30 shadow-2xl' alt="" />
          <span className='text-[white] text-2xl'>VIRTUAL COURSES</span>
        </div>
      </form>
    </div>
  )
}

export default Login