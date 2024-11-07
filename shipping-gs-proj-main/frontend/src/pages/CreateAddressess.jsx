import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Select,
  Heading,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const baseUrl = import.meta.env.VITE_BASE_URL;
const CreateAddresses = () => {
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    street2: "",
    zip: "",
    city: "",
    state: "",
    country: "United States",
  });

  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const backToAddressHistory = () => {
    navigate("/Addresses");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${baseUrl}/api/postaddresses`,
        formData // Correctly pass formData as payload
      );

      // Show success toast
      toast({
        title: "Address Created.",
        description: "The address has been successfully added!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset the form after successful submission
      setFormData({
        name: "",
        street: "",
        street2: "",
        zip: "",
        city: "",
        state: "",
        country: "United States",
      });
    } catch (error) {
      console.error("Error submitting address:", error.response || error);

      // Show error toast with detailed message if available
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "There was an issue submitting the form.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="gray.800" p={6} rounded="md" color="white">
      <Heading as="h2" size="lg" mb={4}>
        Add Address
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* Name Field */}
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormControl>

          {/* Street Field */}
          <FormControl isRequired>
            <FormLabel>Street</FormLabel>
            <Input
              type="text"
              name="street"
              placeholder="Enter Street"
              value={formData.street}
              onChange={handleChange}
            />
          </FormControl>

          {/* Street 2 (Optional) */}
          <FormControl>
            <FormLabel>Street 2 (optional)</FormLabel>
            <Input
              type="text"
              name="street2"
              placeholder="Enter Street 2"
              value={formData.street2}
              onChange={handleChange}
            />
          </FormControl>

          {/* ZIP Code */}
          <FormControl isRequired>
            <FormLabel>ZIP Code</FormLabel>
            <Input
              type="text"
              name="zip"
              placeholder="Enter ZIP Code"
              value={formData.zip}
              onChange={handleChange}
            />
          </FormControl>

          {/* City */}
          <FormControl isRequired>
            <FormLabel>City</FormLabel>
            <Input
              type="text"
              name="city"
              placeholder="Enter City"
              value={formData.city}
              onChange={handleChange}
            />
          </FormControl>

          {/* State */}
          <FormControl isRequired>
            <FormLabel>State</FormLabel>
            <Select
              name="state"
              placeholder="Select state"
              value={formData.state}
              onChange={handleChange}
            >
              <option value="California">California</option>
              <option value="New York">New York</option>
              <option value="Texas">Texas</option>
              {/* Add more states as needed */}
            </Select>
          </FormControl>

          {/* Country (Read-Only) */}
          <FormControl isRequired>
            <FormLabel>Country</FormLabel>
            <Input
              type="text"
              name="country"
              placeholder="Enter Country"
              value={formData.country}
              readOnly
            />
          </FormControl>

          {/* Submit Button */}
          <Button colorScheme="blue" type="submit" width="full">
            Create
          </Button>

          {/* Navigate to Address History */}
          <Button
            colorScheme="blue"
            onClick={backToAddressHistory}
            width="full"
          >
            Address History
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default CreateAddresses;
