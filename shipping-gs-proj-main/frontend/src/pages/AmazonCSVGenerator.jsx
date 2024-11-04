// import React, { useState } from "react";

// const AmazonCSVGenerator = () => {
//   // Form state to handle all input fields
//   const [formData, setFormData] = useState({
//     file: null,
//     weight: "",
//     name: "",
//     street1: "",
//     street2: "",
//     city: "",
//     state: "",
//     zip: "",
//   });

//   // Handle form data change
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: files ? files[0] : value, // Handle file upload separately
//     });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission behavior

//     // Create FormData to handle file uploads
//     const formDataToSend = new FormData();
//     formDataToSend.append("file", formData.file);
//     formDataToSend.append("weight", formData.weight);
//     formDataToSend.append("name", formData.name);
//     formDataToSend.append("street1", formData.street1);
//     formDataToSend.append("street2", formData.street2);
//     formDataToSend.append("city", formData.city);
//     formDataToSend.append("state", formData.state);
//     formDataToSend.append("zip", formData.zip);

//     // Submit form data to the backend
//     try {
//       const response = await fetch("/api/generate-csv", {
//         method: "POST",
//         body: formDataToSend,
//       });

//       if (response.ok) {
//         alert("CSV generated successfully!");
//       } else {
//         alert("Failed to generate CSV");
//       }
//     } catch (error) {
//       console.error("Error generating CSV:", error);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-900 text-white rounded-md">
//       <h2 className="text-2xl font-semibold mb-4">Generate Amazon CSV</h2>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* File Upload */}
//         <div className="flex flex-col">
//           <label className="font-medium">Select File</label>
//           <input
//             type="file"
//             name="file"
//             accept=".csv"
//             onChange={handleChange}
//             className="mt-2 p-2 bg-gray-800 text-gray-300 rounded"
//           />
//         </div>

//         {/* Weight Input */}
//         <div className="flex flex-col">
//           <label className="font-medium">Weight</label>
//           <input
//             type="text"
//             name="weight"
//             value={formData.weight}
//             onChange={handleChange}
//             className="mt-2 p-2 bg-gray-800 text-gray-300 rounded"
//             placeholder="Enter weight"
//           />
//         </div>

//         <h3 className="text-xl font-semibold">From Details</h3>

//         {/* Name Input */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="flex flex-col">
//             <label className="font-medium">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="mt-2 p-2 bg-gray-800 text-gray-300 rounded"
//               placeholder="Enter name"
//             />
//           </div>

//           {/* Street 1 Input */}
//           <div className="flex flex-col">
//             <label className="font-medium">Street 1</label>
//             <input
//               type="text"
//               name="street1"
//               value={formData.street1}
//               onChange={handleChange}
//               className="mt-2 p-2 bg-gray-800 text-gray-300 rounded"
//               placeholder="Enter street 1"
//             />
//           </div>
//         </div>

//         {/* Street 2 Input */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="flex flex-col">
//             <label className="font-medium">Street 2 (Optional)</label>
//             <input
//               type="text"
//               name="street2"
//               value={formData.street2}
//               onChange={handleChange}
//               className="mt-2 p-2 bg-gray-800 text-gray-300 rounded"
//               placeholder="Enter street 2"
//             />
//           </div>

//           {/* City Input */}
//           <div className="flex flex-col">
//             <label className="font-medium">City</label>
//             <input
//               type="text"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//               className="mt-2 p-2 bg-gray-800 text-gray-300 rounded"
//               placeholder="Enter city"
//             />
//           </div>
//         </div>

//         {/* State and ZIP Input */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="flex flex-col">
//             <label className="font-medium">State</label>
//             <input
//               type="text"
//               name="state"
//               value={formData.state}
//               onChange={handleChange}
//               className="mt-2 p-2 bg-gray-800 text-gray-300 rounded"
//               placeholder="Enter state"
//             />
//           </div>

//           <div className="flex flex-col">
//             <label className="font-medium">ZIP</label>
//             <input
//               type="text"
//               name="zip"
//               value={formData.zip}
//               onChange={handleChange}
//               className="mt-2 p-2 bg-gray-800 text-gray-300 rounded"
//               placeholder="Enter ZIP code"
//             />
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="mt-4 bg-green-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-green-600"
//         >
//           Generate CSV
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AmazonCSVGenerator;
