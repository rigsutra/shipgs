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
const baseUrl = import.meta.env.VITE_BASE_URL;
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
          `${baseUrl}/api/balance`
        );
        const invoicesResponse = await axios.get(
          `${baseUrl}/api/invoices`
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
      const paymentResponse = await axios.post(
        `${baseUrl}/api/create-payment`,
        {
          amount,
        }
      );

      // Redirect to the payment URL provided by the backend
      window.location.href = paymentResponse.data.invoiceUrl;
    } catch (error) {
      console.error("Error adding balance", error);
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
