import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../api/orders.api";
import Swal from 'sweetalert2';
import "./OrdersTable.css";

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
    const [searchText, setSearchText] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchId, setSearchId] = useState("");

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const statusTranslations = {
        pending: "Pendiente",
        paid: "Pagado",
        shipped: "Enviado",
        delivered: "Entregado",
        cancelled: "Cancelado",
    };

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
    }, [selectedStatusFilter, searchText, selectedDate, searchId]);

    useEffect(() => {
        applyFilters();
    }, [orders]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            updateOrderStatus(orderId, { status: newStatus });

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );

            Swal.fire({
                icon: 'success',
                title: 'Estado actualizado',
                text: `El pedido #${orderId} ahora está marcado como "${statusTranslations[newStatus]}".`,
                timer: 2000,
                showConfirmButton: false,
            });

        } catch (error) {
            console.error("Error actualizando estado:", error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el estado del pedido.',
            });
        }
    };

    const applyFilters = () => {
        let filtered = [...orders];

        // Filtro por estado
        if (selectedStatusFilter !== "all") {
            filtered = filtered.filter(order => order.status === selectedStatusFilter);
        }

        // Filtro por ID (si se escribe)
        if (searchId.trim() !== "") {
            filtered = filtered.filter(order =>
                order.id.toString().includes(searchId.trim())
            );
        }

        // Filtro por texto general (nombre, email, etc.)
        if (searchText.trim() !== "") {
            const lowerSearch = searchText.toLowerCase();
            filtered = filtered.filter(order =>
                order.nombre.toLowerCase().includes(lowerSearch) ||
                order.email.toLowerCase().includes(lowerSearch) ||
                order.direccion.toLowerCase().includes(lowerSearch) ||
                order.telefono.toLowerCase().includes(lowerSearch)
            );
        }

        // Filtro por fecha
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
        setSearchId("");
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

    console.log(selectedOrder);


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
                    type="number"
                    placeholder="Buscar por # de orden"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="order-filter-input"
                />


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
                                    {order.status === "cancelled" ? (
                                        <span
                                            className="order-status-cancelled"
                                            onClick={() =>
                                                Swal.fire({
                                                    icon: 'info',
                                                    title: 'Pedido cancelado',
                                                    text: 'Este pedido ha sido cancelado y no se puede modificar su estado.',
                                                })
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            Cancelado
                                        </span>
                                    ) : (
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
                                    )}
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
                            <div className="order-info">
                                {/* <p><strong>Nombre:</strong> {selectedOrder.nombre}</p>
                                <p><strong>Email:</strong> {selectedOrder.email}</p>
                                <p><strong>Teléfono:</strong> {selectedOrder.telefono}</p> */}
                                <p><strong>Dirección:</strong> {selectedOrder.direccion}</p>
                                <p><strong>Departamento:</strong> {selectedOrder.departamento}</p>
                                <p><strong>Ciudad:</strong> {selectedOrder.ciudad}</p>
                                {/* <p><strong>Fecha:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p> */}
                            </div>

                            <h3 className="modal-subtitle">Productos:</h3>
                            <ul className="items-list">
                                {selectedOrder.items.map((item, idx) => (
                                    <li key={idx} className="product-order-item">
                                        <strong>{item.product_name}</strong> ({item.size_name}) - x{item.quantity}
                                        <br />
                                        Precio unitario: ${item.price}
                                        <br />
                                        Subtotal: ${item.total}
                                    </li>
                                ))}
                            </ul>

                            <p className="order-total"><strong>Total del pedido:</strong> <span className="highlight-total">${parseFloat(selectedOrder.total_order).toFixed(2)}</span></p>


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
