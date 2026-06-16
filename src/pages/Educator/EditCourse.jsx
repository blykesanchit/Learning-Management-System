import React, { useEffect, useRef, useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate, useParams } from 'react-router-dom'
import img from "../../assets/empty.jpg"
import { MdEdit } from 'react-icons/md';
import axios from 'axios';
import { serverUrl } from '../../App.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setPublishedCoursesData } from '../../redux/courseSlice.js';
import Loading from '../../components/Loading.jsx';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function EditCourse() {
  const { course_id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.course)
  const { publishedCoursesData } = useSelector(state => state.course)
  // Define categories above the component
  const categories = [
    "App Development",
    "AI/ML",
    "AI Tools",
    "Data Science",
    "Data Analytics",
    "Ethical Hacking",
    "UI UX Designing",
    "Web Development",
    "Others"
  ];

  const [selectedCourse, setSelectedCourse] = useState(null)
  const [isPublished, setIsPublished] = useState(true)
  const [title, setTitle] = useState("")
  const [subTitle, setSubTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [level, setLevel] = useState("")
  const [price, setPrice] = useState("")

  const thumb = useRef()
  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)

  const [savingInProgress, setSavingInProgress] = useState(false)
  const [deletionInProgress, setDeletionInProgress] = useState(false)

  const handleThumbnailChange = (e) => {
    // to select file and show that same file in the frontend we take 2 states - frontend state and backend state - frontend state has url(path of that image) which we show on frontend & backend state has the file which we upload there
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // formdata because we have image also na
    const formData = new FormData()
    formData.append("title", title)
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("price", price);
    formData.append("thumbnailUrl", backendImage);
    formData.append("isPublished", isPublished);

    // dispatch(setLoading(true))
    setSavingInProgress(true)
    try {
      const result = await axios.post(`${serverUrl}/course/edit/${course_id}`, formData, { withCredentials: true })

      // here i'm updating the redux state directly here
      const updatedCourse = result.data.course

      if (updatedCourse.isPublished) {
        const updatedCourses = publishedCoursesData.map((publishedCourse) => {
          if (publishedCourse._id === course_id) {
            return updatedCourse
          } else {
            return publishedCourse
          }
        })

        if (!publishedCoursesData.some(course => course._id === course_id)) {
          updatedCourses.push(updatedCourse)
        }
        dispatch(setPublishedCoursesData(updatedCourses))
      } else {
        const updatedCourses = publishedCoursesData.filter((publishedCourse) => {
          return publishedCourse._id !== course_id
        })

        dispatch(setPublishedCoursesData(updatedCourses))
      }

      console.log(result);
      toast.success(result.data.message)
      navigate("/educatorcourses")
    } catch (error) {
      console.log(error)
      toast.error(`${error}`)
    } finally {
      // dispatch(setLoading(false))
      setSavingInProgress(false)
    }
  }

  const handleRemoveCourse = async (e) => {
    e.preventDefault()
    setDeletionInProgress(true)
    try {
      const result = await axios.get(`${serverUrl}/course/deletecoursebyid/${course_id}`, { withCredentials: true })

      const updatedPublishedCourses = publishedCoursesData.filter(publishedCourse => {
        return publishedCourse._id !== course_id
      })

      if (updatedPublishedCourses !== publishedCoursesData) {
        setPublishedCoursesData(updatedPublishedCourses)
      }
      console.log(result);
      toast.success(result.data.message)
      navigate("/educatorcourses")
    } catch (error) {
      console.log(error);
      toast.error(error)
    } finally {
      setDeletionInProgress(true)
    }
  }

  // load the selected course detials for the form
  useEffect(() => {
    dispatch(setLoading(true))
    const fetchSelectedCourse = async () => {
      try {
        const result = await axios.get(`${serverUrl}/course/getcoursebyid/${course_id}`, { withCredentials: true })
        setSelectedCourse(result.data.course)
        // cant bring those setTitle(selectedCourse.title) here
        // because  the setState (or useState setter like setSelectedCourse) in React is asynchronous. It schedules a state update, but the new state value is not available immediately after the call. React batches state updates and re-renders the component afterward
      } catch (error) {
        toast.error(`Error fetching the course - ${error}`)
      }
    }

    fetchSelectedCourse()
    dispatch(setLoading(false))
  }, [])

  // update the form states when we fetch it
  useEffect(() => {
    if (selectedCourse) {
      setTitle(selectedCourse.title || "")
      setSubTitle(selectedCourse.subTitle || "")
      setDescription(selectedCourse.description || "")
      setCategory(selectedCourse.category || "")
      setLevel(selectedCourse.level || "")
      setPrice(selectedCourse.price || "")
      setFrontendImage(selectedCourse.thumbnailUrl || img)
      setIsPublished(selectedCourse?.isPublished)
    }
  }, [selectedCourse])



  return (
    <>
      {loading ? <Loading /> :
        <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">

          {/* Top Bar */}
          <div className="flex items-center justify-center gap-[20px] md:justify-between flex-col md:flex-row mb-6 relative">
            <button
              onClick={() => { navigate("/educatorcourses") }}
              className='w-[35px] relative sm:absolute top-[10%] left-[0%] h-[35px] bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition flex items-center justify-center'
              aria-label='Go back'
            >
              <FaArrowLeftLong className='w-5 h-5 text-black' />
            </button>
            <h2 className="text-2xl font-semibold md:pl-[60px]">Edit detail information regarding course</h2>
            <div className="space-x-2 space-y-2 w-full flex flex-col items-center md:w-auto md:flex-row md:items-center">
              <button onClick={() => {
                navigate(`/createlecture/${course_id}`)
              }} className="bg-black text-white px-4 py-2 rounded-md mt-4 md:mt-0 hover:bg-gray-700">
                Go to lectures page
              </button>
            </div>

          </div>

          {/* form details */}
          <div className='sm:relative sm:top-0 sm'>
            <h3 className="text-lg font-medium mb-4">Basic Course Information</h3>
            <div className='space-x-2 space-y-2'>
              {!isPublished ? <button className='bg-green-100 text-green-600 px-4 py-2 rounded-md border-1 hover:bg-green-200' onClick={() => {
                setIsPublished(true)
              }}>Click to Publish</button> : <button className='bg-red-100 text-red-600 px-4 py-2 rounded-md border-1 hover:bg-red-200' onClick={() => { setIsPublished(false) }}>Click to Unpublish</button>}

              <button className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500' disabled={deletionInProgress && savingInProgress} onClick={handleRemoveCourse}>{deletionInProgress ?
                <ClipLoader size={30} color='white' /> : "Remove Course"}</button>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" placeholder="Course Title" className="w-full border px-4 py-2 rounded-md" onChange={(e) => setTitle(e.target.value)} value={title} />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input type="text" placeholder="Subtitle" className="w-full border px-4 py-2 rounded-md" onChange={(e) => setSubTitle(e.target.value)} value={subTitle} />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea placeholder="Course description" className="w-full border px-4 py-2 rounded-md h-24 resize-none" onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
              </div>

              {/* Category, Level, Price - Flex row */}<div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                {/* Category */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor='category'>Course Category</label>
                  <select value={category} onChange={(e) => { setCategory(e.target.value) }} required id='category' className='w-full border px-4 py-2 rounded-md bg-white '>
                    <option disabled value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Level */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Level</label>
                  <select className="w-full border px-4 py-2 rounded-md bg-white" onChange={(e) => setLevel(e.target.value)} value={level} >
                    <option disabled value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                {/* Price */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (INR)</label>
                  <input type="number" placeholder="₹" className="w-full border px-4 py-2 rounded-md" onChange={(e) => setPrice(e.target.value)} value={price} />
                </div>
              </div>

              <div>
                <label htmlFor='thumbnail' className='block text-sm font-medium text-gray-700 mb-1'>Choose Thumbnail</label>
                <input onChange={handleThumbnailChange} ref={thumb} type='file' accept='image/*' id='thumbnail' hidden />
              </div>

              <div className='relative w-[300px]
          h-[170px]'>
                <img src={frontendImage || img} onClick={() => thumb.current.click()} className='w-[100%]
          h-[100%] border-1 border-black rounded-[5px]' alt='' />
                <MdEdit className='w-[20px] h-[20px] absolute top-2 right-2  ' onClick={() => thumb.current.click()} />
              </div>

              <div className='flex items-center justify-start gap-[15px]'>
                <button className='bg-[#e9e8e8] hover:bg-red-200 text-black border-1 border-black cursor-pointer px-4 py-2 rounded-md' onClick={() => { navigate("/educatorcourses") }} disabled={deletionInProgress && savingInProgress}>Cancel</button>

                <button className='bg-black text-white px-7 py-2 rounded-md hover:bg-gray-500 cursor-pointer' disabled={deletionInProgress && savingInProgress} onClick={handleSubmit}>
                  {savingInProgress ?
                    <ClipLoader size={30} color='white' /> : "Save"}
                </button>
              </div>

            </form>
          </div>


        </div>}
    </>
  )
}

export default EditCourse