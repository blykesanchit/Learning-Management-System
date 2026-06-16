// first custom hook
// for fetching current user

import { serverUrl } from '../App.jsx'
import axios from 'axios'
import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading, setUserData } from '../redux/userSlice.js'

const useGetCurrentUser = (pathName = null) => {
	const dispatch = useDispatch();

	// important concept - memo and useCallback, when we export a component as memo(component1)
	// then it says that no matter what dont refresh this component until the props to itchange because it makes sense
	// and next try doing
	// const a = () => {return 1};
	// const a2 = () => {return 1};
	// a === a2 gives false, js treats it diff function
	// hence we use useCallback to define a function to say that this is always the same function please don't refresh it everytime
	console.log(1)

	const fetchUser = useCallback(async () => {
		dispatch(setLoading(true))
		console.log(2)
		try {
			const result = await axios.get(`${serverUrl}/user/getcurrentuser`, {
				withCredentials: true,
			});

			console.log(3)
			dispatch(setUserData(result.data.user))
		} catch (error) {
			
			console.log(4)
			console.log(error);
			dispatch(setUserData(null))
		}
		console.log(5)
		dispatch(setLoading(false))
	}, [dispatch])
	
	console.log(6)

	useEffect(() => {
		console.log(11)
		fetchUser();
		console.log(22)
	}, [fetchUser, pathName]) // react warns if you dont put something in dependency which is external(i.e, fetchUser fn itself came from outside)
	// we used useCallback because we put fetchUser() external to useEffect so we dont want it to run in infinite loop that component rerenders, fetchUser changes useEffect is run now again component rerenders if it did some change in component and then again useEffect runs

	return fetchUser
}

export default useGetCurrentUser