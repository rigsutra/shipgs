// src/pages/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Select,
  Text,
} from "@chakra-ui/react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch("http://localhost:5000/api/fedexorder");
      const data = await response.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    await fetch(`http://localhost:5000/api/fedexorder/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders(
      orders.map((order) => (order._id === id ? { ...order, status } : order))
    );
  };

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>
        Orders Management
      </Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Order ID</Th>
            <Th>Status</Th>
            <Th>Price</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <Tr key={order._id}>
              <Td>{order.orderId}</Td>
              <Td>{order.price}</Td>
              <Td>
                <Select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                >
                  <option value="Waiting">Waiting</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </Select>
              </Td>
              <Td>
                <Button
                  colorScheme="teal"
                  onClick={() => alert("View Order Details")}
                >
                  View
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default AdminOrders;
