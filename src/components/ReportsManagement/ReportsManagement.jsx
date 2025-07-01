import React, { useEffect, useState } from "react";
import axios from "axios";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaChartBar, FaFilePdf, FaFileExcel, FaFilter, FaClipboardList } from "react-icons/fa";
import "./ReportsManagement.css";

const ReportsManagement = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [salesReport, setSalesReport] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchReports = async () => {
        if (!startDate || !endDate) return;
        setLoading(true);
        try {
            const [salesRes, productsRes] = await Promise.all([
                axios.get("http://localhost:8000/reports/sales/", {
                    params: { start_date: startDate, end_date: endDate },
                }),
                axios.get("http://localhost:8000/reports/top-products/", {
                    params: { start_date: startDate, end_date: endDate },
                }),
            ]);
            setSalesReport(salesRes.data);
            setTopProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        } catch (err) {
            console.error("Error al cargar los reportes:", err);
            alert("Hubo un error al cargar los reportes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
            .toISOString()
            .split("T")[0];
        const currentDay = today.toISOString().split("T")[0];
        setStartDate(firstDay);
        setEndDate(currentDay);
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            fetchReports();
        }
    }, [startDate, endDate]);

    const exportToExcel = () => {
        const data = topProducts.map((prod, index) => ({
            "#": index + 1,
            Producto: prod.product,
            Precio: prod.price,
            "Cantidad Vendida": prod.sold,
            "Total por Producto": prod.total,
        }));

        data.push({});
        data.push({
            Producto: "Total Ventas",
            "Cantidad Vendida": salesReport?.total_sales || 0,
        });
        data.push({
            Producto: "Total Pedidos",
            "Cantidad Vendida": salesReport?.total_orders || 0,
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Productos Vendidos");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `Reporte_ModaChic_${startDate}_a_${endDate}.xlsx`);
    };
    
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Reporte de Ventas – Moda Chic", 14, 20);
        doc.setFontSize(12);
        doc.text(`Desde: ${startDate}  Hasta: ${endDate}`, 14, 30);

        if (salesReport) {
            const formattedSales = salesReport.total_sales?.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
            }) || "$0";
            doc.text(`Total Ventas: ${formattedSales}`, 14, 38);
            doc.text(`Total de Pedidos: ${salesReport.total_orders}`, 14, 46);
        }

        autoTable(doc, {
            head: [["#", "Producto", "Precio", "Cantidad Vendida", "Total por Producto"]],
            body: topProducts.map((prod, index) => [
                index + 1,
                prod.product,
                `$${prod.price?.toLocaleString("es-CO")}`,
                prod.sold,
                `$${prod.total?.toLocaleString("es-CO")}`,
            ]),
            startY: 56,
        });

        doc.save(`Reporte_ModaChic_${startDate}_a_${endDate}.pdf`);
    };

    return (
        <div className="dashboard-reports-grid">

            {/* Filtros y acciones */}
            <div className="dashboard-reports-card filter-card">
                <div className="card-header-reports">
                    <FaFilter className="card-icon-reports" />
                    <h3>Filtros de Reporte</h3>
                </div>
                <div className="report-filters">
                    <label>
                        Desde:
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </label>
                    <label>
                        Hasta:
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </label>
                    <button onClick={fetchReports} disabled={loading}>
                        {loading ? "Cargando..." : "Actualizar"}
                    </button>
                    <button onClick={exportToExcel} disabled={topProducts.length === 0}>
                        <FaFileExcel /> Excel
                    </button>
                    <button onClick={exportToPDF} disabled={topProducts.length === 0}>
                        <FaFilePdf /> PDF
                    </button>
                </div>
            </div>

            {/* Totales */}
            {salesReport && (
                <div className="dashboard-reports-card sales-card">
                    <div className="card-header-reports">
                        <FaChartBar className="card-icon-reports" />
                        <h3>Resumen de Ventas</h3>
                    </div>
                    <div className="report-cards">
                        <div className="report-card">
                            <h4>Total de Ventas</h4>
                            <p>${salesReport.total_sales?.toLocaleString("es-CO") || 0}</p>
                        </div>
                        <div className="report-card">
                            <h4>Total de Pedidos</h4>
                            <p>{salesReport.total_orders}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla de productos */}
            <div className="dashboard-reports-card top-products-card">
                <div className="card-header-reports">
                    <FaClipboardList className="card-icon-reports" />
                    <h3>Productos Más Vendidos</h3>
                </div>
                <div className="table-wrapper">
                    <table className="top-products-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad Vendida</th>
                                <th>Total por Producto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.length > 0 ? (
                                topProducts.map((prod, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{prod.product}</td>
                                        <td>${prod.price?.toLocaleString("es-CO")}</td>
                                        <td>{prod.sold}</td>
                                        <td>${prod.total?.toLocaleString("es-CO")}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5">No hay datos disponibles.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Gráfico */}
            <div className="dashboard-reports-card graphics-card">
                <div className="card-header-reports">
                    <FaChartBar className="card-icon-reports" />
                    <h3>Visualización Gráfica</h3>
                </div>
                <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={topProducts} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="product" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="sold" fill="#993f6b" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ReportsManagement;