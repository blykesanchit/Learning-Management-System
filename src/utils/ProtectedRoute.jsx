// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Loading from "../components/Loading.jsx";
// import useGetCurrentUser from "../customHooks/getCurrentUser.js";

// function ProtectedRoute({ children }) {
//   console.log('inprot')
//   const { loading } = useSelector((state) => state.user);
//   console.log('loading', loading);


//   if (loading) return <Loading />;

//   const { userData } = useSelector((state) => state.user);
//   if (!userData) {
//     console.log('loading, userData', loading, userData);
//     return <Navigate to="/login" replace />;

//   }

//   return children;
// }

// export default ProtectedRoute;
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../components/Loading";

const ProtectedRoute = ({ children, authOnly = true, requireEducator = false, requireAdmin = false, redirect }) => {
  const { userData, loading } = useSelector(state => state.user || {});
  const isAuthenticated = userData !== undefined && userData !== null;

  const location = useLocation();

  // While auth status resolving
  if (loading) {
    return <Loading />
  }

  if (authOnly) {
    if ((!isAuthenticated) || (requireAdmin === true && userData.role !== "admin") || (requireEducator && userData.role !== "educator")) {
      return <Navigate to={redirect || "/login"} replace state={{ from: location }} />;
    }
  } else {
    if (isAuthenticated) {
      return <Navigate to={redirect || "/"} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;