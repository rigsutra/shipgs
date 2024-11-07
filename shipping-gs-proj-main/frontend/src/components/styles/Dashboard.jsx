import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Divider,
  VStack,
  HStack,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
} from "@chakra-ui/react";
import { CircleDollarSign, ShoppingBag, UserPen } from "lucide-react";
import { useTable, useSortBy, usePagination } from "react-table";
import { useNavigate } from "react-router-dom";
const baseUrl = import.meta.env.VITE_BASE_URL;

function Dashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [orders, setOrders] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [userName, setUser] = useState(""); // State for admin name

  const navigate = useNavigate();

  const EditProfile = () => {
    navigate("/Profile");
  };

  // Fetch admin name
  useEffect(() => {
    // Retrieve the user data from localStorage
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      try {
        // Parse the JSON string back to an object
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user data", error);
      }
    }
  }, []);
  // Fetch orders and calculate totals
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/USPSOrders`);
        const data = await response.json();

        // Log the fetched data to check if it's coming through correctly
        console.log("Fetched Orders: ", data);

        // Access the orders array from data.orders
        if (Array.isArray(data.orders) && data.orders.length > 0) {
          setOrders(data.orders);

          // Calculate total revenue and total orders
          const revenue = data.orders.reduce(
            (acc, order) => acc + (parseFloat(order.total_price) || 0),
            0
          );
          const orderCount = data.totalOrders || data.orders.length;

          setTotalRevenue(revenue);
          setTotalOrders(orderCount);
        } else {
          // Handle case when orders array is empty or not present
          setOrders([]);
          setTotalRevenue(0);
          setTotalOrders(0);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setFilter("name", value || undefined); // Assuming "name" is the searchable column
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOrder(value);
    toggleSortBy("order_date", value === "asc");
  };

  // Format date to show only date, no time
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };

  // Define table columns based on your provided structure
  const columns = React.useMemo(
    () => [
      { Header: "#", accessor: (row, i) => i + 1 }, // Index number for each row
      { Header: "From", accessor: "fromAddress.name" }, // Accessing nested field
      { Header: "From Company", accessor: "fromAddress.company_name" }, // Accessing nested field
      { Header: "To", accessor: "toAddress.name" }, // Accessing nested field
      { Header: "To Company", accessor: "toAddress.company_name" }, // Accessing nested field
      { Header: "Type", accessor: "order_type" }, // Changed to "order_type"
      { Header: "Amount", accessor: "total_price" }, // Changed to "total_price"
      { Header: "Status", accessor: "status" }, // No change needed
      { Header: "Tracking", accessor: "tracking" }, // Assuming tracking exists or is empty
      {
        Header: "Date",
        accessor: "order_date",
        Cell: ({ value }) => formatDate(value), // Format the date
        isSortable: true,
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: () => <Button>View</Button>,
      }, // Action button
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex, pageSize },
    setPageSize,
    setFilter,
    gotoPage,
    toggleSortBy,
  } = useTable({ columns, data: orders }, useSortBy, usePagination);

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
            <p>{userName.name || "Loading..."}</p> {/* Display admin name */}
          </div>
        </div>
      </div>
      <Divider className="bg-grey-200 mb-7 mt-5" />

      {/* Total Revenue & Orders */}
      <div className="px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <Heading size="md">Total Revenue</Heading>
              <CircleDollarSign className="max-sm:hidden" />
            </CardHeader>
            <CardBody>
              <Text className="text-body-bold" fontSize="4xl">
                {totalRevenue.toFixed(2)} {/* Show total revenue */}
              </Text>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <Heading size="md">Total Orders</Heading>
              <ShoppingBag className="max-sm:hidden" />
            </CardHeader>
            <CardBody>
              <Text className="text-body-bold" fontSize="4xl">
                {totalOrders} {/* Show total number of orders */}
              </Text>
            </CardBody>
          </Card>
        </div>

        {/* Divider */}
        <Divider className="bg-grey-200 mt-10" />

        {/* Table Search and Sorting */}
        <p className="text-heading2-bold py-10 text-sm">Order History</p>
        <VStack spacing={4} align="stretch">
          <div className="flex items-center justify-between">
            <HStack spacing={2}>
              <Input
                placeholder="Search by From"
                value={searchInput}
                onChange={handleSearch}
                width="300px"
              />
              <Button onClick={() => setSearchInput("")}>Clear</Button>
            </HStack>

            {/* Sort Order Selection */}
            <HStack spacing={2}>
              <Text>Sort by Date:</Text>
              <Select
                value={sortOrder}
                onChange={handleSortChange}
                width="190px"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </Select>
            </HStack>
          </div>

          {/* Data Table */}
          <Table {...getTableProps()} variant="simple">
            <Thead>
              {headerGroups.map((headerGroup) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={column.id}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.length > 0 ? (
                page.map((row) => {
                  prepareRow(row);
                  return (
                    <Tr {...row.getRowProps()} key={row.id}>
                      {row.cells.map((cell) => (
                        <Td {...cell.getCellProps()} key={cell.column.id}>
                          {cell.render("Cell")}
                        </Td>
                      ))}
                    </Tr>
                  );
                })
              ) : (
                <Tr>
                  <Td colSpan={columns.length} textAlign="center">
                    No data available
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>

          {/* Pagination Controls */}
          <HStack spacing={4}>
            <Button onClick={() => gotoPage(0)} isDisabled={!canPreviousPage}>
              {"<<"}
            </Button>
            <Button
              onClick={() => gotoPage(pageIndex - 1)}
              isDisabled={!canPreviousPage}
            >
              {"<"}
            </Button>
            <Text>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </Text>
            <Button
              onClick={() => gotoPage(pageIndex + 1)}
              isDisabled={!canNextPage}
            >
              {">"}
            </Button>
            <Button
              onClick={() => gotoPage(pageOptions.length - 1)}
              isDisabled={!canNextPage}
            >
              {">>"}
            </Button>

            {/* Page Size Selector */}
            <Select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              width="150px"
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </Select>
          </HStack>
        </VStack>
      </div>
    </div>
  );
}

export default Dashboard;
