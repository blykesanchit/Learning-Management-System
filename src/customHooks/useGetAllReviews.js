import { serverUrl } from '../App.jsx'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setReviewData } from '../redux/reviewSlice.js'
import axios from 'axios'

export const useGetAllReviews = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		const allReviews = async () => {
			try {
				const result = await axios.get(`${serverUrl}/review/getallreviews`)

				dispatch(setReviewData(result.data.reviews))
			} catch (error) {
				console.log(error);
			}
		}

		allReviews()
	}, [dispatch])
}
