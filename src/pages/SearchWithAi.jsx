import React, { useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import ai from "../assets/ai.png"
import ai1 from "../assets/SearchAi.png"
import { RiMicAiFill } from "react-icons/ri";
import { toast } from 'react-toastify'
import axios from 'axios'
import { serverUrl } from '../App.jsx'
import startmp3 from "../assets/start.mp3"

function SearchWithAi() {
	const navigate = useNavigate()
	const [input, setInput] = useState("")
	const [recommendations, setRecommendations] = useState([])
	const [listening, setListening] = useState(false)
	const [searching, setSearching] = useState(false)

	const startSound = new Audio(startmp3)

	function speak(message) {
		let utterance = new SpeechSynthesisUtterance(message);
		window.speechSynthesis.speak(utterance);
	}

	const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

	const recognition = new SpeechRecognition()

	if (!recognition) {
		toast.error("Speech recognition not supported")
	}

	const handleVoiceInput = async () => {
		if (!recognition) return
		setListening(true)

		try {
			startSound.play()
			recognition.start()
			recognition.onresult = async (e) => {
				const transcript = e.results[0][0].transcript.trim()
				setInput(transcript)
			}
		} catch (error) {
			console.log(`unable to recognize - ${error}`);
			toast.error("Unable to recognize voice")
		} finally {
			setListening(false)
		}
	}

	const handleRecommendation = async (query) => {
		try {
			setSearching(true)
			const result = await axios.post(`${serverUrl}/course/search`, { input: query })

			if (result.data.courses.length > 0) {
				speak("These are the top courses I found for you")
				setRecommendations(result.data.courses)
			} else {
				speak("No courses found for you")
			}

		} catch (error) {
			toast.error("Recommending courses failed!")
			console.log(`handle recommendation - ${error}`)
		} finally {
			setSearching(false)
		}
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center px-4 py-16'>

			{/* search container */}
			<div className='bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center relative'>
				<button
					onClick={() => { navigate("/") }}
					className='absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition flex items-center justify-center'
					aria-label='Go back'
				>
					<FaArrowLeftLong className='w-5 h-5 text-black' />
				</button>

				<h1 className='text-2xl sm:text-3xl font-bold text-gray-600 mb-6 flex items-center justify-center gap-2'>
					<img src={ai} className='w-8 h-8 sm:w-[30px] sm:h-[30px]' alt="AI" />
					Search with <span className='text-[#CB99C7]'>AI</span>
				</h1>

				{/* input */}
				<div className="flex items-center bg-gray-700 rounded-full overflow-hidden shadow-lg relative w-full ">
					<input
						className='flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base'
						placeholder="What do you want to learn? (e.g. AI, MERN, Cloud...)" value={input}
						onChange={(e) => { setInput(e.target.value) }} />

					{
						input && input.length > 0 &&
						<button
							className="absolute right-14 sm:right-16 bg-white rounded-full transition-transform duration-200 hover:scale-110 shadow-md hover:shadow-lg"
							disabled={searching}
							onClick={() => {
								handleRecommendation(input)
							}}>
							<img src={ai} className='w-10 h-10 p-2 rounded-full' alt="Search" />
						</button>
					}

					<button className='absolute right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center transition-transform duration-200 hover:scale-110 shadow-md hover:shadow-lg' onClick={handleVoiceInput} disabled={searching}>
						<RiMicAiFill className="w-5 h-5 text-[#cb87c5] hover:shadow-amber-300" />
					</button>
				</div>
			</div>

			{/* recommendations */}
			{
				recommendations.length > 0 ?
					<div className='w-full max-w-6xl mt-12 px-2 sm:px-4'>
						<h1 className='text-xl sm:text-2xl font-semibold mb-6 text-white text-center flex items-center justify-center gap-3'>
							<img src={ai1} className="w-10 h-10 sm:w-[60px] sm:h-[60px] p-2 rounded-full" alt="AI Results" />
							AI Search Results
						</h1>

						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8'>
							{
								recommendations.map((course, idx) => {
									return (
										<div
											key={course._id || idx}
											className='bg-white text-black p-5 rounded-2xl shadow-md hover:shadow-indigo-500/30 transition-all duration-200 border border-gray-200 cursor-pointer hover:bg-gray-100 flex flex-col items-center'
											onClick={() => navigate(`/viewcourse/${course._id}`)}
											title={course.title}
										>
											<img
												className='w-32 h-20 object-cover rounded-lg mb-3 border border-gray-300'
												src={course.thumbnailUrl || ai1}
												alt={course.title}
												loading="lazy"
											/>
											<h3 className="text-lg font-bold sm:text-xl text-center line-clamp-2">{course.title}</h3>
											<p className="text-sm text-gray-600 mt-1">{course.category}</p>
											<p className="text-sm text-gray-600 mt-1">Created by <span className="font-medium">{course.creator?.name || "Unknown"}</span></p>
										</div>
									)
								})
							}
						</div>

					</div>
					: listening ? <h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-400'>Listening...</h1> : searching ? <h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-400'>Searching...</h1> : <h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-400'>No Courses Found</h1>
			}

		</div>
	)
}

export default SearchWithAi