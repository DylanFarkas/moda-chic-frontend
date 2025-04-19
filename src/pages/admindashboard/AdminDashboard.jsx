import DashboardCards from "../../components/DashboardCards/DashboardCards";
import Sidebar from "../../components/Sidebar/Sidebar";
import { FaCrown } from "react-icons/fa6";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-container">
      <Sidebar />
      <main className="admin-content">
        <h1 className="dashboard-title">
          Bienvenido, Administrador <FaCrown className="crown-icon" />
        </h1>
        <DashboardCards />
      </main>
    </div>
  );
};

export default AdminDashboard;
