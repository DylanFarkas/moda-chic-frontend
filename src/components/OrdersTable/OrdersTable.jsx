import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../api/orders.api";
import "./OrdersTable.css";

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
    const [searchText, setSearchText] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function loadOrders() {
            const res = await getAllOrders();
            setOrders(res.data);
            setFilteredOrders(res.data);
        }
        loadOrders();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [orders, selectedStatusFilter, searchText, selectedDate]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            updateOrderStatus(orderId, { status: newStatus });
            const res = await getAllOrders();
            setOrders(res.data);
            window.location.reload();
        } catch (error) {
            console.error("Error actualizando estado:", error);
        }
    };

    const applyFilters = () => {
        let filtered = [...orders];

        if (selectedStatusFilter !== "all") {
            filtered = filtered.filter(order => order.status === selectedStatusFilter);
        }

        if (searchText.trim() !== "") {
            const lowerSearch = searchText.toLowerCase();
            filtered = filtered.filter(order =>
                order.nombre.toLowerCase().includes(lowerSearch) ||
                order.email.toLowerCase().includes(lowerSearch) ||
                order.direccion.toLowerCase().includes(lowerSearch) ||
                order.telefono.toLowerCase().includes(lowerSearch)
            );
        }

        if (selectedDate) {
            filtered = filtered.filter(order =>
                new Date(order.created_at).toISOString().startsWith(selectedDate)
            );
        }

        setFilteredOrders(filtered);
    };

    const openModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setIsModalOpen(false);
    };

    return (
        <div className="orders-content">
            <div className="filter-bar">
                <label>Estado:</label>
                <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="order-status-select"
                >
                    <option value="all">Todos</option>
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagado</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregado</option>
                    <option value="cancelled">Cancelado</option>
                </select>

                <label>Buscar:</label>
                <input
                    type="text"
                    placeholder="Nombre, email, dirección..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="order-filter-input"
                />

                <label>Fecha:</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="order-filter-input"
                />
            </div>

            <div className="table-wrapper">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Dirección</th>
                            <th>Teléfono</th>
                            <th>Fecha</th>
                            <th>Items</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.nombre}</td>
                                <td>{order.email}</td>
                                <td>{order.direccion}</td>
                                <td>{order.telefono}</td>
                                <td>{new Date(order.created_at).toLocaleString()}</td>
                                <td>
                                    <button onClick={() => openModal(order)} className="order-items-button">
                                        Ver detalles
                                    </button>
                                </td>
                                <td>
                                    <select
                                        className="order-status-select"
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    >
                                        <option value="pending">Pendiente</option>
                                        <option value="paid">Pagado</option>
                                        <option value="shipped">Enviado</option>
                                        <option value="delivered">Entregado</option>
                                        <option value="cancelled">Cancelado</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isModalOpen && selectedOrder && (
                    <div className="modal-overlay">
                        <div className="modal-content view-modal">
                            <h2 className="order-title-modal">Detalles del pedido #{selectedOrder.id}</h2>
                            <ul className="items-list">
                                {selectedOrder.items.map((item, idx) => (
                                    <li key={idx}>
                                        <strong>{item.product_name}</strong> ({item.size_name}) - x{item.quantity}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={closeModal} className="close-button">Cerrar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersTable;
