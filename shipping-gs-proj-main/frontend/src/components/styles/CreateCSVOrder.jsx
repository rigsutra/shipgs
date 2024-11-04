// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Papa from "papaparse"; // Import Papa Parse for CSV parsing

// const CsvOrderForm = () => {
//   const [labelType, setLabelType] = useState("");
//   const [csvFile, setCsvFile] = useState(null);
//   const [validated, setValidated] = useState(false);
//   const [orderData, setOrderData] = useState([]);
//   const [validationError, setValidationError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Required columns in the CSV
//   const requiredHeaders = [
//     "#",
//     "Order Date",
//     "Orders",
//     "LabelType",
//     "Status",
//     "Price",
//     "Action",
//   ];

//   // Handle CSV file input
//   const handleFileUpload = (e) => {
//     setCsvFile(e.target.files[0]);
//     setValidated(false); // Reset validation status on new file upload
//     setValidationError(""); // Clear previous errors
//   };

//   // Download sample CSV
//   const downloadSampleCsv = () => {
//     const sampleData = [
//       {
//         "#": 1,
//         "Order Date": "YYYY-MM-DD",
//         Orders: "Order Number",
//         LabelType: "Type 1",
//         Status: "Pending",
//         Price: "$0.00",
//         Action: "Pay $0",
//       },
//       {
//         "#": 2,
//         "Order Date": "YYYY-MM-DD",
//         Orders: "Order Number",
//         LabelType: "Type 2",
//         Status: "Pending",
//         Price: "$0.00",
//         Action: "Pay $0",
//       },
//     ];

//     const csv = Papa.unparse(sampleData); // Convert sample data to CSV format
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);

//     // Create a temporary anchor element to trigger download
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "sample_orders.csv"); // Specify the file name
//     document.body.appendChild(link);
//     link.click(); // Trigger the download
//     document.body.removeChild(link); // Clean up
//   };

//   // Validate CSV
//   const handleValidateCsv = () => {
//     if (!csvFile) {
//       alert("Please upload a CSV file!");
//       return;
//     }

//     // Parse the CSV file using Papa Parse
//     Papa.parse(csvFile, {
//       header: true,
//       complete: function (results) {
//         const data = results.data;
//         const headers = results.meta.fields;

//         // Check if all required headers are present
//         const missingHeaders = requiredHeaders.filter(
//           (header) => !headers.includes(header)
//         );
//         if (missingHeaders.length > 0) {
//           setValidationError(`Missing columns: ${missingHeaders.join(", ")}`);
//           return;
//         }

//         // Further data validation
//         const invalidRow = data.find((row) => {
//           return requiredHeaders.some(
//             (header) => !row[header] || row[header].trim() === ""
//           );
//         });

//         if (invalidRow) {
//           setValidationError("Some rows have empty required fields.");
//           return;
//         }

//         setValidated(true);
//         alert("CSV Validated!");
//       },
//       error: function (error) {
//         setValidationError("Error parsing CSV: " + error.message);
//       },
//     });
//   };

//   // Submit the data and create order on "Pay $0"
//   const handlePay = async () => {
//     if (!csvFile || !validated || !labelType) {
//       alert(
//         "Please make sure the CSV is validated and label type is selected."
//       );
//       return;
//     }

//     setIsLoading(true);

//     const formData = new FormData();
//     formData.append("csvFile", csvFile);
//     formData.append("labelType", labelType);

//     try {
//       // Uncomment this when you have the backend setup for handling orders
//       /*
//       const response = await axios.post("/api/orders", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("Order created successfully!");
//       setOrderData((prevData) => [...prevData, response.data]);
//       */

//       // For now, you can simulate order creation like this:
//       const mockOrder = {
//         orderDate: "2024-10-11",
//         orders: "1001",
//         labelType,
//         status: "Pending",
//         price: "$0.00",
//         action: "Pay $0",
//       };
//       setOrderData((prevData) => [...prevData, mockOrder]);

//       setCsvFile(null);
//       setLabelType("");
//       setValidated(false);
//     } catch (error) {
//       console.error("Error creating order:", error);
//       alert("Failed to create order.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch existing orders from the database
//   const fetchOrders = async () => {
//     try {
//       // Uncomment this when you have the backend API for fetching orders
//       /*
//       const response = await axios.get("/api/orders");
//       setOrderData(response.data);
//       */

//       // Simulate fetching some premade data
//       const mockOrders = [
//         {
//           orderDate: "2024-10-10",
//           orders: "1000",
//           labelType: "Type 1",
//           status: "Completed",
//           price: "$10.00",
//           action: "View",
//         },
//         {
//           orderDate: "2024-10-09",
//           orders: "999",
//           labelType: "Type 2",
//           status: "Pending",
//           price: "$5.00",
//           action: "Pay $0",
//         },
//       ];
//       setOrderData(mockOrders);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   useEffect(() => {
//     fetchOrders(); // Fetch orders on component mount
//   }, []);

//   return (
//     <div className="p-8 bg-gray-900 text-white rounded-lg mx-auto shadow-lg">
//       <h2 className="text-2xl font-bold mb-6">Create CSV Order</h2>

//       <div className="mb-6">
//         <label className="block mb-2 text-lg">Label Type</label>
//         <select
//           value={labelType}
//           onChange={(e) => setLabelType(e.target.value)}
//           className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full"
//         >
//           <option value="">Select Label Type</option>
//           <option value="Type1">Type 1</option>
//           <option value="Type2">Type 2</option>
//           {/* Add more label types here */}
//         </select>
//       </div>

//       <div className="mb-6">
//         <label className="block mb-2 text-lg">CSV File</label>
//         <input
//           type="file"
//           accept=".csv"
//           onChange={handleFileUpload}
//           className="p-3 bg-gray-700 border border-gray-600 rounded-lg w-full"
//         />
//       </div>

//       <div className="flex items-center space-x-4">
//         <button
//           onClick={handleValidateCsv}
//           className="p-3 bg-blue-500 rounded-lg w-1/2"
//         >
//           Validate CSV
//         </button>
//         <button
//           onClick={handlePay}
//           className={`p-3 bg-green-500 rounded-lg w-1/2 ${
//             isLoading ? "opacity-50" : ""
//           }`}
//           disabled={isLoading || !validated}
//         >
//           {isLoading ? "Processing..." : "Pay $0"}
//         </button>
//       </div>

//       <div className="mt-4">
//         <button
//           onClick={downloadSampleCsv}
//           className="p-3 bg-yellow-500 rounded-lg"
//         >
//           Download Sample CSV
//         </button>
//       </div>

//       {validationError && (
//         <div className="text-red-500 mt-4">
//           <strong>Error:</strong> {validationError}
//         </div>
//       )}

//       <h3 className="text-xl font-bold mt-8">CSV Orders</h3>
//       <table className="w-full mt-4 table-auto border-collapse border border-gray-600">
//         <thead>
//           <tr>
//             <th className="border border-gray-600 p-3">#</th>
//             <th className="border border-gray-600 p-3">Order Date</th>
//             <th className="border border-gray-600 p-3">Orders</th>
//             <th className="border border-gray-600 p-3">Label Type</th>
//             <th className="border border-gray-600 p-3">Status</th>
//             <th className="border border-gray-600 p-3">Price</th>
//             <th className="border border-gray-600 p-3">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orderData.length > 0 ? (
//             orderData.map((order, index) => (
//               <tr key={index}>
//                 <td className="border border-gray-600 p-3">{index + 1}</td>
//                 <td className="border border-gray-600 p-3">
//                   {order.orderDate}
//                 </td>
//                 <td className="border border-gray-600 p-3">{order.orders}</td>
//                 <td className="border border-gray-600 p-3">
//                   {order.labelType}
//                 </td>
//                 <td className="border border-gray-600 p-3">{order.status}</td>
//                 <td className="border border-gray-600 p-3">{order.price}</td>
//                 <td className="border border-gray-600 p-3">{order.action}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td className="border border-gray-600 p-3" colSpan="7">
//                 No orders available.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CsvOrderForm;
