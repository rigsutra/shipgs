import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  Input,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Center,
} from "@chakra-ui/react";

const Deposit = () => {
  const [balance, setBalance] = useState(0); // Initialize with 0
  const [invoices, setInvoices] = useState([]);
  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch current balance and invoices
    const fetchData = async () => {
      try {
        setLoading(true);
        const balanceResponse = await axios.get(
          "http://localhost:5000/api/balance"
        );
        const invoicesResponse = await axios.get(
          "http://localhost:5000/api/invoices"
        );

        setBalance(balanceResponse.data.balance);
        setInvoices(invoicesResponse.data.invoices);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddBalance = async () => {
    try {
      setLoading(true);
      // Create a payment request with NOWPayments
      const paymentResponse = await axios.post(
        "https://api.nowpayments.io/v1/invoice",
        {
          price_amount: amount,
          price_currency: "USD", // Adjust the currency as needed
          pay_currency: "BTC", // Cryptocurrency to be paid in (change as needed)
          order_id: `order_${Date.now()}`, // Unique identifier for your order
          order_description: "Balance top-up",
          success_url: "http://localhost:3000/success", // Redirect after successful payment
          cancel_url: "http://localhost:3000/cancel", // Redirect if the payment is canceled
        },
        {
          headers: {
            "x-api-key": "YOUR_NOWPAYMENTS_API_KEY", // Replace with your actual NOWPayments API key
          },
        }
      );

      // Redirect to the payment URL
      window.location.href = paymentResponse.data.invoice_url;
    } catch (error) {
      console.error("Error adding balance with NOWPayments", error);
      alert("Failed to initiate payment");
      setLoading(false);
    }
  };

  return (
    <Box
      p={8}
      color="white"
      bg="#1e1e1e"
      borderRadius="md"
      maxW="800px"
      mx="auto"
    >
      <Heading mb={6}>Deposits</Heading>
      <Box mb={6}>
        <Heading size="md" mb={2}>
          Current Balance
        </Heading>
        <Text fontSize="2xl" color={balance > 0 ? "green.400" : "red.400"}>
          ${balance ? balance.toFixed(2) : "0.00"}
        </Text>
      </Box>
      <Box mb={10}>
        <Heading size="md" mb={2}>
          Add balance
        </Heading>
        <Box display="flex" alignItems="center">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            mr={2}
            bg="gray.700"
            borderColor="gray.600"
          />
          <Select width="150px" bg="gray.700" borderColor="gray.600" mr={2}>
            <option value="crypto">Crypto</option>
            {/* Add more payment methods if needed */}
          </Select>
          <Button
            colorScheme="blue"
            onClick={handleAddBalance}
            isLoading={loading}
          >
            + Add balance
          </Button>
        </Box>
      </Box>
      <Heading size="md" mb={4}>
        Invoices
      </Heading>
      {loading ? (
        <Center>
          <Spinner size="xl" />
        </Center>
      ) : (
        <Table variant="simple" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>Payment method</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {invoices.map((invoice, index) => (
              <Tr key={index}>
                <Td>{invoice.date}</Td>
                <Td>${invoice.amount}</Td>
                <Td>{invoice.paymentMethod}</Td>
                <Td
                  color={
                    invoice.status === "Pending" ? "yellow.400" : "red.400"
                  }
                >
                  {invoice.status}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default Deposit;
