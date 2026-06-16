import { serverUrl } from "../App.jsx"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setLectureData, setLoading } from "../redux/lectureSlice.js"

const useGetCourseLectures = (course_id, fullReload = true) => {
    const dispatch = useDispatch()
    const { lectureData } = useSelector(state => state.lecture)

    useEffect(() => {
        const getCourseLectures = async () => {
            dispatch(setLoading(true))
            try {
                const result = await axios.get(`${serverUrl}/course/getcourselectures/${course_id}`, { withCredentials: true })

                dispatch(setLectureData([...result.data.lectures]))
            } catch (error) {
                console.log(error);
            } finally {
                dispatch(setLoading(false))
            }
        }

        if (!(lectureData.length !== 0 && lectureData !== undefined && !fullReload)) {
            getCourseLectures()
        }

        return () => {
            dispatch(setLectureData([]))
        }
    }, [course_id])
}

export default useGetCourseLectures;