// // src/components/auth/AdminProtectRoute.js
// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";

// const AdminProtectRoute = () => {
//   const { user } = useSelector((state) => state.auth);

//   // Check if the user is an admin
//   if (user && user.role === "admin") {
//     return <Outlet />;
//   } else {
//     return <Navigate to="/" replace />;
//   }
// };

// export default AdminProtectRoute;
