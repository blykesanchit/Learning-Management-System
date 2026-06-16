import { serverUrl } from '../../App.jsx'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaEdit } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setLectureData, setLoading } from '../../redux/lectureSlice.js'
import { ClipLoader } from 'react-spinners'
import Loading from '../../components/Loading.jsx'
import useGetCourseLectures from '../../customHooks/useGetCourseLectures.js'

function CreateLecture() {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { course_id } = useParams("course_id")
	const { lectureData, loading } = useSelector(state => state.lecture)
	const [lectureCreateRequesting, setLectureCreateRequesting] = useState(false)
	const [lectureTitle, setLectureTitle] = useState("")
	console.log('page course_id', course_id);
	
	useGetCourseLectures(course_id)

	const handleCreateLecture = async () => {
		setLectureCreateRequesting(true)
		try {
			const result = await axios.post(`${serverUrl}/course/createlecture/${course_id}`, { lectureTitle }, { withCredentials: true });

			dispatch(setLectureData([...lectureData, result.data.lecture]))

			toast.success("Created lecture successfully.")
		} catch (error) {
			toast.error(`failed to create lecture. error - ${error}`)
		} finally {
			setLectureCreateRequesting(false)
		}
	}


	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			{loading ? <Loading /> :
				<div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-6">
					{/* Header */}
					<div className="mb-6">
						<h1 className="text-2xl font-semibold text-gray-800 mb-1">Let’s Add a Lecture</h1>
						<p className="text-sm text-gray-500">Enter the title and add your video lectures to enhance your course content.</p>
					</div>

					{/* Input */}
					<input
						type="text"
						placeholder="e.g. Introduction to Mern Stack"
						className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4" value={lectureTitle} required onChange={(e) => { setLectureTitle(e.target.value) }} />

					{/* Buttons */}
					<div className="flex gap-4 mb-6">
						<button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-medium" disabled={lectureCreateRequesting} onClick={() => navigate(`/editcourse/${course_id}`)}>
							<FaArrowLeft /> Back to Course
						</button>

						<button className="px-5 py-2 rounded-md bg-[black] text-white hover:bg-gray-600 transition-all text-sm font-medium shadow" disabled={lectureCreateRequesting} onClick={handleCreateLecture}>
							{lectureCreateRequesting ? <ClipLoader size={30} color='white' /> : "+ Create Lecture"}
						</button>
					</div>

					{/* Lecture List */}
					<div className="space-y-2">
						{lectureData && lectureData.map((lecture, index) => (
							<div key={index} className="bg-gray-100 rounded-md flex justify-between items-center p-3 text-sm font-medium text-gray-700">
								<span>Lecture - {index + 1}: {lecture.lectureTitle}</span>
								<FaEdit className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => navigate(`/editlecture/${course_id}/${lecture._id}`)} />
							</div>
						))}
					</div>
				</div>}
		</div>
	)
}

export default CreateLecture