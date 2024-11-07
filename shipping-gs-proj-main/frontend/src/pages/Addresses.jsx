import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  HStack,
  Select,
  Text,
  Divider,
} from "@chakra-ui/react";
import { useTable, useSortBy, usePagination } from "react-table";
import { useNavigate } from "react-router-dom";
const baseUrl = import.meta.env.VITE_BASE_URL;
function Addresses() {
  const [data, setData] = useState([]); // State to hold API data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const navigate = useNavigate();

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/getaddresses`); // Replace with your API endpoint
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = React.useMemo(
    () => [
      { Header: "No", accessor: "no" },
      { Header: "Name", accessor: "name" },
      { Header: "Country", accessor: "country" },
      { Header: "Date", accessor: "date", isSortable: true },
      { Header: "Street2", accessor: "street2" },
      { Header: "City", accessor: "city" },
      { Header: "State", accessor: "state" },
      { Header: "Zip", accessor: "zip" },
      { Header: "Action", accessor: "action" },
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
    state: { pageIndex, pageSize, sortBy },
    setPageSize,
    setFilter,
    gotoPage,
    toggleSortBy,
  } = useTable({ columns, data }, useSortBy, usePagination);

  const createAddress = () => {
    navigate("/CreateAddresses");
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setFilter("name", value || undefined); // Set filter for the 'name' column
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOrder(value);
    toggleSortBy("no", value === "asc"); // Toggle sort order
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <div className="px-8 py-2">
      <div className="flex pt-10 pb-5 items-center justify-between">
        <p className="text-heading2-bold text-sm">Addresses History</p>
        <Button colorScheme="blue" onClick={createAddress}>
          + Create Address
        </Button>
      </div>
      <Divider className="bg-grey-200 mb-8" />
      <VStack spacing={4} align="stretch">
        <div className="flex items-center justify-between">
          <HStack spacing={2}>
            <Input
              placeholder="Search by name"
              value={searchInput}
              onChange={handleSearch}
              width="300px"
            />
            <Button onClick={() => setSearchInput("")}>Clear</Button>
          </HStack>
          <HStack spacing={2}>
            <Text>Sort by Date:</Text>
            <Select value={sortOrder} onChange={handleSortChange} width="190px">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Select>
          </HStack>
        </div>

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
            {page.map((row) => {
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
            })}
          </Tbody>
        </Table>

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
        </HStack>

        <HStack spacing={2}>
          <Text>Rows per page:</Text>
          <Input
            type="number"
            value={pageSize || ""} // Default to empty string if pageSize is 0
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || Number(value) > 0) {
                setPageSize(value === "" ? 10 : Number(value)); // Default to 10 rows if empty
              }
            }}
            width="60px"
          />
        </HStack>
      </VStack>
    </div>
  );
}

export default Addresses;
