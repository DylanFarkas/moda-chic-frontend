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

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

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
        setCurrentPage(1);
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

    const clearFilters = () => {
        setSelectedStatusFilter("all");
        setSearchText("");
        setSelectedDate("");
    };

    // Paginación
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="orders-content">
            <div className="filters-container">
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

                <input
                    type="text"
                    placeholder="Nombre, email, dirección..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="order-filter-input"
                />

                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="order-filter-input"
                />
                <button onClick={clearFilters} className="clear-filters-button">
                    Limpiar filtros
                </button>
            </div>

            {/* Selector de cantidad por página */}
            <div className="pagination-settings">
                <label>Órdenes por página:</label>
                <select
                    value={itemsPerPage}
                    onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="items-per-page-select"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
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
                        {paginatedOrders.map((order) => (
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
                                        className={`order-status-select ${order.status}`}
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

                {/* Modal */}
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
            {/* Controles de paginación */}
            <div className="pagination">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    ⬅
                </button>
                <span className="pagination-info">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                >
                    ➡
                </button>
            </div>
        </div>
    );
};

export default OrdersTable;
