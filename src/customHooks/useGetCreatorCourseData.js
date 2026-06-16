import { serverUrl } from "../App.jsx"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCreatorCoursesData, setLoading } from "../redux/courseSlice.js"

const useGetCreatorCourseData = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const getCreatorCourseData = async () => {
            dispatch(setLoading(true))

            try {
                const result = await axios.get(`${serverUrl}/course/getcreatorcourses`, { withCredentials: true })

                dispatch(setCreatorCoursesData(result.data.courses))

            } catch (error) {
                console.log(error);
                dispatch(setCreatorCoursesData([]))
            }

            dispatch(setLoading(false))
        }

        getCreatorCourseData()

        return () => {
            dispatch(setCreatorCoursesData([]))
        }
    }, [dispatch])
}

export default useGetCreatorCourseData;