import { createSlice } from "@reduxjs/toolkit"

const lectureSlice = createSlice({
    name: "lecture",
    initialState: {
        lectureData: [],
        loading: true
    },
    reducers: {
        setLectureData: (state, action) => {
            state.lectureData = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
    }
})

export const { setLectureData, setLoading } = lectureSlice.actions; // for actual use

export default lectureSlice.reducer; // for putting in store