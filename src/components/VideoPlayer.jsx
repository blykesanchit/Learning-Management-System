import React from 'react'
import aboutVideo from "../assets/video.mp4"

function VideoPlayer() {
	return (
		<div className='max-w-[350px] mx-auto p-4 absolute top-[55%] left-[50%]'>
			<video
				src={aboutVideo}
				autoPlay
				loop
				className='w-full rounded-xl shadow-lg  border-2 border-white' />
		</div>
	)
}

export default VideoPlayer