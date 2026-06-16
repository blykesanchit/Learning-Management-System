import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        loading: true,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        clearUserData: (state) => {
            state.userData = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
});

export const { setUserData, clearUserData, setLoading } = userSlice.actions; // for dispatching we will need this

export default userSlice.reducer; // for store we will need this