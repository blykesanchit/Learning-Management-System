import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";
import Loading from '../components/Loading.jsx';

function Profile() {
	const navigate = useNavigate()
	const { userData, loading } = useSelector(state => state.user)

	// if (loading) {
	// 	return <Loading />
	// }

	return (
		<div className='min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center'>

			{/* this now below is main div */}
			<div className='bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full relative'>
				<button
					onClick={() => { navigate("/") }}
					className='absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition flex items-center justify-center'
					aria-label='Go back'
				>
					<FaArrowLeftLong className='w-5 h-5 text-black' />
				</button>
				
				{/* many things in this div */}
				<div className='flex flex-col items-center text-center'>
					{/* photo */}
					{userData?.photoUrl ?
						<img src={userData?.photoUrl} className='w-24 h-24 rounded-full object-cover border-4 border-[black]' alt='user photo' />
						:
						<div className='w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-black  border-white cursor-pointer'>
							{userData?.name.slice(0, 1).toUpperCase()}
						</div>}

					{/* name */}
					<h2 className='text-2xl font-bold mt-4 text-gray-800'>
						{userData.name}
					</h2>

					{/* role */}
					<p className='text-sm text-gray-500'>
						{userData.role}
					</p>

					{/* more detailed info like bio, email, no of enrolled course */}
					<div className='mt-4 space-y-4'>
						{/* email */}
						<div>
							<span className='font-semibold text-gray-700'>Email: </span>
							<span>{userData.email}</span>
						</div>

						{/* bio */}
						<div>
							<span className='font-semibold text-gray-700'>Bio: </span>
							<span>{userData.description}</span>
						</div>

						{/* no of enrolled courses */}
						<div>
							<span className='font-semibold text-gray-700'>Enrolled Courses: </span>
							<span>{userData.enrolledCourses ? userData?.enrolledCourses.length : 0}</span>
						</div>
					</div>

					<div className='mt-6 flex justify-center gap-4' onClick={() => { navigate("/editprofile") }}>
						<button className='px-5 py-2 rounded bg-[black] text-white active:bg-[#4b4b4b] cursor-pointer transition'>
							Edit Profile
						</button>
					</div>


				</div>
			</div>

		</div>
	)
}

export default Profile