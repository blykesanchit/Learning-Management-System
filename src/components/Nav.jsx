import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App.jsx';
import { setUserData } from '../redux/userSlice.js';

import logo from "../assets/logo.jpg"
import { IoMdPerson } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { GiSplitCross } from "react-icons/gi";
import { GiCrossMark } from "react-icons/gi";

import { toast } from 'react-toastify';

function Nav() {
	const navigate = useNavigate()
	const { userData } = useSelector(state => state.user)
	const dispatch = useDispatch()
	const [showProfileMenu, setShowProfileMenu] = useState(false)
	const [showHam, setShowHam] = useState(false)

	// createcourse a event listener for when Profile menu is open and user clicks anywhere other than that profileMenu the i will check if the event.target was at this menu if not then close the menu
	// use useEffect to add a event listener whenever showProfileMenu turns to true
	// cleanup function will remove this event listener
	// will run when:
	// 1. The component unmounts (is removed from the page).
	// 2. The dependencies of the useEffect change (for example, when showProfileMenu changes from true to false).
	const profileMenuRef = useRef(null);

	useEffect(() => {
		if (!showProfileMenu) return;

		function handleClick(event) {
			// console.log(profileMenuRef);
			// console.log(profileMenuRef.current);
			// console.log(event.target);

			if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
				setShowProfileMenu(false);
			}
		}

		document.addEventListener("mousedown", handleClick)

		// But before this, React will run the cleanup function from the previous effect to remove the event listener.
		return () => {
			console.log('cleanup');

			document.removeEventListener("mousedown", handleClick)
		}
	}, [showProfileMenu])


	const handleLogout = async () => {
		try {
			const result = await axios.get(`${serverUrl}/auth/logout`, { withCredentials: true })
			dispatch(setUserData(null))

			toast.success("Logout successfully!")
			setShowHam(false)
		} catch (error) {
			console.log(error);
			toast.error(error.result && error.result.data && error.responce.data.message ? error.responce.data.message : "Error logging out!")
		}
	}

	return (
		<div>
			{/* here there will be 2 div and there will be duplicate data b/w them because one is for desktop type and another for when hamburger menu opens up */}
			{/* 1. desktop */}
			<div className='w-[100%] h-[70px] fixed top-0 px-[20px] py-[10px] flex items-center justify-between bg-[#000000c7] z-10'>

				{/* 1.1. logo img */}
				<div className='lg:w-[20%] w-[40%] lg:pl-[50px] '>
					<img src={logo} className=' w-[60px]  rounded-[5px] border-2 border-white cursor-pointer' onClick={() => navigate("/")} alt="logo" />
				</div>

				{/* 1.2. login logout profile */}
				{/* here hidden means on small n mid devices this will be hidden */}
				<div className='w-[30%] lg:flex items-center justify-center gap-4 hidden'>

					{/* profile icon w/o logged in */}
					{!userData && <IoMdPerson className='w-[50px] h-[50px] fill-white cursor-pointer border-[2px] border-[#fdfbfb] bg-[#000000d5] rounded-full p-[10px]' onClick={() => { userData ? setShowProfileMenu(!showProfileMenu) : navigate("/login") }} />}

					{/* profile icon when logged in */}
					{userData && (
						<div className='w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white  cursor-pointer overflow-hidden transition-shadow duration-100 hover:shadow-[0_0_10px_2px_rgba(255,255,255,0.7)] hover:border-white' onClick={() => setShowProfileMenu(!showProfileMenu)}>
							{userData.photoUrl && userData.photoUrl !== "" ? (
								<img src={userData.photoUrl} alt="profile" className="w-full h-full object-cover rounded-full" />
							) : (
								userData?.name?.slice(0, 1).toUpperCase()
							)}
						</div>
					)}

					{/* dashboard btn */}
					{userData && userData.role === "educator" && <div className='px-[20px] py-[10px] border-2 lg:border-white border-black lg:text-white bg-[black] text-black rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer hover:bg-gray-700' onClick={() => { navigate("/dashboard") }}>Dashboard</div>}

					{/* login and logout depends on userData presence */}
					{userData ? <span className='px-[20px] py-[10px] bg-white text-black rounded-[10px] shadow-sm shadow-black text-[18px] cursor-pointer hover:bg-red-400' onClick={handleLogout}>LogOut</span> : <span className='px-[20px] py-[10px] border-2 border-white text-white rounded-[10px] text-[18px] font-light cursor-pointer bg-[#000000d5]' onClick={() => { navigate("/login") }}>Login</span>}

					{/* when clicked on the profile icon */}
					{userData && showProfileMenu && <div ref={profileMenuRef} className='absolute top-[110%] right-[15%] flex items-center flex-col justify-center gap-2 text-[16px] rounded-md bg-[white] px-[15px] py-[10px] border-[2px]  border-black hover:text-white cursor-pointer'>
						<span className='bg-[black] text-white  px-[30px] py-[10px] rounded-2xl hover:bg-gray-700' onClick={() => {
							navigate("/myenrolledcourses")
						}}>My Courses</span>
						<span className='bg-[black] text-white  px-[30px] py-[10px] rounded-2xl hover:bg-gray-700' onClick={() => {
							navigate("/myprofile")
						}}>My Profile</span>
					</div>}


				</div>

				{/* 1.3. ham menu on mobile devices only */}
				<GiHamburgerMenu onClick={() => {
					setShowHam(!showHam)
				}} className='w-[30px] h-[30px] lg:hidden fill-white cursor-pointer ' />



			</div>

			{/* 2. hamburger menu slider */}
			{/* try left-0, left-full, left-1/2 */}
			{/* when showHam true then pull this div from left to right but only 80%(either keep width=80% or translate -80%); or put a cross icon on ham menu */}
			<div className={`fixed top-0 left-0 w-[100vw] h-[100vh] bg-[#000000d6] flex items-center justify-center flex-col gap-5 z-10 ${showHam ? "translate-x-[0%] transition duration-500" : "translate-x-[-100%] transition duration-500"}`}>
				{/* 2.1. cross to hide ham */}
				<GiCrossMark className='w-[35px] h-[35px] fill-gray-400 absolute top-5 right-[4%] cursor-pointer hover:w-[40px] hover:h-[40px] hover:top-[15px] hover:right-[3.3%] transition-all' onClick={() => setShowHam(prev => !prev)} />

				{/* 2.2. profile icon */}
				{/* profile icon w/o logged in */}
				{!userData && <IoMdPerson className='w-[50px] h-[50px] fill-white cursor-pointer border-[2px] border-[#fdfbfb] bg-[#000000d5] rounded-full p-[10px]' />}

				{/* profile icon when logged in */}
				{userData && (
					<div className='w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white'>
						{userData.photoUrl && userData.photoUrl !== "" ? (
							<img
								src={userData.photoUrl}
								alt="profile"
								className="w-full h-full object-cover rounded-full"
								style={{ objectFit: "cover", width: "100%", height: "100%" }}
							/>
						) : (
							userData?.name?.slice(0, 1).toUpperCase()
						)}
					</div>
				)}
				{userData && userData.role === "educator" && <div className='flex items-center justify-center gap-2 text-[18px] text-white border-[2px] border-[#fdfbfb7a] bg-[#000000d5] rounded-lg px-[60px] py-[20px] cursor-pointer hover:bg-gray-800' onClick={() => { navigate("/dashboard") }}>Dashboard</div>}

				{/* 2.4. my profile & courses */}
				{userData &&
					<span className='flex items-center justify-center gap-2  text-white border-[2px] border-[#fdfbfb7a] bg-[#000000d5] rounded-lg px-[65px] py-[20px] text-[18px] cursor-pointer hover:bg-gray-800' onClick={() => navigate("/myprofile")}>My Profile </span>}

				{userData &&
					<span className='flex items-center justify-center gap-2  text-white border-[2px] border-[#fdfbfb7a] bg-[#000000d5] rounded-lg px-[65px] py-[20px] text-[18px] cursor-pointer hover:bg-gray-800' onClick={() => navigate("/myenrolledcourses")}>My Courses </span>}

				{/* 2.5. login logout */}
				{!userData ? <span className='flex items-center justify-center gap-2 text-[18px] text-white border-[2px] border-[#fdfbfb7a] bg-[#000000d5] rounded-lg px-[80px] py-[20px] cursor-pointer hover:bg-green-950' onClick={() => {
					navigate("/login")
				}}>Login</span> :
					<span className='flex items-center justify-center gap-2 text-[18px] text-white border-[2px] border-[#fdfbfb7a] bg-[#000000d5] rounded-lg px-[80px] py-[20px] cursor-pointer hover:bg-red-950' onClick={() => {
						handleLogout()
					}}>Logout</span>}



			</div>
		</div>
	)
}

export default Nav