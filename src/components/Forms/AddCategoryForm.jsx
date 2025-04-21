import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { addCategory, updateCategory } from "../../api/categories.api";
import './AddCategoryForm.css';

const AddCategoryForm = ({ onClose, category }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: category || {},
    });

    useEffect(() => {
        if (category) {
            Object.entries(category).forEach(([key, value]) => {
                setValue(key, value);
            });
        }
    }, [category, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (category) {
                await updateCategory(category.id, data);
            } else {
                await addCategory(data);
            }
            onClose();
        } catch (error) {
            console.error("Error al guardar la categoría:", error);
        }
    });

    return (
        <div className="add-category-modal-overlay">
            <div className="add-category-modal-content">
                <form onSubmit={onSubmit} className="add-category-form">
                    <h1 className="add-category-title">{category ? "Editar Categoría" : "Nueva Categoría"}</h1>

                    <div className="form-group">
                        <label className="label-name">Nombre de la categoría</label>
                        <input
                            type="text"
                            {...register("name", { required: true })}
                            className="add-category-input"
                        />
                        {errors.name && <span className="add-category-error">Este campo es requerido</span>}
                    </div>

                    <div className="form-group">
                        <label className="label-name">Descripción</label>
                        <textarea
                            {...register("description", { required: true })}
                            className="add-category-textarea"
                        />
                        {errors.description && <span className="add-category-error">Este campo es requerido</span>}
                    </div>

                    <div className="add-category-actions">
                        <button type="button" className="add-category-cancel-button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="add-category-submit-button">
                            {category ? "Actualizar" : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategoryForm;