// // src/components/layout/TopBar.jsx
// import React from "react";
// import { UserPen } from "lucide-react";

// function TopBar({ userName, balance, onEditProfile }) {
//   return (
//     <header className="flex px-4 pt-8 pb-4 rounded-b-lg items-center justify-between bg-blue-400 h-full fixed w-full top-0 z-50">
//       <h2 className="text-heading2-bold">Dashboard</h2>
//       <div
//         onClick={onEditProfile}
//         className="flex gap-3 cursor-pointer items-center text-body-medium"
//       >
//         {/* <h1 className="text-[1.85rem]">${balance.toFixed(2)}</h1> */}
//         <div className="flex">
//           <UserPen />
//           <p>{userName || "Loading..."}</p>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default TopBar;
