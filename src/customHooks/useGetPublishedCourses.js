import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading, setPublishedCoursesData } from '../redux/courseSlice.js'
import axios from 'axios'
import { serverUrl } from '../App.jsx'

const useGetPublishedCourses = () => {
    const dispatch = useDispatch()

    const getPublishedCourses = async () => {
        dispatch(setLoading(true))

        try {
            const result = await axios.get(`${serverUrl}/course/getpublishedcourses/`, { withCredentials: true })
            
            dispatch(setPublishedCoursesData(result.data.publishedCoursesData))
        } catch (error) {
            console.log(error);
            dispatch(setPublishedCoursesData([]))
        } finally {
            dispatch(setLoading(false))
        }
    }

    useEffect(() => {
        getPublishedCourses()

        // return () => {
            // i thought it will make it refresh again 
            // dispatch(setPublishedCoursesData([]))
        // }
    }, [dispatch])
}

export default useGetPublishedCourses