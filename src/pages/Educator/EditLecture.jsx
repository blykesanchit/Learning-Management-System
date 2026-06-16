import Loading from '../../components/Loading.jsx'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { setLectureData, setLoading } from '../../redux/lectureSlice.js'
import axios from 'axios'
import { serverUrl } from '../../App.jsx'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import useGetCourseLectures from '../../customHooks/useGetCourseLectures.js'

function EditLecture() {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { course_id, lecture_id } = useParams()
	const { lectureData, loading } = useSelector(state => state.lecture)

	const [selectedLecture, setSelectedLecture] = useState({})
	useGetCourseLectures(course_id, false)

	useEffect(() => {
		dispatch(setLoading(true))
		setSelectedLecture(lectureData.find(lecture => lecture._id === lecture_id))
		setLectureTitle(selectedLecture?.lectureTitle)
		setIsPreviewFree(selectedLecture?.isPreviewFree)
		dispatch(setLoading(false))
	}, [lectureData])


	const [videoUrl, setVideoUrl] = useState(null)
	const [lectureTitle, setLectureTitle] = useState(selectedLecture?.lectureTitle || "")
	const [isPreviewFree, setIsPreviewFree] = useState(selectedLecture?.isPreviewFree || false)

	const [requestingLectureUpdate, setRequestingLectureUpdate] = useState(false)


	const formData = new FormData()
	formData.append("lectureTitle", lectureTitle)
	formData.append("videoUrl", videoUrl)
	formData.append("isPreviewFree", isPreviewFree)

	const updateHandler = async (e) => {
		e.preventDefault();
		setRequestingLectureUpdate(true)
		try {
			console.log(videoUrl);
			const result = await axios.post(`${serverUrl}/course/editlecture/${lecture_id}`, formData, { withCredentials: true })
			dispatch(setLectureData([...lectureData, result.data.lecture]))
			toast.success(result.data.message)
			navigate(`/createlecture/${course_id}`)
		} catch (error) {
			toast.error(error.responce && error.responce.data.message ? error.responce.data.message : `error updating lecture - ${error}`)
		} finally {
			setRequestingLectureUpdate(false)
		}
	}

	const removeHandler = async (e) => {
		e.preventDefault();
		setRequestingLectureUpdate(true)
		try {
			const result = await axios.get(`${serverUrl}/course/removelecture/${lecture_id}`, { withCredentials: true })
			toast.success(result.data.message)
			navigate(`/createlecture/${course_id}`)
		} catch (error) {
			toast.error(error.responce && error.responce.data.message ? error.responce.data.message : `error updating lecture - ${error}`)
		} finally {
			setRequestingLectureUpdate(false)
		}
	}

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			{/* this below div is a box like all the boxes we've seen in create course edit create lecture dashboard profile etc */}
			{loading ? <Loading /> :
				<div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6">

					{/* Header Inside Box */}
					<div className="flex items-center justify-center gap-[20px]  flex-col md:flex-row mb-6 relative">
						<button onClick={() => navigate(`/createlecture/${course_id}`)}
							className='w-[35px] relative sm:absolute top-[10%] left-[0%] h-[35px] bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition flex items-center justify-center'
							aria-label='Go back'>
							<FaArrowLeftLong className='w-5 h-5 text-black' />
						</button>
						<h2 className="text-2xl font-semibold md:pl-[60px]">Update Your Lecture</h2>
					</div>

					{/* Instruction */}
					<div>
						<button className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all text-sm" disabled={requestingLectureUpdate} onClick={removeHandler}>
							Remove Lecture
						</button>
					</div>

					{/* Input Fields */}
					<div className="space-y-4">
						{/* title */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
							<input
								onChange={(e) => { setLectureTitle(e.target.value) }}
								value={lectureTitle}
								required
								type="text"
								className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[black]focus:outline-none"
							/>
						</div>

						{/* video url */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Video *</label>
							<input
								type="file"
								required
								accept='video/*'
								className="w-full border border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-700 file:text-[white] hover:file:bg-gray-500"
								onChange={(e) => setVideoUrl(e.target.files[0])}
							/>
						</div>

						{/* Toggle free or paid */}
						<div className="flex items-center gap-3">
							<input
								id='isFree'
								checked={isPreviewFree}
								onChange={(e) => setIsPreviewFree(prev => !prev)}
								type="checkbox" className="accent-[black] h-4 w-4" />
							<label htmlFor="isFree" className="text-sm text-gray-700">Is this video FREE?</label>
						</div>

						<div>
							{requestingLectureUpdate && videoUrl ? <p>Uploading video... Please wait.</p> : ""}
						</div>


						{/* Submit Button */}
						<div className="pt-4">
							<button className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-700 transition" disabled={loading} onClick={updateHandler}>
								{requestingLectureUpdate ? <ClipLoader size={30} color='white' /> : "Update Lecture"}
							</button>
						</div>
					</div>
				</div>
			}
		</div>
	)
}

export default EditLecture