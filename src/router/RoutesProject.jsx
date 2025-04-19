import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login/Login.jsx";
import Home from "../pages/home/Home";
import AdminDashboard from "../pages/admindashboard/AdminDashboard.jsx";
import Products from "../pages/admindashboard/products/Products.jsx";
import Users from "../pages/admindashboard/users/Users.jsx";
import Statistics from "../pages/admindashboard/statistics/Statistics.jsx";
import Orders from "../pages/admindashboard/orders/Orders.jsx";

export default function RoutesProject() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/users" element={<Users />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </BrowserRouter>
  );
}
