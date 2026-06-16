import { serverUrl } from '../App.jsx'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'

function ForgetPassword() {
	// step1-ask for email, 2-otp, 3-new password
	const navigate = useNavigate()
	const [step, setStep] = useState(1)
	const [otp, setOtp] = useState()
	const [email, setEmail] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [newConfirmedPassword, setNewConfirmedPassword] = useState("")
	const [loading, setLoading] = useState(false)

	// for step 1
	const sendOtp = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const result = await axios.post(`${serverUrl}/auth/sendotp`, { email }, { withCredentials: true })

			console.log(result);
			toast.success(result && result.data && result.data.message)
			setStep(2)
		} catch (error) {
			toast.error(error && error.response && result.response.data && error.response.data.message ? error.response.data.message : "Send OTP request not sent")
		}
		setLoading(false);
	}

	// for step 2
	const verifyOtp = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const result = await axios.post(`${serverUrl}/auth/verifyotp`, { email, otp }, { withCredentials: true })

			console.log(result);
			toast.success(result && result.data && result.data.message)
			setStep(3)
		} catch (error) {
			toast.error(error && error.response && result.response.data && error.response.data.message ? error.response.data.message : "Verify OTP request not sent")
		}
		setLoading(false);
	}

	// for step 3
	const resetPassword = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			if(newPassword !== newConfirmedPassword) {
				toast.error("New Passwords don't match")
		setLoading(false);
				return;
			}
			const result = await axios.post(`${serverUrl}/auth/resetPassword`, { email, password: newPassword }, { withCredentials: true })

			console.log(result);
			toast.success(result && result.data && result.data.message)
			navigate("/login")
		} catch (error) {
			toast.error(error && error.response && error.response.data && error.response.data.message ? error.response.data.message : "Reset password request not sent")
		}
		setLoading(false);
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
			{/* step 1 (same structure of all steps) */}
			{step == 1 && <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
				<h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
					Forgot your password?
				</h2>
				<form onSubmit={sendOtp} className='space-y-4'>
					<div>
						<label htmlFor='email' className="block text-sm font-medium text-gray-700">Enter your email address</label>
						<input className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]' type='text' id='email' placeholder='you@example.com' onChange={(e) => setEmail(e.target.value)} value={email} required />
					</div>

					<button className='w-full bg-[black] hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer' disabled={loading}>
						{loading ? <ClipLoader size={30} color='white' /> : "Send OTP"}</button>
				</form>
				<div onClick={() => { navigate("/login") }} className='text-sm text-center mt-4 cursor-pointer'>Back to Login</div>
			</div>}

			{/* step 2 */}
			{step == 2 && <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
				<h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
					Enter OTP
				</h2>
				<form className='space-y-4' onSubmit={verifyOtp}>
					<div>
						<label htmlFor='otp' className="block text-sm font-medium text-gray-700">Please enter the OTP sent to <span className='text-blue-600 border-l-stone-900'>{email}</span></label>
						<input className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]' type='text' id='otp' placeholder='xxxx' onChange={(e) => setOtp(e.target.value)} value={otp} required />
					</div>

					<button className='w-full bg-[black] hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer' disabled={loading}>
						{loading ? <ClipLoader size={30} color='white' /> : "Verify OTP"}
					</button>
				</form>
				<div onClick={() => { navigate("/login") }} className='text-sm text-center mt-4 cursor-pointer'>Back to Login</div>
			</div>}

			{/* step 3 */}
			{step == 3 && <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
				<h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
					Reset your password
				</h2>
				<p className='text-sm text-gray-500 text-center mb-6'>
					Enter a new password to regain access to your account.
				</p>
				<form className='space-y-4' onSubmit={resetPassword}>
					<div>
						<label htmlFor='password' className="block text-sm font-medium text-gray-700">New Password</label>
						<input className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]' type='password' id='password' placeholder='********' onChange={(e) => setNewPassword(e.target.value)} value={newPassword} required />
					</div>
					<div>
						<label htmlFor='confirmedpassword' className="block text-sm font-medium text-gray-700">Confirm new password</label>
						<input className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]' type='password' id='confirmedpassword' placeholder='********' onChange={(e) => setNewConfirmedPassword(e.target.value)} value={newConfirmedPassword} required />
					</div>

					<button className='w-full bg-[black] hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer' disabled={loading}>
						{loading ? <ClipLoader size={30} color='white' /> : "Reset password"}
					</button>
				</form>
				<div onClick={() => { navigate("/login") }} className='text-sm text-center mt-4 cursor-pointer'>Back to Login</div>
			</div>}
		</div>
	)
}

export default ForgetPassword