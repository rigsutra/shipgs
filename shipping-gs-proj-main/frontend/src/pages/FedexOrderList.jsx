// src/pages/FedexOrderList.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  HStack,
  Text,
  Divider,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useTable, useSortBy, usePagination } from "react-table";

function FedexOrderList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/getfedexorder",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch orders");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch FedEx orders.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    // Implement server-side filtering if needed
  };

  const handleCreateOrder = () => {
    navigate("/create-fedex-order");
  };

  const columns = useMemo(
    () => [
      { Header: "#", accessor: (_, i) => i + 1, disableSortBy: true },
      { Header: "OrderId", accessor: "orderId" },
      { Header: "Status", accessor: "status" },
      { Header: "Price", accessor: "price" },
      { Header: "Status Note", accessor: "note" },
      {
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Action",
        id: "action",
        Cell: ({ row }) => (
          <Button
            colorScheme="red"
            onClick={() => handleDelete(row.original._id)}
          >
            Delete
          </Button>
        ),
        disableSortBy: true,
      },
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
    gotoPage,
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useSortBy,
    usePagination
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await fetch(`http://localhost:5000/api/deleteorder/${id}`, {
          method: "DELETE",
        });
        setData(data.filter((order) => order._id !== id));
        toast({
          title: "Order deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete order",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="px-8 py-2">
      <HStack justify="space-between" pt={10} pb={5}>
        <Text fontSize="2xl">FedEx Order History</Text>
        <Button colorScheme="blue" onClick={handleCreateOrder}>
          + Create FedEx Order
        </Button>
      </HStack>
      <Divider mb={8} />
      <VStack spacing={4} align="stretch">
        <HStack>
          <Input
            placeholder="Search"
            value={searchInput}
            onChange={handleSearch}
          />
        </HStack>
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
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={row.original._id}>
                  {row.cells.map((cell) => (
                    <Td {...cell.getCellProps()} key={cell.column.id}>
                      {cell.render("Cell")}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <HStack justify="center" spacing={4}>
          <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </Button>
          <Button
            onClick={() => gotoPage(pageIndex - 1)}
            disabled={!canPreviousPage}
          >
            {"<"}
          </Button>
          <Text>
            Page {pageIndex + 1} of {pageOptions.length}
          </Text>
          <Button
            onClick={() => gotoPage(pageIndex + 1)}
            disabled={!canNextPage}
          >
            {">"}
          </Button>
          <Button
            onClick={() => gotoPage(pageOptions.length - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </Button>
        </HStack>
        <HStack spacing={2}>
          <Text>Rows per page:</Text>
          <Select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            width="80px"
          >
            {[5, 10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
        </HStack>
      </VStack>
    </div>
  );
}

export default FedexOrderList;
