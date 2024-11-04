import React, { useState } from "react";
import {
  Input,
  VStack,
  HStack,
  Divider,
  Text,
  Box,
  Select,
  Button,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

function CreateFedexOrder() {
  const toast = useToast();

  // Form state for sender, receiver, package, and pickup details
  const [formData, setFormData] = useState({
    senderName: "",
    senderStreet: "",
    senderStreet2: "",
    senderCity: "",
    senderState: "",
    senderZip: "",
    senderPhone: "",
    senderEmail: "",
    senderCountry: "",
    receiverName: "",
    receiverStreet: "",
    receiverStreet2: "",
    receiverCity: "",
    receiverState: "",
    receiverZip: "",
    receiverPhone: "",
    receiverEmail: "",
    receiverCountry: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    pickup: "",
    pickupDate: "",
    fromPickupTime: "",
    toPickupTime: "",
    signature: false,
    name: "",
    street: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    country: "",
    shipmentPurpose: "",
    currency: "USD",
    specialNotes: "",
  });

  // State to control visibility of Pickup Details
  const [showPickupDetails, setShowPickupDetails] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Toggle pickup details visibility if "pickup" checkbox is clicked
    if (name === "pickup") {
      setShowPickupDetails(checked);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make API request to create the order
      const response = await axios.post(
        "http://localhost:5000/api/createfedexorder",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Success notification
      toast({
        title: "Order Created Successfully!",
        description: `Order ID: ${response.data.orderId}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Clear form after successful submission
      setFormData({
        senderName: "",
        senderStreet: "",
        senderStreet2: "",
        senderCity: "",
        senderState: "",
        senderZip: "",
        senderPhone: "",
        senderEmail: "",
        senderCountry: "",
        receiverName: "",
        receiverStreet: "",
        receiverStreet2: "",
        receiverCity: "",
        receiverState: "",
        receiverZip: "",
        receiverPhone: "",
        receiverEmail: "",
        receiverCountry: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        pickup: "",
        pickupDate: "",
        fromPickupTime: "",
        toPickupTime: "",
        signature: false,
        name: "",
        street: "",
        street2: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        country: "",
        shipmentPurpose: "",
        currency: "USD",
        specialNotes: "",
      });
      setShowPickupDetails(false); // Reset pickup details visibility
    } catch (error) {
      // Error notification
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
          {/* Sender and Receiver Information */}
          <HStack spacing={10} align="start">
            {/* Sender Information */}
            <VStack align="start" spacing={4} w="full">
              <Text fontSize="xl" fontWeight="bold">
                Sender Information
              </Text>
              <Input
                name="senderName"
                placeholder="Name"
                value={formData.senderName}
                onChange={handleChange}
              />
              <Input
                name="senderStreet"
                placeholder="Street"
                value={formData.senderStreet}
                onChange={handleChange}
              />
              <Input
                name="senderStreet2"
                placeholder="Street 2 (optional)"
                value={formData.senderStreet2}
                onChange={handleChange}
              />
              <Input
                name="senderCity"
                placeholder="City"
                value={formData.senderCity}
                onChange={handleChange}
              />
              <Input
                name="senderState"
                placeholder="State (optional)"
                value={formData.senderState}
                onChange={handleChange}
              />
              <Input
                name="senderZip"
                placeholder="Zip"
                value={formData.senderZip}
                onChange={handleChange}
              />
              <Input
                name="senderPhone"
                placeholder="Phone"
                value={formData.senderPhone}
                onChange={handleChange}
              />
              <Input
                name="senderEmail"
                placeholder="Email (optional)"
                value={formData.senderEmail}
                onChange={handleChange}
              />
              <Input
                name="senderCountry"
                placeholder="Country"
                value={formData.senderCountry}
                onChange={handleChange}
              />
            </VStack>

            {/* Receiver Information */}
            <VStack align="start" spacing={4} w="full">
              <Text fontSize="xl" fontWeight="bold">
                Receiver Information
              </Text>
              <Input
                name="receiverName"
                placeholder="Name"
                value={formData.receiverName}
                onChange={handleChange}
              />
              <Input
                name="receiverStreet"
                placeholder="Street"
                value={formData.receiverStreet}
                onChange={handleChange}
              />
              <Input
                name="receiverStreet2"
                placeholder="Street 2 (optional)"
                value={formData.receiverStreet2}
                onChange={handleChange}
              />
              <Input
                name="receiverCity"
                placeholder="City"
                value={formData.receiverCity}
                onChange={handleChange}
              />
              <Input
                name="receiverState"
                placeholder="State (optional)"
                value={formData.receiverState}
                onChange={handleChange}
              />
              <Input
                name="receiverZip"
                placeholder="Zip"
                value={formData.receiverZip}
                onChange={handleChange}
              />
              <Input
                name="receiverPhone"
                placeholder="Phone"
                value={formData.receiverPhone}
                onChange={handleChange}
              />
              <Input
                name="receiverEmail"
                placeholder="Email (optional)"
                value={formData.receiverEmail}
                onChange={handleChange}
              />
              <Input
                name="receiverCountry"
                placeholder="Country"
                value={formData.receiverCountry}
                onChange={handleChange}
              />
            </VStack>
          </HStack>

          <Divider borderColor="gray.700" />

          {/* Package Details */}
          <VStack align="start" spacing={4}>
            <Text fontSize="xl" fontWeight="bold">
              Package Details
            </Text>
            <HStack spacing={4}>
              <Input
                name="weight"
                placeholder="Weight"
                value={formData.weight}
                onChange={handleChange}
              />
              <Input
                name="length"
                placeholder="Length"
                value={formData.length}
                onChange={handleChange}
              />
              <Input
                name="width"
                placeholder="Width"
                value={formData.width}
                onChange={handleChange}
              />
              <Input
                name="height"
                placeholder="Height"
                value={formData.height}
                onChange={handleChange}
              />
            </HStack>
          </VStack>

          <Divider borderColor="gray.700" />

          {/* Pickup and Signature Checkboxes */}
          <HStack align="center" spacing={4}>
            <label>
              <input
                type="checkbox"
                name="pickup"
                checked={showPickupDetails}
                onChange={handleChange}
              />{" "}
              Pickup
            </label>

            <label>
              <input
                type="checkbox"
                name="signature"
                checked={formData.signature}
                onChange={handleChange}
              />{" "}
              Signature
            </label>
          </HStack>

          {/* Conditionally Rendered Pickup Details */}
          {showPickupDetails && (
            <VStack align="start" spacing={4}>
              <Text fontSize="xl" fontWeight="bold">
                Pickup Details
              </Text>
              <Input
                name="pickup"
                placeholder="Pickup Location"
                value={formData.pickup}
                onChange={handleChange}
              />
              <Input
                name="pickupDate"
                placeholder="Pickup Date"
                type="date"
                value={formData.pickupDate}
                onChange={handleChange}
              />
              <Input
                name="fromPickupTime"
                placeholder="From Pickup Time"
                type="time"
                value={formData.fromPickupTime}
                onChange={handleChange}
              />
              <Input
                name="toPickupTime"
                placeholder="To Pickup Time"
                type="time"
                value={formData.toPickupTime}
                onChange={handleChange}
              />
            </VStack>
          )}

          {/* Additional Shipment Info */}
          <VStack align="start" spacing={4}>
            <Text fontSize="xl" fontWeight="bold">
              Shipment Details
            </Text>
            <Input
              name="shipmentPurpose"
              placeholder="Shipment Purpose"
              value={formData.shipmentPurpose}
              onChange={handleChange}
            />
            <Input
              name="currency"
              placeholder="Currency"
              value={formData.currency}
              onChange={handleChange}
            />
            <Textarea
              name="specialNotes"
              placeholder="Special Notes"
              value={formData.specialNotes}
              onChange={handleChange}
            />
          </VStack>

          <Button colorScheme="blue" type="submit">
            Create Order
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default CreateFedexOrder;
