import { configureStore } from "@reduxjs/toolkit"

import userReducer from "./userSlice"
import courseReducer from "./courseSlice"
import lectureReducer from "./lectureSlice";
import reviewReducer from "./reviewSlice";

export const store = configureStore({
    reducer: {
        // your reducers here
        user: userReducer,
        course: courseReducer,
        lecture: lectureReducer,
        review: reviewReducer,
    }
});