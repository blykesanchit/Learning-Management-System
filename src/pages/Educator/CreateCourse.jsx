import { serverUrl } from '../../App.jsx';
import axios from 'axios';
import React, { useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

function CreateCourse() {
  const navigate = useNavigate()

  // Define categories above the component
  const categories = [
    "App Development",
    "AI/ML",
    "AI Tools",
    "Data Science",
    "Data Analytics",
    "Ethical Hacking",
    "UI UX Designing",
    "Web Development",
    "Others"
  ];

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/course/create`, {
        title, category
      }, { withCredentials: true })

      console.log("createcourse course result", result);
      toast.success("Course created successfully!")
      navigate("/educatorcourses")
    } catch (error) {
      console.log(error);
      toast.error(error.response && error.response.data && error.response.data.message ? error.response.data.message : "Request for course creation failed!");
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="max-w-xl w-[600px] mx-auto p-6 bg-white shadow-md rounded-md mt-10 relative">
        <button
          onClick={() => { navigate("/educatorcourses") }}
          className='w-[35px] absolute top-[7%]
              left-[4%] h-[35px] bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition flex items-center justify-center'
          aria-label='Go back'
        >
          <FaArrowLeftLong className='w-5 h-5 text-black' />
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Course</h2>

        <form onSubmit={handleCreateCourse} className='space-y-5 pt-5'>
          {/* name */}
          <div>
            <label required className='block text-sm font-medium text-gray-700 mb-1' htmlFor='title'>Course Title</label>
            <input className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[black]' type='text' id='title' placeholder='Enter course title' value={title} onChange={(e) => { setTitle(e.target.value) }} />
          </div>

          {/* category */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor='category'>Course Category</label>
            <select value={category} onChange={(e) => { setCategory(e.target.value) }} required id='category' className='w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[black]'>
              <option disabled value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[black] text-white py-2 px-4 rounded-md active:bg-[#3a3a3a] transition cursor-pointer hover:bg-gray-600" disabled={loading} >
            {loading ? <ClipLoader size={30} color='white' /> : "Create"}
          </button>
        </form>

      </div>
    </div>
  )
}

export default CreateCourse