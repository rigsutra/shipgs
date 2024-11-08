import React, { useState } from "react";
import {
  Input,
  VStack,
  HStack,
  Divider,
  Text,
  Box,
  Button,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

function CreateFedexOrder() {
  const toast = useToast();

  // Form state for sender and receiver addresses, package, and other details
  const [senderAddress, setSenderAddress] = useState({
    name: "",
    street: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    country: "",
  });

  const [receiverAddress, setReceiverAddress] = useState({
    name: "",
    street: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    country: "",
  });

  const [orderDetails, setOrderDetails] = useState({
    weight: "",
    length: "",
    width: "",
    height: "",
    pickup: "",
    pickupDate: "",
    fromPickupTime: "",
    toPickupTime: "",
    signature: false,
    shipmentPurpose: "",
    currency: "USD",
    specialNotes: "",
  });

  const [showPickupDetails, setShowPickupDetails] = useState(false);

  // Handle input changes for sender and receiver address
  const handleAddressChange = (e, isSender) => {
    const { name, value } = e.target;
    const setAddress = isSender ? setSenderAddress : setReceiverAddress;
    const address = isSender ? senderAddress : receiverAddress;

    setAddress({
      ...address,
      [name]: value,
    });
  };

  // Handle input changes for order details
  const handleOrderChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOrderDetails((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "pickup") {
      setShowPickupDetails(checked);
    }
  };

  // Function to create or retrieve an address
  const fetchOrCreateAddress = async (address) => {
    try {
      const response = await axios.post(`${baseUrl}/api/createFedexaddresses`, address, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data._id; // Return the address ID
    } catch (error) {
      console.error("Error fetching or creating address:", error);
      toast({
        title: "Failed to Create Address",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create or get sender and receiver addresses
      const senderAddressId = await fetchOrCreateAddress(senderAddress);
      const receiverAddressId = await fetchOrCreateAddress(receiverAddress);

      // Create order data with address IDs
      const orderData = {
        ...orderDetails,
        senderAddress: senderAddressId,
        receiverAddress: receiverAddressId,
      };

      // Submit order
      const response = await axios.post(
        `${baseUrl}/api/createfedexorder`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Order Created Successfully!",
        description: `Order ID: ${response.data.orderId}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setSenderAddress({
        name: "",
        street: "",
        street2: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        email: "",
        country: "",
      });
      setReceiverAddress({
        name: "",
        street: "",
        street2: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        email: "",
        country: "",
      });
      setOrderDetails({
        weight: "",
        length: "",
        width: "",
        height: "",
        pickup: "",
        pickupDate: "",
        fromPickupTime: "",
        toPickupTime: "",
        signature: false,
        shipmentPurpose: "",
        currency: "USD",
        specialNotes: "",
      });
      setShowPickupDetails(false);
    } catch (error) {
      toast({
        title: "Failed to Create Order",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box px={10} py={5} bg="gray.800" color="white">
      <form onSubmit={handleSubmit}>
        <VStack spacing={8} align="stretch">
          <HStack spacing={10} align="start">
            <VStack align="start" spacing={4} w="full">
              <Text fontSize="xl" fontWeight="bold">Sender Information</Text>
              {Object.keys(senderAddress).map((field) => (
                <Input
                  key={field}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={senderAddress[field]}
                  onChange={(e) => handleAddressChange(e, true)}
                />
              ))}
            </VStack>

            <VStack align="start" spacing={4} w="full">
              <Text fontSize="xl" fontWeight="bold">Receiver Information</Text>
              {Object.keys(receiverAddress).map((field) => (
                <Input
                  key={field}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={receiverAddress[field]}
                  onChange={(e) => handleAddressChange(e, false)}
                />
              ))}
            </VStack>
          </HStack>

          <Divider borderColor="gray.700" />

          <VStack align="start" spacing={4}>
            <Text fontSize="xl" fontWeight="bold">Package Details</Text>
            <HStack spacing={4}>
              {["weight", "length", "width", "height"].map((field) => (
                <Input
                  key={field}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={orderDetails[field]}
                  onChange={handleOrderChange}
                />
              ))}
            </HStack>
          </VStack>

          <Divider borderColor="gray.700" />

          <HStack align="center" spacing={4}>
            <label>
              <input
                type="checkbox"
                name="pickup"
                checked={showPickupDetails}
                onChange={handleOrderChange}
              /> Pickup
            </label>

            <label>
              <input
                type="checkbox"
                name="signature"
                checked={orderDetails.signature}
                onChange={handleOrderChange}
              /> Signature
            </label>
          </HStack>

          {showPickupDetails && (
            <VStack align="start" spacing={4}>
              <Text fontSize="xl" fontWeight="bold">Pickup Details</Text>
              {["pickup", "pickupDate", "fromPickupTime", "toPickupTime"].map((field) => (
                <Input
                  key={field}
                  name={field}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  type={field.includes("Time") ? "time" : "Date"}
                  value={orderDetails[field]}
                  onChange={handleOrderChange}
                />
              ))}
            </VStack>
          )}

          <VStack align="start" spacing={4}>
            <Text fontSize="xl" fontWeight="bold">Shipment Details</Text>
            <Input
              name="shipmentPurpose"
              placeholder="Shipment Purpose"
              value={orderDetails.shipmentPurpose}
              onChange={handleOrderChange}
            />
            <Input
              name="currency"
              placeholder="Currency"
              value={orderDetails.currency}
              onChange={handleOrderChange}
            />
            <Textarea
              name="specialNotes"
              placeholder="Special Notes"
              value={orderDetails.specialNotes}
              onChange={handleOrderChange}
            />
          </VStack>

          <Button colorScheme="blue" type="submit">Create Order</Button>
        </VStack>
      </form>
    </Box>
  );
}

export default CreateFedexOrder;
