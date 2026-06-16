import React from 'react'
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";

function ReviewCard({ rating, comment, photoUrl, name, role, course }) {
	console.log({ rating, comment, photoUrl, name, role, course });

	return (
		<div className='bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 max-w-sm w-full'>
			{/* rating stars */}
			<div className='flex items-center mb-3 text-yellow-400 text-sm'>
				{
					Array(5).fill(0).map((_, i) => {
						return (
							<span key={i}>
								{i < rating ?
									<FaStar /> :
									<FaRegStar />}
							</span>
						)
					})
				}
			</div>

			{/* course title */}
			<p className='text-gray-700 text-sm mb-5'>Review for course - <b>{course.title}</b></p>

			{/* comment */}
			<p className="text-gray-700 text-sm mb-5"><b>{comment}</b></p>

			{/* reviewer info */}
			<div className='flex items-center gap-3'>
				<img src={photoUrl} className='w-10 h-10 rounded-full object-cover' alt='' />
				<div>
					<h2 className='font-semibold text-gray-800 text-sm'>{name}</h2>
					<p className='text-xs text-gray-500'>{role}</p>
				</div>
			</div>
		</div>
	)
}

export default ReviewCard