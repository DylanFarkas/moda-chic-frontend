import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaChartBar, FaFilePdf, FaFileExcel, FaFilter, FaClipboardList } from "react-icons/fa";
import "./ReportsManagement.css";

const ReportsManagement = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [rangeType, setRangeType] = useState("mes_actual");
    const [monthValue, setMonthValue] = useState("");

    const [salesReport, setSalesReport] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categorySales, setCategorySales] = useState([]);
    const baseURL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        handleRangeChange("mes_actual");
    }, []);

    const fetchReports = async () => {
        if (!startDate || !endDate) return;
        setLoading(true);
        try {
            const [salesRes, productsRes, categoryRes] = await Promise.all([
                axios.get(`${baseURL}/reports/sales/`, {
                    params: { start_date: startDate, end_date: endDate },
                }),
                axios.get(`${baseURL}/reports/top-products/`, {
                    params: { start_date: startDate, end_date: endDate },
                }),
                axios.get(`${baseURL}/reports/sales-by-category/`, {
                    params: { start_date: startDate, end_date: endDate },
                }),
            ]);

            setSalesReport(salesRes.data);
            setTopProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
            setCategorySales(Array.isArray(categoryRes.data) ? categoryRes.data : []); // 👈 Esta línea FALTABA

        } catch (err) {
            console.error("Error al cargar los reportes:", err);
            alert("Hubo un error al cargar los reportes.");
        } finally {
            setLoading(false);
        }
    };

    const handleRangeChange = (value) => {
        setRangeType(value);
        const today = new Date();

        if (value === "hoy") {
            const dateStr = today.toISOString().split("T")[0];
            setStartDate(dateStr);
            setEndDate(dateStr);
        } else if (value === "mes_actual") {
            const first = new Date(today.getFullYear(), today.getMonth(), 1);
            const last = today;
            setStartDate(first.toISOString().split("T")[0]);
            setEndDate(last.toISOString().split("T")[0]);
        } else if (value === "mes_pasado") {
            const first = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const last = new Date(today.getFullYear(), today.getMonth(), 0);
            setStartDate(first.toISOString().split("T")[0]);
            setEndDate(last.toISOString().split("T")[0]);
        } else if (value === "mes_especifico") {
            if (monthValue) {
                const [year, month] = monthValue.split("-");
                const first = new Date(year, month - 1, 1);
                const last = new Date(year, month, 0);
                setStartDate(first.toISOString().split("T")[0]);
                setEndDate(last.toISOString().split("T")[0]);
            }
        }
    };

    useEffect(() => {
        if (rangeType === "mes_especifico" && monthValue) {
            handleRangeChange("mes_especifico");
        }
    }, [monthValue]);


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
        const productData = topProducts.map((prod, index) => ({
            "#": index + 1,
            Producto: prod.product,
            Precio: prod.price,
            "Cantidad Vendida": prod.sold,
            "Total por Producto": prod.total,
        }));

        const categoryData = categorySales.map((cat, index) => ({
            "#": index + 1,
            Categoría: cat.category,
            "Total Vendido": cat.total,
        }));

        const worksheet1 = XLSX.utils.json_to_sheet(productData);
        const worksheet2 = XLSX.utils.json_to_sheet(categoryData);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet1, "Productos Vendidos");
        XLSX.utils.book_append_sheet(workbook, worksheet2, "Ventas por Categoría");

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

        const finalY = doc.lastAutoTable.finalY + 10;

        if (categorySales.length > 0) {
            doc.setFontSize(14);
            doc.text("Ventas por Categoría", 14, finalY);

            autoTable(doc, {
                head: [["#", "Categoría", "Total Vendido"]],
                body: categorySales.map((cat, index) => [
                    index + 1,
                    cat.category,
                    `$${cat.total?.toLocaleString("es-CO")}`,
                ]),
                startY: finalY + 6,
            });
        }

        doc.save(`Reporte_ModaChic_${startDate}_a_${endDate}.pdf`);
    };

    const getDateRangeLabel = () => {
        if (rangeType === "hoy") return "Hoy";
        if (rangeType === "mes_actual") return "Este mes";
        if (rangeType === "mes_pasado") return "Mes anterior";
        if (rangeType === "mes_especifico") return "Mes: " + monthValue;
        if (rangeType === "personalizado") return "Rango personalizado";
        return "";
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
                        Rango de tiempo:
                        <select className="select-report-filters" value={rangeType} onChange={(e) => handleRangeChange(e.target.value)}>
                            <option value="hoy">Hoy</option>
                            <option value="mes_actual">Este mes</option>
                            <option value="mes_pasado">Mes anterior</option>
                            <option value="mes_especifico">Mes específico</option>
                            <option value="personalizado">Personalizado</option>
                        </select>
                    </label>

                    {rangeType === "mes_especifico" && (
                        <label>
                            Selecciona mes:
                            <input
                                type="month"
                                value={monthValue}
                                onChange={(e) => setMonthValue(e.target.value)}
                            />
                        </label>
                    )}

                    {rangeType === "personalizado" && (
                        <>
                            <label>
                                Desde:
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </label>
                            <label>
                                Hasta:
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </label>
                        </>
                    )}

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

                <div className="date-range-feedback">
                    <p>
                        <strong>Analizando:</strong> {getDateRangeLabel()} &nbsp;|&nbsp;
                        <strong>Desde:</strong> {startDate} &nbsp;&nbsp;
                        <strong>Hasta:</strong> {endDate}
                    </p>
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

            {/* Ventas por Categoría */}
            {categorySales.length > 0 && (
                <div className="dashboard-reports-card graphics-card">
                    <div className="card-header-reports">
                        <FaChartBar className="card-icon-reports" />
                        <h3>Ventas por Categoría</h3>
                    </div>
                    <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={categorySales} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip formatter={(value) => `$${value.toLocaleString("es-CO")}`} />
                                <Bar dataKey="total" fill="#57374f" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ReportsManagement;