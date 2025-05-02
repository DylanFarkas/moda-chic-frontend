import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login/Login.jsx";
import Home from "../pages/home/Home";
import AdminDashboard from "../pages/admindashboard/AdminDashboard.jsx";
import Products from "../pages/admindashboard/products/Products.jsx";
import Users from "../pages/admindashboard/users/Users.jsx";
import Statistics from "../pages/admindashboard/statistics/Statistics.jsx";
import Orders from "../pages/admindashboard/orders/Orders.jsx";
import Categories from "../pages/admindashboard/categories/Categories.jsx";
import Register from "../pages/register/Register.jsx";
import ForgotPassword from "../pages/login/ForgotPassword.jsx";
import ResetPassword from "../pages/login/ResetPassword.jsx";
import PantalonesPage from "../pages/home/PantalonesPage/PantalonesPage.jsx";
import ProductCards from "../components/ProductCards/ProductCards.jsx";
import CamisasPage from "../pages/home/CamisasPage/CamisasPage.jsx";

export default function RoutesProject() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pantalon-page" element={<PantalonesPage />} />
        <Route path="/camisa-page" element={<CamisasPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/users" element={<Users />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </BrowserRouter>
  );
}
