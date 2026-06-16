import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
import logo from '../assets/logo.jpg'
import google from '../assets/google.jpg'
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdRemoveRedEye } from "react-icons/md";
import { ClipLoader } from 'react-spinners'
import axios from "axios"
import { serverUrl } from "../App.jsx"
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/firebase';

function SignUp() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
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

      const result = await axios.post(`${serverUrl}/auth/googleauth`, { gname: name, gemail: email, role: role, photoUrl }, { withCredentials: true })

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

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/auth/signup`, {
        name, email, password, role
      }, { withCredentials: true });
      console.log(result);

      dispatch(setUserData(result.data.user))

      navigate("/")

      toast.success("Signup successful!")
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message ? error.response.data.message : "Signup failed");
    }
    setLoading(false);
  }

  return (
    <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
      <form className='w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex'>

        {/* left div */}
        <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3 '>
          {/* heading */}
          <div>
            <h1 className='font-semibold text-[black] text-2xl'>Let's get Started</h1>
            <h2 className='text-[#999797] text-[18px]'>Create your account</h2>
          </div>

          {/* name */}
          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
            <label htmlFor="name" className='font-semibold'>
              Name
            </label>
            <input required id='name' type="text" className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]' placeholder='Your name' onChange={(e) => setName(e.target.value)} value={name} />
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

          {/* role */}
          <div className='flex md:w-[50%] w-[70%] items-center justify-between'>
            <span className={`px-[10px] py-[5px] border-[1px] border-[#e7e6e6] rounded-2xl  cursor-pointer hover:border-gray-400 ${role === 'student' ? "border-black" : "border-[#646464]"}`} onClick={() => setRole("student")}>Student</span>
            <span className={`px-[10px] py-[5px] border-[1px] border-[#e7e6e6] rounded-2xl  cursor-pointer hover:border-gray-400 ${role === 'educator' ? "border-black" : "border-[#646464]"}`} onClick={() => setRole("educator")}>Educator</span>
          </div>

          {/* button */}
          <button className='w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]' onClick={handleSignup} disabled={loading}>
            {loading ? <ClipLoader size={30} color='white' /> : "Sign up"}
          </button>

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

          {/* or login */}
          <div className='text-[#6f6f6f]'>
            Already have an account? <span className='underline underline-offset-1 text-[black]'><Link to={"/login"}> Login</Link></span>
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

export default SignUp