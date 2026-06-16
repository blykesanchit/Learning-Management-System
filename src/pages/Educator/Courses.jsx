import React, { useEffect } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import img1 from "../../assets/empty.jpg"
import { FaEdit } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { setCreatorCoursesData } from '../../redux/courseSlice.js'
import useGetCreatorCourseData from '../../customHooks/useGetCreatorCourseData.js'
import Loading from '../../components/Loading.jsx'

function Courses() {
  useGetCreatorCourseData()
  const navigate = useNavigate()

  const { creatorCoursesData, loading } = useSelector(state => state.course)

  return (
    <>
      {loading ? <Loading /> :
        <div className='flex min-h-screen bg-gray-100'>
          <div className='w-[100%] min-h-screen p-4 sm:p-6   bg-gray-100'>
            {/* heading */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 '>
              <div className='flex items-center justify-center gap-3 '>
                <button
                  onClick={() => { navigate("/") }}
                  className='w-[35px] h-[35px] bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition flex items-center justify-center'
                  aria-label='Go back'
                >
                  <FaArrowLeftLong className='text-xl font-semibold' />
                </button>

                <h1>All Created Courses</h1>
              </div>

              <button onClick={() => { navigate("/createcourse") }} className='bg-[black] text-white px-4 py-2 rounded hover:bg-gray-500'>
                Create Course
              </button>
            </div>

            {/* table for larger screen */}
            <div className='hidden md:block bg-white rounded-xl shadow p-4 overflow-x-auto'>
              <table className='min-w-full text-sm'>
                <thead className='border-b bg-gray-50'>
                  <tr>
                    <th className='text-left py-3 px-4'>Courses</th>
                    <th className='text-left py-3 px-4'>Price</th>
                    <th className='text-left py-3 px-4'>Status</th>
                    <th className='text-left py-3 px-4'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {creatorCoursesData && creatorCoursesData.map((course) => {
                    return (<tr key={course._id} className='border-b hover:bg-gray-50 transition duration-200'>
                      <td className='py-3 px-4 flex items-center gap-4'>
                        {course?.thumbnailUrl ? <img
                          src={course?.thumbnailUrl}
                          alt=""
                          className="w-25 h-14 object-cover rounded-md"
                        /> : <img src={img1} alt='' className="w-14 h-14 object-cover rounded-md object-fit" />}
                        <span>{course.title}</span>
                      </td>
                      <td className='py-3 px-4'>
                        Rs. {course.price || "NA"}
                      </td>
                      <td className='py-3 px-4'>
                        <span className={`  px-3 py-1 rounded-full text-xs ${course?.isPublished ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}>{course?.isPublished ? "Published" : "Draft"}</span>
                      </td>
                      <td className='py-3 px-4'>
                        <FaEdit onClick={() => {
                          navigate(`/editcourse/${course._id}`)
                        }} className="text-gray-600 hover:text-blue-600 cursor-pointer" />
                      </td>
                    </tr>)
                  })}
                </tbody>
              </table>

              <p className='text-center text-sm text-gray-400 mt-6'>
                A list of your recent courses
              </p>
            </div>

            {/* for smaller screen */}
            <div className='md:hidden space-y-4'>

              {/* course items start, this below div is single course item */}
              {creatorCoursesData && creatorCoursesData.map((course) => {
                return (<div key={course._id} className='bg-white rounded-lg shadow p-4 flex flex-col gap-3 '>

                  <div className='flex gap-4 items-center'>
                    {course?.thumbnailUrl ? <img
                      src={course?.thumbnailUrl}
                      alt=""
                      className="w-25 h-14 object-cover rounded-md"
                    /> : <img src={img1} alt='' className="w-14 h-14 object-cover rounded-md object-fit" />}
                    <div className='flex-1'>
                      <h2 className='font-medium text-lg'>{course.title}</h2>
                      <p className='text-gray-600 text-sm mt-1'>Rs. {course.price || "NA"}</p>
                    </div>

                    <FaEdit onClick={() => {
                      navigate(`/editcourse/${course._id}`)
                    }} className="text-gray-600 hover:text-blue-600 cursor-pointer" />
                  </div>

                  <span className={` w-fit px-3 py-1 text-xs rounded-full  ${course?.isPublished ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}>
                    {course?.isPublished ? "Published" : "Draft"}
                  </span>

                </div>)
              })}

              <p className='text-center text-sm text-gray-400 mt-4'>A list of your recent courses</p>
            </div>

          </div>
        </div>}
    </>

  )
}

export default Courses