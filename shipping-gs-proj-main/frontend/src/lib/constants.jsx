// src/lib/constants.js
import { Activity, House, ShoppingCart, Tag, Wallet, User } from "lucide-react";

export const navLinks = [
  {
    url: "/",
    icon: <Activity />,
    label: "Dashboard",
    role: "user", // Visible to all users
  },
  {
    url: "/createOrders",
    icon: <ShoppingCart />,
    label: "USPS Create Order",
    role: "user", // Only visible to regular users
  },
  {
    url: "/fedex-orders",
    icon: <ShoppingCart />,
    label: "Fedex Order",
    role: "user", // Only visible to regular users
  },
  {
    url: "/Deposits",
    icon: <Wallet />,
    label: "Deposits",
    role: "user", // Only visible to regular users
  },
  {
    url: "/Addresses",
    icon: <House />,
    label: "Addresses",
    role: "user", // Only visible to regular users
  },
  {
    url: "/FAQs",
    icon: <Tag />,
    label: "FAQs",
    role: "user", // Visible to all users
  },
  {
    url: "/admin-dashboard",
    icon: <User />,
    label: "Admin Dashboard",
    role: "admin", // Only visible to admins
  },
  {
    url: "/admin-orders",
    icon: <ShoppingCart />,
    label: "Orders Management",
    role: "admin", // Only visible to admins
  },
  {
    url: "/admin-revenue",
    icon: <Wallet />,
    label: "Revenue",
    role: "admin", // Only visible to admins
  },
  {
    url: "/admin-faqs",
    icon: <Tag />,
    label: "FAQs Management",
    role: "admin", // Only visible to admins
  },
];
