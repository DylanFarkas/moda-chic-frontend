import OrdersTable from "../../../components/OrdersTable/OrdersTable";
import Sidebar from "../../../components/Sidebar/Sidebar";
import './Orders.css';

const Orders = () => {
    return (
        <div className="orders-container">
            <Sidebar />
           <div className="orders-content">
                <h1 className="orders-title"> Pedidos </h1>
                <OrdersTable />
           </div>
        </div>

    );
};

export default Orders;