import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CourseCard from './Card.jsx'
import { SiViaplay } from 'react-icons/si'
import { useNavigate } from 'react-router-dom'

function CardPage() {
    const navigate = useNavigate()
    const { publishedCoursesData } = useSelector(state => state.course)

    const [cardCourses, setCardCourses] = useState([])

    useEffect(() => {
        setCardCourses(publishedCoursesData.slice(0, 6))
    }, [publishedCoursesData])

    return (
        <div className='relative flex items-center justify-center flex-col'>
            <h1 className='md:text-[45px] text-[30px] font-semibold text-center mt-[30px] px-[20px]'>Our Popular Courses</h1>
            <span className='lg:w-[50%] md:w-[80%] text-[15px] text-center mt-[30px] mb-[30px] px-[20px]'>Explore top-rated courses designed to boost your skills, enhance careers, and unlock opportunities in tech, AI, business, and beyond.</span>

            <div className='w-[100%] min-[100vh] flex items-center justify-center flex-wrap gap-[50px] lg:p-[50px] md:p-[30px] p-[10px] mb-[80px]'>
                {/* map courses here */}
                {
                    cardCourses.map((course, index) => {
                        return (
                            <CourseCard key={index} thumbnail={course.thumbnailUrl} course_id={course._id} category={course.category} price={course.price} title={course.title} />
                        )
                    })
                }
            </div>

            <button className='absolute bottom-2 px-[20px] py-[10px] border-2 lg:border-white border-black bg-black lg:text-white text-white rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer hover:bg-gray-700' onClick={() => { navigate("/allcourses") }}>
                View All Courses <SiViaplay className='w-[30px] h-[30px] lg:fill-white fill-white' />
            </button>
        </div>
    )
}

export default CardPage