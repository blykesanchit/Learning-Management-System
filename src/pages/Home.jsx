import Nav from '../components/Nav'
import React from 'react'
import home from "../assets/home1.jpg"
import { SiViaplay } from "react-icons/si";
import ai from '../assets/ai.png'
import ai1 from '../assets/SearchAi.png'
import Logos from '../components/Logos.jsx';
import ExploreCourses from '../components/ExploreCourses.jsx';
import CardPage from '../components/CardPage.jsx';
import useGetPublishedCourses from '../customHooks/useGetPublishedCourses.js';
import { useNavigate } from 'react-router-dom';
import About from '../components/About.jsx';
import Footer from '../components/Footer.jsx';
import ReviewPage from './ReviewPage.jsx';

function Home() {
  const navigate = useNavigate()
  useGetPublishedCourses()
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className='w-[100%] overflow-hidden'>
      <div className='w-[100%] lg:h-[140vh] h-[70vh] relative'>
        <Nav />
        <img className='object-cover md:object-fill w-[100%] lg:h-[100%] h-[50vh]' src={home} alt='home pic'></img>

        <span className='lg:text-[70px] absolute  md:text-[40px]  lg:top-[10%] top-[15%] w-[100%] flex items-center justify-center text-white font-bold text-[20px] '>Make your career shine. Grow. Today.</span>
        {/* md, lg - medium large devices */}
        <span className='lg:text-[70px] absolute md:text-[40px] lg:top-[18%] top-[22%] w-[100%] flex items-center justify-center text-white font-bold text-[20px]'>Join us for your growing career</span>

        <div className='absolute lg:top-[30%] top-[75%]  md:top-[80%] w-[100%] flex items-center justify-center gap-3 flex-wrap'>
          <button
            className={`px-[20px] py-[10px] border-2 lg:border-white border-black lg:text-white text-black rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer hover:bg-black hover:text-white transition-shadow duration-200 ${isHovered ? 'shadow-[0_0_20px_5px_rgba(128,128,128,0.5)]' : ''}`}
            onClick={() => { navigate("allcourses") }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            View all Courses
            <SiViaplay
              className={`w-[30px] h-[30px] lg:fill-white fill-black transition-all duration-200 ${isHovered ? 'scale-110 fill-gray-300' : ''}`}
            />
          </button>
          <button className='px-[20px] py-[10px] lg:bg-white bg-black lg:text-black text-white rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer items-center justify-center hover:bg-gray-300 hover:text-black hover:border-2 transition-shadow duration-200 hover:shadow-[0_0_20px_5px_rgba(128,128,128,0.5)]' onClick={() => {
            navigate('/search')
          }}>
            Search with AI
            <img src={ai} className='w-[30px] h-[30px] rounded-full block lg:hidden' />
            <img src={ai1} className='w-[30px] h-[30px] rounded-full hidden lg:block' />
          </button>
        </div>
      </div>

      <Logos />
      <ExploreCourses />
      <CardPage />
      <About />
      <ReviewPage />
      <Footer />
    </div>
  )
}

export default Home