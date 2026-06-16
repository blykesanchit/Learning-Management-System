import { serverUrl } from '../App.jsx'
import axios from 'axios'
import Loading from '../components/Loading.jsx'
import React, { useEffect, useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function MyEnrolledCourses() {
	const navigate = useNavigate()

	const { userData } = useSelector(state => state.user)
	const [enrolledCoursesData, setEnrolledCoursesData] = useState([])
	const [loading, setLoading] = useState(false)

	// get full course data from course_id present in userData
	useEffect(() => {
		const getEnrolledCoursesData = async () => {
			// if there are no enrolled courses, reset state and skip fetching
			if (!userData?.enrolledCourses?.length) {
				setEnrolledCoursesData([])
				return
			}

			setLoading(true)
			try {
				// fetch all courses concurrently and wait for all to complete
				const ids = userData.enrolledCourses
				const requests = ids.map(id => axios.get(`${serverUrl}/course/getcoursebyid/${id}`))
				const results = await Promise.all(requests)

				// extract course objects and filter out any missing responses
				const courses = results.map(r => r?.data?.course).filter(Boolean)
				setEnrolledCoursesData(courses)
			} catch (error) {
				console.log('error', error)
				toast.error(`Error fetching enrolled courses - ${error?.message || error}`)
			} finally {
				setLoading(false)
			}
		}

		getEnrolledCoursesData()
	}, [userData?.enrolledCourses])

	useEffect(() => {
		console.log('aa', enrolledCoursesData);
	}, [enrolledCoursesData])



	return loading ? <Loading /> : (
		<div className='min-h-screen w-full px-4 py-9 bg-gray-50'>
			<button
				onClick={() => navigate(`/`)}
				className='p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center'
				aria-label='Go back'
				type='button'>
				<FaArrowLeftLong className='h-[20px] w-[20px] text-black' />
			</button>
			<h1 className="text-3xl text-center font-bold text-gray-800 mb-6 ">
				My Enrolled Courses
			</h1>

			{
				enrolledCoursesData.length === 0 ? (
					<p className="text-gray-500 text-center w-full">You haven’t enrolled in any course yet.</p>
				) : (
					<div className='flex items-center justify-center flex-wrap gap-[30px]'>
						{enrolledCoursesData.map((course, idx) => {
							return <div
								key={idx} className="bg-white rounded-2xl shadow-md overflow-hidden border w-2xs">
								<img
									src={course.thumbnailUrl}
									alt={course.title}
									className="w-full h-40 object-cover" />
								<div className="p-4">
									<h2 className="text-lg font-semibold text-gray-800">
										{course.title}
									</h2>
									<p className="text-sm text-gray-600 mb-2">
										{course.category}
									</p>
									<p className="text-sm text-gray-700">
										{course.level}
									</p>
									<h1 className='px-[10px] text-center  py-[10px] border-2  bg-black border-black text-white  rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer mt-[10px] hover:bg-gray-600' onClick={() => { navigate(`/viewlecture/${course._id}`) }}>
										Watch Now
									</h1>
								</div>
							</div>
						})}
					</div>
				)
			}
		</div>
	)
}

export default MyEnrolledCourses