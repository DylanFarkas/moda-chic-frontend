import { useEffect, useState } from "react";
import { getAllCategories, deleteCategory } from "../../api/categories.api";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { MdOutlineAddToPhotos } from "react-icons/md";
import AddCategoryForm from "../Forms/AddCategoryForm";
import { toast } from "react-hot-toast";
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
                                            const accepted = window.confirm("¿Estás seguro de eliminar esta categoría?");
                                            if (accepted) {
                                                try {
                                                    await deleteCategory(category_data.id);
                                                    toast.success("Categoría eliminada correctamente");
                                                    setCategories(prev => prev.filter(c => c.id !== category_data.id));
                                                } catch (error) {
                                                    toast.error("Error al eliminar la categoría");
                                                    console.error("Error al eliminar categoría:", error);
                                                }
                                            }
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