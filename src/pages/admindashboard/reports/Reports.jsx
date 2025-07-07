import Sidebar from "../../../components/Sidebar/Sidebar";
import ReportsManagement from "../../../components/ReportsManagement/ReportsManagement";
import "./Reports.css";

const Reports = () => {
    return (
        <div className="reports-container"> 
            <Sidebar />
            <div className="reports-content">
                <h1 className="reports-title"> Reportes </h1>
                <ReportsManagement />

            </div>
        </div>
    );
};

export default Reports;