import { FaArrowLeftLong } from 'react-icons/fa6'
import Nav from '../components/Nav.jsx'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ai1 from '../assets/SearchAi.png'
import { useSelector } from 'react-redux'
import CourseCard from '../components/Card.jsx'
import Loading from '../components/Loading.jsx'

function AllCourses() {
  const navigate = useNavigate()
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const [category, setCategory] = useState([])
  const { publishedCoursesData, loading } = useSelector(state => state.course)
  const [filteredCourses, setFilteredCourses] = useState([])

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(c => c !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let courseCopy = publishedCoursesData?.slice()
    if (category.length > 0) {
      courseCopy = courseCopy.filter((c) => {
        return category.includes(c.category)
      })
    }

    setFilteredCourses(courseCopy)
  }

  useEffect(() => {
    setFilteredCourses(publishedCoursesData)
  }, [publishedCoursesData])

  useEffect(() => {
    applyFilter()
  }, [category])

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Nav />

      {/* show hide filter sidebar - on small device only */}
      <button className="fixed top-20 left-4 z-50 bg-white text-black px-3 py-1 rounded md:hidden border-2 border-black" onClick={() => { setIsSidebarVisible(prev => !prev) }}>
        {!isSidebarVisible ? "Hide" : "Show"} Filters
      </button>

      {/* sidebar */}
      <aside className={`w-[260px] h-screen overflow-y-auto bg-black fixed  top-0 left-0 p-6 py-[130px] border-r border-gray-200 shadow-md transition-transform duration-300 z-5 
      ${isSidebarVisible ? "-translate-x-full" : "translate-x-0"} md:block md:translate-x-0`}>
        <h2 className='text-xl font-bold flex items-center justify-center gap-2 text-gray-50 mb-6'>
          <button
            onClick={() => navigate("/")}
            className='p-2 rounded-full bg-transparent hover:bg-gray-700 transition-colors flex items-center justify-center'
            aria-label='Go back'
            type='button'>
            <FaArrowLeftLong className='h-[20px] w-[20px] text-white' />
          </button>
          Filter by Category
        </h2>

        <form className='space-y-4 text-sm  bg-gray-600 border-white text-[white] border  p-[20px] rounded-2xl' onSubmit={(e) => { e.preventDefault() }}>
          <button className='px-[10px] py-[10px]  bg-black text-white  rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer' onClick={() => navigate("/searchwithai")}>
            Search with AI
            <img src={ai1} className='w-[35px] h-[35px] rounded-full' alt="" />
          </button>

          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" className="accent-black w-4 h-4 rounded-md" value={'App Development'} onChange={toggleCategory} />
            App Development
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" className="accent-black w-4 h-4 rounded-md" value={'AI/ML'} onChange={toggleCategory} />
            AI/ML
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" className="accent-black w-4 h-4 rounded-md" value={'AI Tools'} onChange={toggleCategory} />
            AI Tools
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" className="accent-black w-4 h-4 rounded-md" value={'Data Science'} onChange={toggleCategory} />
            Data Science
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" className="accent-black w-4 h-4 rounded-md" value={'Data Analytics'} onChange={toggleCategory} />
            Data Analytics
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" className="accent-black w-4 h-4 rounded-md" value={'Ethical Hacking'} onChange={toggleCategory} />
            Ethical Hacking
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" className="accent-black w-4 h-4 rounded-md" value={'UI UX Designing'} onChange={toggleCategory} />
            UI UX Designing
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" className="accent-black w-4 h-4 rounded-md" value={'Web Development'} onChange={toggleCategory} />
            Web Development
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" className="accent-black w-4 h-4 rounded-md" value={'Others'} onChange={toggleCategory} />
            Others
          </label>
        </form>
      </aside>

      {/* main courses section */}
      <main className='w-full transition-all duration-300 py-[130px] md:pl-[300px]  flex items-start justify-center md:justify-start flex-wrap gap-6 px-[10px]'>
        {
          filteredCourses && !loading ? filteredCourses.map((c, index) => {
            return <CourseCard key={index} title={c.title} thumbnail={c.thumbnailUrl} price={c.price} course_id={c._id} category={c.category} />
          }) : <Loading />
        }
      </main>
    </div>
  )
}

export default AllCourses