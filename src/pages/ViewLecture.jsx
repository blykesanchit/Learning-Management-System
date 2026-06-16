import useGetCourseLectures from '../customHooks/useGetCourseLectures.js'
import { serverUrl } from '../App.jsx'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { FaPlayCircle } from 'react-icons/fa'

function ViewLectures() {
  const navigate = useNavigate()

  const { course_id } = useParams()
  const { publishedCoursesData } = useSelector(state => state.course)
  const { lectureData } = useSelector(state => state.lecture)
  const { userData } = useSelector(state => state.user)
  const [creatorInfo, setCreatorInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const selectedCourseData = publishedCoursesData?.find((c) => c._id == course_id)
  const [selectedLectureData, setselectedLectureData] = useState(lectureData?.[0] || null)

  // get lectures data into lecture.lectureData
  useGetCourseLectures(course_id)

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

  useEffect(() => {
    setselectedLectureData(lectureData?.[0])
  }, [lectureData])






  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">
      {/* left or top - video area and course info*/}
      <div className='w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200'>
        {/* course info */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center justify-start gap-[20px]  text-gray-800">
            <button
              onClick={() => navigate(`/viewcourse/${course_id}`)}
              className='p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center'
              aria-label='Go back'
              type='button'>
              <FaArrowLeftLong className='h-[20px] w-[20px] text-black' />
            </button>
            {selectedCourseData?.title}
          </h1>

          <div className="mt-2 flex gap-4 text-sm text-gray-500 font-medium">
            <span>Category: {selectedCourseData?.category}</span>
            <span>Level: {selectedCourseData?.level}</span>
          </div>
        </div>

        {/* video player */}
        <div className='aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-gray-300'>
          {
            selectedLectureData?.videoUrl ? (
              <video
                className='w-full h-full object-cover'
                controls
                crossOrigin="anonymous"
                src={selectedLectureData?.videoUrl} />
            ) : <div>
              Select lecture to view
            </div>
          }
        </div>

        {/* Selected Lecture Info */}
        <div className="mt-2">
          <h2 className="text-lg font-semibold text-gray-800">{selectedLectureData?.lectureTitle}</h2>
        </div>
      </div>

      {/* right or bottom - lecture list and creator info */}
      <div className='w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200 h-fit'>
        <h2 className="text-xl font-bold mb-4 text-gray-800">All Lectures</h2>

        {/* lecture list */}
        <div className='flex flex-col gap-3 mb-6'>
          {
            lectureData?.length > 0 ?
              (
                lectureData?.map((lecture, idx) => {
                  return (
                    <button
                      key={idx}
                      onClick={() => setselectedLectureData(lecture)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition text-left ${selectedLectureData?._id !== lecture._id ? "hover:bg-gray-100 border-gray-300" : "bg-gray-200 border-gray-500"}`}
                    >
                      <p>{idx}.</p>
                      <h4 className='text-sm font-semibold text-gray-800'>
                        {lecture?.lectureTitle}
                      </h4>
                      <FaPlayCircle className="text-black text-xl" />
                    </button>
                  )
                })
              ) : (
                <p className="text-gray-500">No lectures available.</p>
              )
          }
        </div>

        {/* Creator Info */}
        {creatorInfo && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-md font-semibold text-gray-700 mb-3">Instructor</h3>
            <div className="flex items-center gap-4">
              <img
                src={creatorInfo.photoUrl || '/default-avatar.png'}
                alt="Instructor"
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <h4 className="text-base font-medium text-gray-800">{creatorInfo.name}</h4>
                <p className="text-sm text-gray-600">
                  {creatorInfo.description || 'No bio available.'}
                </p>
                <p className="text-sm text-gray-600">
                  {creatorInfo.email || 'No email available.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewLectures