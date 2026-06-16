import useGetCreatorCourseData from '../../customHooks/useGetCreatorCourseData.js'
import React, { useEffect, useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function Dashboard() {
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()
  const { creatorCoursesData } = useSelector(state => state.course)
  const [totalEarnings, setTotalEarnings] = useState(0)

  useGetCreatorCourseData()

  useEffect(() => {
    const calcTotalEarnings = () => {
      creatorCoursesData.forEach(c => {
        setTotalEarnings(totalEarnings + c.price * c.enrolledStudents.length)
      })
    }
    calcTotalEarnings()
  }, [creatorCoursesData])

  // const totalEarnings = creatorCoursesData?.reduce((sum, course) => {
  //   const studentCount = course.enrolledStudents?.length || 0;
  //   const courseRevenue = course.price ? course.price * studentCount : 0;
  //   return sum + courseRevenue;
  // }, 0) || 0;

  const CourseProgressData = creatorCoursesData?.map((course) => ({
    name: course.title?.slice(0, 10) + "...",
    lectures: course.lectures.length || 0,
  })) || [];

  const CourseEnrollData = creatorCoursesData?.map((course) => ({
    name: course.title?.slice(0, 10) + "...",
    enrolled: course.enrolledStudents.length || 0,
  })) || [];

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <button
        onClick={() => { navigate("/") }}
        className='w-[35px] absolute top-[10%]
      left-[7%] h-[35px] bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition flex items-center justify-center md:top-[8%] md:left-[5%]'
        aria-label='Go back'
      >
        <FaArrowLeftLong className='w-5 h-5 text-black' />
      </button>

      <div className='w-full px-6 py-10   bg-gray-50 space-y-10'>

        {/* main section */}
        <div className='max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6'>
          <img className='w-28 h-28 rounded-full object-cover border-4 border-black shadow-md' src={userData?.photoUrl || userData?.name.slice(0, 1).toUpperCase()} alt='Educator' />

          <div className='text-center md:text-left space-y-1'>
            <h1 className='text-2xl font-bold text-gray-800'>Welcome, {userData?.name || "Educator"} 👋</h1>

            <h1 className='text-xl font-semibold text-gray-800 mt-4 italic'># of Courses Launched: <span className='font-light text-gray-900'>{creatorCoursesData.length || 0}</span></h1>

            <h1 className='text-xl font-semibold text-gray-800 italic'>Total Earnings: Rs. <span className='font-light text-gray-900'>{totalEarnings}</span></h1>

            <p className='text-gray-600 text-sm'>
              {userData?.description || "Starting to createcourse courses for my students!"}
            </p>

            <h1 className='px-[10px] text-center  py-[10px] border-2  bg-black border-black text-white  rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-600' onClick={() => { navigate("/educatorcourses") }}>
              All Created Courses
            </h1>

          </div>
        </div>

        {/* graph section */}
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* for course progress graph */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-lg font-semibold mb-4'>Course Progress (Lectures)</h2>

            {/* container for rechart */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={CourseProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="lectures" fill="black" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Enrolled Students Chart */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className="text-lg font-semibold mb-4">Student Enrollment</h2>

            {/*  */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={CourseEnrollData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="enrolled" fill="black" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard