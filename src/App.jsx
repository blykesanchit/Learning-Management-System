import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import { useSelector } from 'react-redux'

import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import useGetCurrentUser from './customHooks/useGetCurrentUser.js'
import Profile from './pages/Profile.jsx'
import ForgetPassword from './pages/ForgetPassword.jsx'
import EditProfile from './pages/EditProfile.jsx'
import Loading from './components/Loading.jsx'
import ProtectedRoute from './utils/ProtectedRoute.jsx'
import Dashboard from './pages/Educator/Dashboard.jsx'
import Courses from './pages/Educator/Courses.jsx'
import CreateCourse from './pages/Educator/CreateCourse.jsx'
import EditCourse from './pages/Educator/EditCourse.jsx'
import useGetPublishedCourses from './customHooks/useGetPublishedCourses.js'
import AllCourses from './pages/AllCourses.jsx'
import Nav from './components/Nav.jsx'
import CreateLecture from './pages/Educator/CreateLecture.jsx'
import EditLecture from './pages/Educator/EditLecture.jsx'
import ViewCourse from './pages/ViewCourse.jsx'
import { ScrollToTop } from './components/ScrollToTop.jsx'
import ViewLectures from './pages/ViewLecture.jsx'
import MyEnrolledCourses from './pages/MyEnrolledCourses.jsx'
import { useGetAllReviews } from './customHooks/useGetAllReviews.js'
import SearchWithAi from './pages/SearchWithAi.jsx'

export const serverUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
  useGetCurrentUser()
  useGetPublishedCourses()
  ScrollToTop()
  useGetAllReviews()

  const { userData, loading } = useSelector(state => state.user)

  // if (loading) {
  //   return <Loading />
  // }

  return (
    <>
      {loading && <Loading />}
      {/*better than above since it doesnt remount the whole Router part. also having different loading var for each slice is better architecture than a single one */}
      
      <ToastContainer />
      {/* <Nav /> */}
      {/* now we can use toast throughout our app */}
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/signup' element={<ProtectedRoute authOnly={false} redirect={"/"}>
          <SignUp />
        </ProtectedRoute>} />

        <Route path='/login' element={<ProtectedRoute authOnly={false} redirect={"/"}>
          <Login />
        </ProtectedRoute>} />

        <Route
          path='/myprofile'
          element={
            <ProtectedRoute redirect={"/login"}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path='/editprofile'
          element={
            <ProtectedRoute redirect={"/login"}>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route path='/forgotpassword' element={<ForgetPassword />} />

        {/* educators */}

        <Route path='/dashboard' element={
          <ProtectedRoute requireEducator={true}>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path='/educatorcourses' element={
          <ProtectedRoute redirect={"/"} requireEducator={true}>
            <Courses />
          </ProtectedRoute>
        } />

        <Route path='/createcourse' element={
          <ProtectedRoute redirect={"/"} requireEducator={true}>
            <CreateCourse />
          </ProtectedRoute>
        } />

        <Route path='/editcourse/:course_id' element={
          <ProtectedRoute redirect={"/"} requireEducator={true}>
            <EditCourse />
          </ProtectedRoute>
        } />

        <Route path='/allcourses' element={
          <AllCourses />
        } />

        <Route path='/search' element={
          <SearchWithAi />
        } />

        <Route path='/createlecture/:course_id' element={
          <ProtectedRoute redirect={"/"} requireEducator={true}>
            <CreateLecture />
          </ProtectedRoute>
        } />

        <Route path='/editlecture/:course_id/:lecture_id' element={
          <ProtectedRoute redirect={"/"} requireEducator={true}>
            <EditLecture />
          </ProtectedRoute>
        } />

        <Route path='/viewcourse/:course_id' element={
          <ViewCourse />
        } />

        <Route path='/viewlecture/:course_id' element={
          <ProtectedRoute redirect={"/"}>
            <ViewLectures />
          </ProtectedRoute>
        } />

        <Route
          path='/myenrolledcourses'
          element={
            <ProtectedRoute redirect={"/login"}>
              <MyEnrolledCourses />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  )
}

export default App;