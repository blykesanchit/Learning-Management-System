import React, { useEffect, useState } from 'react'
import { FaArrowLeftLong, FaStar } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import img from "../assets/empty.jpg"
import { setLoading } from '../redux/courseSlice.js'
import Loading from '../components/Loading.jsx'
import { FaLock, FaPlayCircle } from 'react-icons/fa'
import useGetCourseLectures from '../customHooks/useGetCourseLectures.js'
import { setLectureData } from '../redux/lectureSlice.js'
import axios from 'axios'
import { serverUrl } from '../App.jsx'
import useGetCreatorCourseData from '../customHooks/useGetCreatorCourseData.js'
import CourseCard from '../components/Card.jsx'
import { toast } from 'react-toastify'
import useGetCurrentUser from '../customHooks/useGetCurrentUser.js'
import { ClipLoader } from 'react-spinners'

// important react router info
// This happens because React (and React Router) by default does not unmount and remount the component when navigating to the same route with different params (e.g., /viewcourse/abc → /viewcourse/xyz). Instead, it just updates the params and re-renders. As a result, your component's state (like selectedLecture, rating, etc.) is preserved, and only useEffects that depend on the changed params or data will re-run.

function ViewCourse() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { course_id } = useParams()

	const { publishedCoursesData, loading } = useSelector(state => state.course)
	const { userData } = useSelector(state => state.user)
	const [selectedCourseData, setSelectedCourseData] = useState({})
	const [selectedLecture, setSelectedLecture] = useState(null)
	const { lectureData } = useSelector(state => state.lecture)
	const [avgRating, setAvgRating] = useState(5)
	const [hoverRating, setHoverRating] = useState(0)
	const [reviewLoading, setReviewLoading] = useState(false)
	const [rating, setRating] = useState(0)
	const [comment, setComment] = useState("")
	const [creatorInfo, setCreatorInfo] = useState(null)
	const [similarCourses, setSimilarCourses] = useState([])
	const [isEnrolled, setIsEnrolled] = useState(false)
	const refreshCurrentUser = useGetCurrentUser()

	useGetCourseLectures(course_id)

	useEffect(() => {
		console.log("ViewCourse mounted");

		return () => {
			console.log("ViewCourse unmounted");
		};
	}, []);

	// selectedCourseData state populate; till then loading
	useEffect(() => {
		setLoading(true)
		const tmp = publishedCoursesData.find((course) => {
			return course._id === course_id
		})
		setSelectedCourseData(tmp)
		setLoading(false)
		setSelectedLecture(null)
	}, [publishedCoursesData, course_id]) // course_id since it was click on a card of similar course was changing the link at the top but not auto changing the content of the page so now when course_id changes then we still remain on the same page but selectedCourseData changes when course_id changes

	// calc avg rating
	useEffect(() => {
		const getAvgRating = async () => {
			try {
				const result = await axios.get(`${serverUrl}/review/getcoursereviews/${course_id}`, { withCredentials: true })

				if (result && result.data && result.data.reviews) {
					const total = result.data.reviews.reduce((sum, review) => sum + (review.rating || 0), 0)

					const avg = result.data.reviews.length > 0 ? (total / result.data.reviews.length).toFixed(1) : 0
					setAvgRating(avg)
				}
			} catch (error) {
				console.log(`Error calculating avg rating - ${error}`);
			}
		}

		getAvgRating()
	}, [selectedCourseData])

	// get creator info
	useEffect(() => {
		try {
			setLoading(true)
			const getCreator = async () => {
				const result = await axios.get(`${serverUrl}/user/getuserbyid/${selectedCourseData?.creator}`, { withCredentials: true })

				setCreatorInfo(result.data.user)
			}
			if (selectedCourseData !== undefined && selectedCourseData !== null && selectedCourseData.length !== 0 && selectedCourseData.creator) {
				getCreator()
			}
		} catch (error) {
			console.log(error);

		} finally {
			setLoading(false)
		}
	}, [selectedCourseData])

	// to get similar course - u can change getSimilarCourses for your usecase
	useEffect(() => {
		const getSimilarCourses = () => {
			return publishedCoursesData.filter((course) => {
				return course.creator === creatorInfo?._id && course._id !== course_id
			})
		}
		setSimilarCourses(getSimilarCourses())
	}, [publishedCoursesData, creatorInfo])

	// check enrollment
	useEffect(() => {
		const checkEnrollment = () => {
			const verify = userData?.enrolledCourses?.some(
				c => (typeof c === 'string' ? c : c._id).toString() === course_id?.toString()
			)
			setIsEnrolled(verify)
		}

		checkEnrollment()
	}, [userData, course_id]);

	const handleAddReview = async () => {
		setReviewLoading(true)
		try {
			if (rating === 0) {
				toast.error("Select your rating first")
				return
			}
			const result = await axios.post(`${serverUrl}/review/addreview`, {
				rating,
				comment,
				courseId: course_id
			}, { withCredentials: true })

			if (result && result.data) {
				toast.success(result.data.message)
			}
		} catch (error) {
			console.log(error);

			if (error.response && error.response.data && error.response.data.message) {
				console.log('error adding review', error);
				toast.error(`Error adding review - ${error.response.data.message}`)
			}
		} finally {
			setReviewLoading(false)
			setComment("")
			setRating(0)
		}
	};

	const handleEnrollment = async (courseId, userId) => {
		try {
			if (userId === undefined || userId === null) {
				toast.error("Login required")
				return
			}
			const orderData = await axios.post(`${serverUrl}/order/createorder`, { userId, courseId }, { withCredentials: true })

			const options = {
				key: import.meta.env.VITE_RAZORPAY_API_KEY,
				amount: orderData.data.order.amount,
				currency: "INR",
				name: "VIRTUAL COURSES",
				description: "Course enrollment payment",
				order_id: orderData.data.order.id,
				handler: async function (responce) {
					// console.log(responce, "RZPY responce");
					const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = responce

					try {
						const verifyPaymentResult = await axios.post(`${serverUrl}/order/verifypayment`, { courseId, userId, razorpayOrderId: razorpay_order_id, razorpay_payment_id, razorpay_signature }, { withCredentials: true })
						console.log('first', verifyPaymentResult)

						if (!verifyPaymentResult.data.success) {
							throw console.error("Payment failed");
						}

						toast.success(`${verifyPaymentResult?.data?.message}`)
						await refreshCurrentUser()
					} catch (error) {
						console.log('errorrrr');

						console.log(error);
						toast.error(error.response && error.response.data.message ? error.response.data.message : "Error verifying payment")
					}
				}
			}

			const rzp = new window.Razorpay(options)
			rzp.open()
			
			// Hooks cannot be called inside event handlers.
			// Call the hook at component render time
			// and use its returned functions (e.g. refetch).
			// useGetCurrentUser()
			

		} catch (error) {
			console.log(error);
			toast.error(`Something went wrong while enrolling ${error.response && error.response.data.message ? error.response.data.message : ""}`)
		} finally {

		}
	}

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			{loading ? <Loading /> :
				<div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative">

					{/* top section */}
					<div className='flex flex-col md:flex-row gap-6'>

						{/* thumbnail */}
						<div className="w-full md:w-1/2">
							<button
								onClick={() => navigate("/allcourses")}
								className='p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center'
								aria-label='Go back'
								type='button'>
								<FaArrowLeftLong className='h-[20px] w-[20px] text-black' />
							</button>

							{selectedCourseData?.thumbnailUrl ? <img
								src={selectedCourseData?.thumbnailUrl}
								alt="Course Thumbnail"
								className="rounded-xl w-full object-cover"
							/> : <img
								src={img}
								alt="Course Thumbnail"
								className="rounded-xl  w-full  object-cover"
							/>}
						</div>

						{/* course info */}
						<div className="flex-1 space-y-2 mt-[20px]">
							<h1 className="text-2xl font-bold">{selectedCourseData?.title}</h1>
							<p className="text-gray-600">{selectedCourseData?.subTitle}</p>

							{/* Rating & Price */}
							<div className="flex items-start flex-col justify-between">
								<div className="text-yellow-500 font-medium">
									⭐ {avgRating} <span className="text-gray-500">({selectedCourseData?.reviews?.length} reviews)</span>
								</div>
								<div>
									<span className="text-lg font-semibold text-black">{selectedCourseData?.price}</span>{" "}
									<span className="line-through text-sm text-gray-400">₹{selectedCourseData?.price * 1.75}</span>
								</div>
							</div>

							{/* Highlights */}
							<ul className="text-sm text-gray-700 space-y-1 pt-2">
								<li>✅ 10+ hours of video content</li>
								<li>✅ Lifetime access to course materials</li>
							</ul>

							{/* Enroll Button */}
							{!isEnrolled ?
								<button className="bg-[black] text-white px-6 py-2 rounded hover:bg-gray-700 mt-3" onClick={() => { handleEnrollment(course_id, userData?._id) }}>
									Enroll Now
								</button>
								:
								<button className="bg-green-100 text-green-600 px-6 py-2 rounded hover:bg-green-200 mt-3" onClick={() => {
									navigate(`/viewlecture/${course_id}`)
								}}>
									Watch Now
								</button>
							}

						</div>

					</div>

					{/* what you'll learn */}
					<div>
						<h2 className="text-xl font-semibold mb-2">What You’ll Learn</h2>
						<ul className="list-disc pl-6 text-gray-700 space-y-1">
							<li>Learn {selectedCourseData?.category} from Beginning</li>

						</ul>
					</div>

					{/* requirements */}
					<div>
						<h2 className="text-xl font-semibold mb-2">Requirements</h2>
						<p className="text-gray-700">Basic programming knowledge is helpful but not required.</p>
					</div>

					{/* who this course is for */}
					<div>
						<h2 className="text-xl font-semibold mb-2">Who This Course is For</h2>
						<p className="text-gray-700">
							Beginners, aspiring developers, and professionals looking to upgrade skills.
						</p>
					</div>

					{/* course lecture */}
					<div className="flex flex-col md:flex-row gap-6">
						{/* left side list of lecture */}
						<div className='bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200'>
							<h2 className="text-xl font-bold mb-1 text-gray-800">Course Curriculum</h2>
							<p className="text-sm text-gray-500 mb-4">{selectedCourseData?.lectures?.length} Lectures</p>

							<div className="flex flex-col gap-3">
								{lectureData?.map((lecture, index) => {
									return (
										<button
											key={index}
											disabled={!(lecture.isPreviewFree || isEnrolled)}
											onClick={() => {
												if (lecture.isPreviewFree || isEnrolled) {
													setSelectedLecture(lecture);
												}
											}}
											className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${lecture.isPreviewFree || isEnrolled
												? "hover:bg-gray-100 cursor-pointer border-gray-300"
												: "cursor-not-allowed opacity-60 border-gray-200"
												} ${selectedLecture?.lectureTitle === lecture.lectureTitle
													? "bg-gray-100 border-gray-400"
													: ""
												}`}
										>
											<span className="text-lg text-gray-700">
												{lecture.isPreviewFree || isEnrolled ? <FaPlayCircle /> : <FaLock />}
											</span>
											<span className="text-sm font-medium text-gray-800">{
												index
											}.
												{lecture.lectureTitle}
											</span>
										</button>
									)
								})}
							</div>
						</div>

						{/* video side */}
						<div className='bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg border border-gray-200'>
							<div className="aspect-video w-full rounded-lg overflow-hidden mb-4 bg-black flex items-center justify-center">
								{userData?._id ? (
									selectedLecture ? (
										selectedLecture.videoUrl ? (
											<video
												src={selectedLecture.videoUrl}
												controls
												className="w-full h-full object-cover"
											/>
										) : (
											<span className="text-white text-sm">No video available for this lecture</span>
										)
									) : (
										<span className="text-white text-sm">Select a preview lecture to watch</span>
									)
								) : (
									<span className="text-white text-sm">Login to preview lectures</span>
								)}
							</div>


							<h3 className="text-lg font-semibold text-gray-900 mb-1">
								{selectedLecture?.lectureTitle || "Lecture Title"}
							</h3>
							<p className="text-gray-600 text-sm">
								{selectedCourseData?.title || "Course title"}
							</p>
						</div>
					</div>

					{/* instructor info and reviews */}
					<div className="mt-8 border-t pt-6">
						<h2 className="text-xl font-semibold mb-2">
							Write a Review
						</h2>

						{/* write review */}
						<div className="mb-4">
							<div className="flex gap-1 mb-2">
								{[1, 2, 3, 4, 5].map((star) => (
									<FaStar
										key={star}
										onMouseEnter={() => setHoverRating(star)}
										onMouseLeave={() => setHoverRating(0)}
										onClick={() => {
											setRating(star)
										}}
										className={star <= rating || star <= hoverRating ? "fill-yellow-500 cursor-pointer scale-110" : "fill-gray-300 cursor-pointer"}
										style={{ transition: 'transform 0.1s' }}
									/>
								))}
								<button
									type="button"
									className="ml-2 text-xs text-gray-500 underline hover:text-black"
									onClick={() => setRating(0)}
								>
									Clear
								</button>
							</div>

							<textarea
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								placeholder="Write your comment here..."
								className="w-full border border-gray-300 rounded-lg p-2"
								rows="3"
							/>
							<button className="bg-black text-white mt-3 px-4 py-2 rounded hover:bg-gray-800" onClick={handleAddReview} disabled={reviewLoading}>
								{
									reviewLoading ? <ClipLoader size={30} color='white' /> : "Submit Review"
								}
							</button>
						</div>

						{/* instructor info */}
						<div className='flex items-center gap-4 pt-4 border-t'>
							{creatorInfo?.photoUrl ? <img
								src={creatorInfo?.photoUrl}
								alt="Instructor"
								className="w-16 h-16 rounded-full object-cover"
							/> : <img
								src={img}
								alt="Instructor"
								className="w-16 h-16 rounded-full object-cover"
							/>
							}
							<div>
								<h3 className="text-lg font-semibold">{creatorInfo?.name}</h3>
								<p className="md:text-sm text-gray-600 text-[10px] ">{creatorInfo?.description}</p>
								<p className="md:text-sm text-gray-600 text-[10px] ">{creatorInfo?.email}</p>
							</div>
						</div>

						<div className='mt-4 border-b-1'></div>

						{/* similar course */}
						<div>
							<p className='text-xl mt-4 font-semibold mb-2'>Other Published Courses by the Educator - </p>
							<div className='w-full transition-all duration-300 py-[20px]   flex items-start justify-center lg:justify-start flex-wrap gap-6 lg:px-[80px] '>
								{
									similarCourses.map((course, index) => {
										return (
											<CourseCard
												key={index}
												thumbnail={course?.thumbnailUrl}
												title={course?.title}
												category={course?.category}
												price={course?.price}
												reviews={course?.reviews}
												course_id={course?._id} />
										)
									})
								}
							</div>
						</div>

					</div>
				</div>}
		</div>
	)
}

export default ViewCourse