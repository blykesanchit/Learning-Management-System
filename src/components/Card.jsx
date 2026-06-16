import { serverUrl } from '../App.jsx';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';

function CourseCard({ thumbnail, title, price, reviews = [], course_id, category }) {
    const navigate = useNavigate()
    const [avgRating, setAvgRating] = useState(0)

    // calc avg rating
    useEffect(() => {
        const getAvgRating = async () => {
            try {
                const result = await axios.get(`${serverUrl}/review/getcoursereviews/${course_id}`, { withCredentials: true })

                if (result && result.data && result.data.reviews) {
                    const total = result.data.reviews.reduce((sum, review) => sum + (review.rating || 0), 0)
                    const avg = result.data.reviews.length > 0 ? (total / result.data.reviews.length).toFixed(1) : 0
                    setAvgRating(avg)
                }
            } catch (error) {
                console.log(`Error calculating avg rating - ${error}`);
            }
        }

        getAvgRating()
    }, [])


    return (
        <div id='coursecard' className="max-w-sm w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-300 cursor-pointer hover:bg-gray-200" onClick={() => { navigate(`/viewcourse/${course_id}`) }}>
            {/* thumbnail */}
            <img className='w-full h-48 object-covers' src={thumbnail} alt='' />

            {/* content */}
            <div className='p-5 space-y-2'>
                <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>

                <span className='px-2 py-0.5 bg-gray-100 rounded-full text-gray-700 capitalize'>{category}</span>

                {/* meta info */}
                <div className='flex justify-between text-sm text-gray-600 mt-3 px-[10px]'>
                    <span className='font-semibold text-gray-800'>Rs. {price}</span>
                    <span className='flex items-center gap-1 '>
                        <FaStar className="text-yellow-500" /> {avgRating}
                    </span>
                </div>
            </div>

        </div>
    )
}

export default CourseCard