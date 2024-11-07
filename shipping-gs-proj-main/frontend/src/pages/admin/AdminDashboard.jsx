// src/pages/AdminDashboardOverview.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
const baseUrl = import.meta.env.VITE_BASE_URL;
import { UserPen } from "lucide-react";
function AdminDashboard() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [adminName, setAdminName] = useState(""); // State for admin name

  const navigate = useNavigate();

  const EditProfile = () => {
    navigate("/EditProfile");
  };

  useEffect(() => {
    // Fetch total orders and revenue
    const fetchData = async () => {
      const ordersResponse = await fetch(
        `${baseUrl}/api/fedexorder`
      );
      const uspsResponse = await fetch(`${baseUrl}/api/uspsorder`);
      const ordersData = await ordersResponse.json();
      const uspsData = await uspsResponse.json();

      setTotalOrders(ordersData.length + uspsData.length);
      setTotalRevenue(
        [...ordersData, ...uspsData].reduce(
          (acc, order) => acc + parseFloat(order.price || 0),
          0
        )
      );
    };

    fetchData();
  }, []);

  return (
    <div className="pb-10">
      {/* Header section */}
      <div className="flex px-4 pt-8 pb-10  items-center justify-between bg-blue-400 h-full">
        <h2 className="text-heading2-bold">Dashboard</h2>
        <div
          onClick={EditProfile}
          className="flex gap-3 cursor-pointer items-center text-body-medium"
        >
          <h1 className="text-[1.85rem]">$ 0.00</h1>
          <div className="flex">
            <UserPen />
            <p>{adminName || "Loading..."}</p> {/* Display admin name */}
          </div>
        </div>
      </div>
      <Box className="mx-3 mt-3">
        <SimpleGrid columns={2} spacing={10}>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Stat>
              <StatLabel>Total Orders</StatLabel>
              <StatNumber>{totalOrders}</StatNumber>
            </Stat>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Stat>
              <StatLabel>Total Revenue</StatLabel>
              <StatNumber>${totalRevenue.toFixed(2)}</StatNumber>
            </Stat>
          </Box>
        </SimpleGrid>
      </Box>
    </div>
  );
}

export default AdminDashboard;
