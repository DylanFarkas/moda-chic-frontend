import { useEffect, useState } from "react";
import { getAllCategories } from "../../api/categories.api";
import { useForm } from "react-hook-form";
import { addProduct, updateProduct } from "../../api/products.api";
import { useNavigate } from "react-router-dom";
import './AddProductForm.css';

const AddProductForm = ({ onClose, product }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: product || {},
    });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (product) {
            Object.entries(product).forEach(([key, value]) => {
                if (key !== "image") {
                    setValue(key, value);
                }
            });
        }
    }, [product, setValue]);

    useEffect(() => {
        async function loadCategories() {
            try {
                const res = await getAllCategories();
                setCategories(res.data);
            } catch (error) {
                console.error("Error al cargar categorías:", error);
            }
        }
        loadCategories();
    }, []);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                if (key === "image") {
                    if (data.image.length > 0) {
                        formData.append("image", data.image[0]);
                    }
                } else {
                    formData.append(key, data[key]);
                }
            }

            if (product) {
                await updateProduct(product.id, formData);
            } else {
                await addProduct(formData);
            }

            onClose();
        } catch (error) {
            console.error("Error al guardar producto:", error);
        }
    });

    return (
        <div className="add-product-modal-overlay">
            <div className="add-product-modal-content">
                <form onSubmit={onSubmit} className="add-product-form">
                    <h1 className="add-product-title">{product ? "Editar Producto" : "Nuevo Producto"}</h1>

                    <div className="form-group">
                        <label className="label-name">Nombre del producto</label>
                        <input
                            type="text"
                            {...register("name", { required: true })}
                            className="add-product-input"
                        />
                        {errors.name && <span className="add-product-error">Este campo es requerido</span>}
                    </div>

                    <div className="form-group">
                        <label className="label-name">Descripción</label>
                        <textarea
                            {...register("description", { required: true })}
                            className="add-product-textarea"
                        />
                        {errors.description && <span className="add-product-error">Este campo es requerido</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="label-name">Precio</label>
                            <input
                                type="number"
                                {...register("price", { required: true })}
                                className="add-product-input"
                            />
                            {errors.price && <span className="add-product-error">Este campo es requerido</span>}
                        </div>

                        <div className="form-group">
                            <label className="label-name">Stock</label>
                            <input
                                type="number"
                                {...register("stock", { required: true })}
                                className="add-product-input"
                            />
                            {errors.stock && <span className="add-product-error">Este campo es requerido</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="label-name">Material</label>
                            <input
                                type="text"
                                {...register("material", { required: true })}
                                className="add-product-input"
                            />
                            {errors.material && <span className="add-product-error">Este campo es requerido</span>}
                        </div>

                        <div className="form-group">
                            <label className="label-name">Talla</label>
                            <input
                                type="text"
                                {...register("size", { required: true })}
                                className="add-product-input"
                            />
                            {errors.size && <span className="add-product-error">Este campo es requerido</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label-name">Categoría</label>
                        <select {...register("category", { required: true })} className="add-product-select">
                            <option value="">Seleccione una Categoría</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && <span className="add-product-error">Este campo es requerido</span>}
                    </div>

                    <div className="form-group">
                        <label className="label-name">Imagen</label>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("image", { required: !product })}
                            className="add-product-file"
                        />
                        {errors.image && <span className="add-product-error">Este campo es requerido</span>}
                    </div>

                    <div className="add-product-actions">
                        <button type="button" className="add-product-cancel-button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="add-product-submit-button">
                            {product ? "Actualizar" : "Guardar"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default AddProductForm;
