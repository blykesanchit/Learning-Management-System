import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
    name: "review",
    initialState: {
        reviewData: []
    },
    reducers: {
        setReviewData: (state, action) => {
            state.reviewData = action.payload
        },
    }
})

export const { setReviewData } = reviewSlice.actions; // actions for modifying data

export default reviewSlice.reducer; // for putting in store