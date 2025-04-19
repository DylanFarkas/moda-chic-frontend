import Sidebar from "../../../components/Sidebar/Sidebar";
import './Orders.css';

const Orders = () => {
    return (
        <div className="orders-container">
            <Sidebar />
           <div className="orders-content">
                <h1>Pedidos</h1>
           </div>
        </div>

    );
};

export default Orders;