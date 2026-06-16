import { serverUrl } from '../App.jsx'
import React, { useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setUserData } from '../redux/userSlice.js'
import axios from 'axios'
import { ClipLoader } from 'react-spinners'

function EditProfile() {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const { userData } = useSelector(state => state.user)

	const [name, setName] = useState(userData.name)
	const [description, setDescription] = useState(userData.description)
	const [photoUrl, setPhotoUrl] = useState(null)
	const [loading, setLoading] = useState(false)

	// The FormData interface provides a way to construct a set of key/value pairs representing form fields and their values, which can be sent using the Window/fetch, 
	const formData = new FormData()
	formData.append("name", name)
	formData.append("description", description)
	formData.append("photoUrl", photoUrl)

	const handleEditProfile = async (e) => {
		e.preventDefault();
		setLoading(true)
		try {
			const result = await axios.post(`${serverUrl}/user/updateprofile`, formData, { withCredentials: true })
			dispatch(setUserData(result.data.user))

			toast.success(result.data.message)
			navigate("/")
		} catch (error) {
			console.log(error);
			toast.error(error.response && error.response.data && error.response.data.message ? error.response.data.message : "Failed to request for update profile")
		}
		setLoading(false)
	}

	return (
		// similar to profile page(structure) just 4 input instead of name email role
		// - avatar upload File, change name, email(nonchangeable), change description
		<div className='min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10'>
			<div className='bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full relative'>
				<button
					onClick={() => { navigate("/myprofile") }}
					className='absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition flex items-center justify-center'
					aria-label='Go back'
				>
					<FaArrowLeftLong className='w-5 h-5 text-black' />
				</button>

				<h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit Profile</h2>

				{/* many things in this form */}
				<form className="space-y-5">

					{/* photo */}
					<div className='flex flex-col items-center text-center'>
						{userData?.photoUrl ?
							<img src={userData?.photoUrl} className='w-24 h-24 rounded-full object-cover border-4 border-[black]' alt='user photo' />
							:
							<div className='w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-black  border-white cursor-pointer'>
								{userData?.name.slice(0, 1).toUpperCase()}
							</div>}
					</div>

					{/* select avatar */}
					<div>
						<label className='text-sm font-medium text-gray-700' htmlFor='image'>Select Avatar</label>
						<input onChange={(e) => {
							setPhotoUrl(e.target.files[0])
						}} className='w-full px-4 py-2 border rounded-md text-sm' name='photoUrl' id='image' type="file" placeholder='Photo URL' accept='image/*' />
						{/* will only show images */}
					</div>

					{/* name */}
					<div>
						<label className='text-sm font-medium text-gray-700' htmlFor='name'>Name</label>
						<input className='w-full px-4 py-2 border rounded-md text-sm' id='name' type="text" placeholder={name} value={name} onChange={(e) => { setName(e.target.value) }} />
					</div>

					{/* email */}
					<div>
						<label className='text-sm font-medium text-gray-700'>Email</label>
						<input className='w-full px-4 py-2 border rounded-md text-sm' id='email' readOnly type="text" value={userData.email} />
					</div>

					{/* Description */}
					<div>
						<label htmlFor='description' className='text-sm font-medium text-gray-700'>Bio</label>
						<textarea className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-[black]' id='description' type="text" value={description} placeholder='Tell us about yourself' onChange={(e) => {
							setDescription(e.target.value)
						}} />
					</div>

					{/* button */}
					<button className='w-full bg-[black] active:bg-[#454545] text-white py-2 rounded-md font-medium transition cursor-pointer hover:bg-gray-700' disabled={loading} onClick={handleEditProfile} >
						{loading ? <ClipLoader size={30} color='white' /> : "Save Changes"}
					</button>



				</form>
			</div>
		</div>
	)
}

export default EditProfile