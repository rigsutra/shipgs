import React from "react";
import { useSelector } from "react-redux";
import Dashboard from "../components/styles/Dashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

function Home() {
  const role = useSelector((state) => state.auth.user?.role);

  if (role === "admin") {
    return <AdminDashboard />;
  } else {
    return <Dashboard />;
  }
}

export default Home;
