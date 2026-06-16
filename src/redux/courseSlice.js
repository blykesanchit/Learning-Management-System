import { createSlice } from "@reduxjs/toolkit"

const courseSlice = createSlice({
    name: "course",
    initialState: {
        creatorCoursesData: [],
        loading: true,
        publishedCoursesData: [],
        // courseData: {},
    },
    reducers: {
        setCreatorCoursesData: (state, action) => {
            state.creatorCoursesData = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setPublishedCoursesData: (state, action) => {
            state.publishedCoursesData = action.payload
        },
        // setSelectedCourseData: (state, action) => {
        //     state.selectedCourseData = action.payload
        // },
    }
})

export const { setCreatorCoursesData, setLoading, setPublishedCoursesData } = courseSlice.actions; // for actual use

export default courseSlice.reducer; // for putting in store