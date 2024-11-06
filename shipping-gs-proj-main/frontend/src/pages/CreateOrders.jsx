import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  Select,
  SimpleGrid,
  VStack,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";

// Sample saved addresses
const savedAddresses = [
  { id: 1, name: "John Doe", address: "123 Main St, Cityville, State, 12345" },
  {
    id: 2,
    name: "Jane Smith",
    address: "456 Elm St, Townsville, State, 67890",
  },
];
const OrderForm = () => {
  const [isQuickOrder, setIsQuickOrder] = useState(true);

  const handleToggle = (orderType) => {
    setIsQuickOrder(orderType === "quick");
  };

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Box display="flex" justifyContent="center" mb={4}>
        <Button
          onClick={() => handleToggle("quick")}
          colorScheme={isQuickOrder ? "blue" : "gray"}
          variant="solid"
          mr={4}
        >
          Quick Order
        </Button>
        <Button
          onClick={() => handleToggle("normal")}
          colorScheme={!isQuickOrder ? "blue" : "gray"}
          variant="solid"
        >
          Normal Order
        </Button>
      </Box>

      {isQuickOrder ? <QuickOrderForm /> : <NormalOrderForm />}
    </Box>
  );
};

// Quick Order Form Component
const QuickOrderForm = () => {
  const [type, setType] = useState("");
  const [weight, setWeight] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [template, setTemplate] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleQuickOrderSubmit = async () => {
    const token = sessionStorage.getItem("userToken");

    const fromAddressParts = fromAddress.split(",");
    const toAddressParts = toAddress.split(",");

    const quickOrderData = {
      order_type: type,
      weight: parseFloat(weight) || 0,
      template: template || null,
      total_price: price,
      fromAddress: {
        name: "Rahul Sharma",
        company_name: "Tech Solutions",
        street1: fromAddressParts[0]?.trim() || "",
        street2: null,
        city: fromAddressParts[1]?.trim() || "",
        state: fromAddressParts[2]?.trim() || "",
        zip_code: fromAddressParts[3]?.trim() || "",
        country: "India",
      },
      toAddress: {
        name: "Priya Gupta",
        company_name: "Fashion Hub",
        street1: toAddressParts[0]?.trim() || "",
        street2: null,
        city: toAddressParts[1]?.trim() || "",
        state: toAddressParts[2]?.trim() || "",
        zip_code: toAddressParts[3]?.trim() || "",
        country: "India",
      },
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/orders/quick",
        quickOrderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Quick order response:", response.data);
      toast({
        title: "Quick Order Submitted",
        description: "Your quick order has been submitted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Optionally reset form fields here
    } catch (error) {
      console.error("Error submitting quick order:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "There was an error submitting your quick order.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPrice = async (orderType) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/getPrices", {
        type: orderType,
      });
      setPrice(response.data.price);
    } catch (error) {
      console.error("Error fetching price:", error);
      toast({
        title: "Error",
        description: "Failed to fetch price.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type) {
      fetchPrice(type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <Box>
      <SimpleGrid columns={[1, null, 2]} spacing={6} mb={4}>
        <VStack spacing={4}>
          <Text fontSize="lg">Type</Text>
          <Select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setTemplate("");
            }}
            placeholder="Select type"
          >
            <option value="USPS Ground OZ">USPS Ground OZ</option>
            <option value="USPS Ground lb">USPS Ground lb</option>
            <option value="USPS Priority">USPS Priority</option>
            <option value="USPS Express">USPS Express</option>
            <option value="USPS Priority v2">USPS Priority v2</option>
          </Select>
        </VStack>

        <VStack>
          <Text fontSize="lg">Weight</Text>
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight"
          />
        </VStack>
      </SimpleGrid>

      {type === "USPS Priority" && (
        <SimpleGrid columns={2} spacing={6} mb={4}>
          <VStack>
            <Text fontSize="lg">Template</Text>
            <Select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder="Select template"
            >
              <option value="Pitney Bowes">Pitney Bowes</option>
              <option value="Indica">Indica</option>
              <option value="EVS">EVS</option>
            </Select>
          </VStack>
        </SimpleGrid>
      )}

      <SimpleGrid columns={2} spacing={6}>
        <AddressSection
          title="From Address"
          address={fromAddress}
          setAddress={setFromAddress}
        />
        <AddressSection
          title="To Address"
          address={toAddress}
          setAddress={setToAddress}
        />
      </SimpleGrid>

      <Flex justify="center" mt={6}>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleQuickOrderSubmit}
          isLoading={loading}
        >
          Create Quick Order ₹{price}
        </Button>
      </Flex>
    </Box>
  );
};

// Normal Order Form Component
const NormalOrderForm = () => {
  const [type, setType] = useState("");
  const [weight, setWeight] = useState("");
  const [template, setTemplate] = useState(""); // State for templates
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  // From Address States
  const [fromName, setFromName] = useState("");
  const [fromCompany, setFromCompany] = useState("");
  const [fromStreet, setFromStreet] = useState("");
  const [fromStreet2, setFromStreet2] = useState("");
  const [fromZipCode, setFromZipCode] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [fromState, setFromState] = useState("");
  const [fromCountry, setFromCountry] = useState("");

  // To Address States
  const [toName, setToName] = useState("");
  const [toCompany, setToCompany] = useState("");
  const [toStreet, setToStreet] = useState("");
  const [toStreet2, setToStreet2] = useState("");
  const [toZipCode, setToZipCode] = useState("");
  const [toCity, setToCity] = useState("");
  const [toState, setToState] = useState("");
  const [toCountry, setToCountry] = useState("");

  const toast = useToast();

  const fetchPrice = async (orderType) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/getPrices", {
        type: orderType,
      });
      setPrice(response.data.price);
    } catch (error) {
      console.error("Error fetching price:", error);
      toast({
        title: "Error",
        description: "Failed to fetch price.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type) {
      fetchPrice(type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleSubmit = async () => {
    const normalOrderData = {
      // Removed 'id' as Mongoose handles '_id' automatically
      order_type: type, // Use the selected type for the order
      weight: parseFloat(weight) || 0, // Ensure weight is a number
      template: template || null, // Use template or null
      total_price: price, // Use the fetched price
      fromAddress: {
        name: fromName, // Dynamic input
        company_name: fromCompany || null, // Optional field
        street1: fromStreet, // Dynamic input
        street2: fromStreet2 || null, // Optional field
        zip_code: fromZipCode, // Dynamic input
        city: fromCity, // Dynamic input
        state: fromState, // Dynamic input
        country: fromCountry || "India", // Default to India if empty
      },
      toAddress: {
        name: toName, // Dynamic input
        company_name: toCompany || null, // Optional field
        street1: toStreet, // Dynamic input
        street2: toStreet2 || null, // Optional field
        zip_code: toZipCode, // Dynamic input
        city: toCity, // Dynamic input
        state: toState, // Dynamic input
        country: toCountry || "India", // Default to India if empty
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders/normal",
        normalOrderData
      );
      console.log("Normal order response:", response.data);
      toast({
        title: "Normal Order Submitted",
        description: "Your normal order has been submitted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Optionally reset form fields here
    } catch (error) {
      console.error("Error submitting normal order:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "There was an error submitting your normal order.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <SimpleGrid columns={[1, null, 2]} spacing={6} mb={4}>
        <VStack spacing={4}>
          <Text fontSize="lg">Type</Text>
          <Select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setTemplate(""); // Clear template if type changes
            }}
            placeholder="Select type"
          >
            <option value="USPS Ground OZ">USPS Ground OZ</option>
            <option value="USPS Ground lb">USPS Ground lb</option>
            <option value="USPS Priority">USPS Priority</option>
            <option value="USPS Express">USPS Express</option>
            <option value="USPS Priority v2">USPS Priority v2</option>
          </Select>
        </VStack>

        <VStack>
          <Text fontSize="lg">Weight</Text>
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight"
          />
        </VStack>
      </SimpleGrid>

      {/* Conditional rendering of Template field for USPS Priority */}
      {type === "USPS Priority" && (
        <SimpleGrid columns={2} spacing={6} mb={4}>
          <VStack>
            <Text fontSize="lg">Template</Text>
            <Select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder="Select template"
            >
              <option value="Pitney Bowes">Pitney Bowes</option>
              <option value="Indica">Indica</option>
              <option value="EVS">EVS</option>
            </Select>
          </VStack>
        </SimpleGrid>
      )}

      {/* From and To Address Sections */}
      <SimpleGrid columns={[1, null, 2]} spacing={6}>
        <AddressForm
          title="From"
          name={fromName}
          setName={setFromName}
          company={fromCompany}
          setCompany={setFromCompany}
          street={fromStreet}
          setStreet={setFromStreet}
          street2={fromStreet2}
          setStreet2={setFromStreet2}
          zipCode={fromZipCode}
          setZipCode={setFromZipCode}
          city={fromCity}
          setCity={setFromCity}
          state={fromState}
          setState={setFromState}
          country={fromCountry}
          setCountry={setFromCountry}
        />
        <AddressForm
          title="To"
          name={toName}
          setName={setToName}
          company={toCompany}
          setCompany={setToCompany}
          street={toStreet}
          setStreet={setToStreet}
          street2={toStreet2}
          setStreet2={setToStreet2}
          zipCode={toZipCode}
          setZipCode={setToZipCode}
          city={toCity}
          setCity={setToCity}
          state={toState}
          setState={setToState}
          country={toCountry}
          setCountry={setToCountry}
        />
      </SimpleGrid>

      <Flex justify="center" mt={6}>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleSubmit}
          isLoading={loading}
        >
          Create Normal Order ₹{price}
        </Button>
      </Flex>
    </Box>
  );
};

// Reusable Address Section for Quick Order
const AddressSection = ({ title, address, setAddress }) => (
  <VStack
    spacing={4}
    p={4}
    bg="gray.800"
    borderRadius="md"
    boxShadow="md"
    color="white"
  >
    <Text fontSize="lg" fontWeight="bold">
      {title} Address
    </Text>
    <Select
      placeholder="Select saved address"
      onChange={(e) => setAddress(e.target.value)}
    >
      {savedAddresses.map((addr) => (
        <option key={addr.id} value={addr.address} style={{ color: "black" }}>
          {addr.name} - {addr.address}
        </option>
      ))}
    </Select>
    <Box p={2} bg="gray.700" borderRadius="md" w="100%">
      <Text>Selected Address:</Text>
      <Text>{address}</Text>
    </Box>
  </VStack>
);

// Reusable Address Form for Normal Order
import PropTypes from "prop-types";

const AddressForm = ({
  title,
  name,
  setName,
  company,
  setCompany,
  street,
  setStreet,
  street2,
  setStreet2,
  zipCode,
  setZipCode,
  city,
  setCity,
  state,
  setState,
  country,
  setCountry,
}) => (
  <VStack spacing={4} p={4} bg="gray.800" borderRadius="md" boxShadow="md">
    <Text fontSize="lg" fontWeight="bold">
      {title} Address
    </Text>
    <Input
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Name"
    />
    <Input
      value={company}
      onChange={(e) => setCompany(e.target.value)}
      placeholder="Company"
    />
    <Input
      value={street}
      onChange={(e) => setStreet(e.target.value)}
      placeholder="Street"
    />
    <Input
      value={street2}
      onChange={(e) => setStreet2(e.target.value)}
      placeholder="Street 2 (optional)"
    />
    <Input
      value={zipCode}
      onChange={(e) => setZipCode(e.target.value)}
      placeholder="ZIP Code"
    />
    <Input
      value={city}
      onChange={(e) => setCity(e.target.value)}
      placeholder="City"
    />
    <Select
      value={state}
      onChange={(e) => setState(e.target.value)}
      placeholder="Select state"
      textColor={"white"}
    >
      <option value="State 1">State 1</option>
      <option value="State 2">State 2</option>
      {/* Add more states as needed */}
    </Select>
    <Select
      value={country}
      onChange={(e) => setCountry(e.target.value)}
      placeholder="Select country"
     
    >
      <option value="India">India</option>
      <option value="United States">United States</option>
      <option value="Canada">Canada</option>
      {/* Add more countries as needed */}
    </Select>
  </VStack>
);

AddressForm.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
  company: PropTypes.string,
  setCompany: PropTypes.func.isRequired,
  street: PropTypes.string.isRequired,
  setStreet: PropTypes.func.isRequired,
  street2: PropTypes.string,
  setStreet2: PropTypes.func.isRequired,
  zipCode: PropTypes.string.isRequired,
  setZipCode: PropTypes.func.isRequired,
  city: PropTypes.string.isRequired,
  setCity: PropTypes.func.isRequired,
  state: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
  country: PropTypes.string.isRequired,
  setCountry: PropTypes.func.isRequired,
};

export default OrderForm;
