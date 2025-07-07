import { useEffect, useState } from "react";
import { getAllCategories, deleteCategory } from "../../api/categories.api";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { MdOutlineAddToPhotos } from "react-icons/md";
import AddCategoryForm from "../Forms/AddCategoryForm";
import Swal from "sweetalert2";
import "./CategoriesTable.css";

const CategoriesTable = () => {
    const [categories, setCategories] = useState([]);
    const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);

    const handleShowAddCategoryForm = () => {
        setShowAddCategoryForm(true);
        setCategoryToEdit(null);
    };

    const handleCloseAddCategoryForm = async () => {
        setShowAddCategoryForm(false);
        setCategoryToEdit(null);
        const res = await getAllCategories();
        setCategories(res.data);
    };

    useEffect(() => {
        async function loadCategories() {
            const res = await getAllCategories();
            setCategories(res.data);
        }
        loadCategories();
    }, []);

    return (
        <div className="categories-content">
            <div className="table-wrapper">
                <table className="categories-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {categories.map((category_data) => (
                            <tr key={category_data.id}>
                                <td data-label="Nombre">{category_data.name}</td>
                                <td data-label="Descripción">{category_data.description}</td>
                                <td className="action-buttons">
                                    <button
                                        className="edit-button"
                                        onClick={() => {
                                            setCategoryToEdit(category_data);
                                            setShowAddCategoryForm(true);
                                        }}
                                    >
                                        <FiEdit />
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={async () => {
                                            Swal.fire({
                                                title: "¿Estás seguro?",
                                                text: "Esta acción eliminará la categoría permanentemente.",
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#d33",
                                                cancelButtonColor: "#6c757d",
                                                confirmButtonText: "Sí, eliminar",
                                                cancelButtonText: "Cancelar",
                                                customClass: {
                                                    confirmButton: 'confirm-delete-product-button',
                                                    cancelButton: 'cancel-delete-product-button'
                                                  }
                                            }).then(async (result) => {
                                                if (result.isConfirmed) {
                                                    try {
                                                        await deleteCategory(category_data.id);
                                                        setCategories(prev => prev.filter(c => c.id !== category_data.id));
                                                        Swal.fire({
                                                            icon: "success",
                                                            title: "¡Eliminada!",
                                                            text: "La categoría fue eliminada correctamente.",
                                                            confirmButtonColor: "#993f6b",
                                                            customClass: {
                                                                confirmButton: 'confirm-delete-category-button-alert'
                                                            }
                                                        });
                                                    } catch (error) {
                                                        console.error("Error al eliminar categoría:", error);
                                                        Swal.fire({
                                                            icon: "error",
                                                            title: "¡Error!",
                                                            text: "Ocurrió un error al eliminar la categoría.",
                                                            confirmButtonColor: "#dc3545",
                                                        });
                                                    }
                                                }
                                            });
                                        }}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button className="add-button" onClick={handleShowAddCategoryForm}>
                <MdOutlineAddToPhotos className="addCategory-icon" />
                Crear categoría
            </button>

            {showAddCategoryForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <AddCategoryForm
                            onClose={handleCloseAddCategoryForm}
                            category={categoryToEdit}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesTable;