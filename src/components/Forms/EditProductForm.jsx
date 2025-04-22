import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../api/categories.api";
import { updateProduct } from "../../api/products.api";
import ProductFormFields from "./ProductFormFields";

const EditProductForm = ({ onClose, product }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [categories, setCategories] = useState([]);

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

    useEffect(() => {
        if (product && categories.length > 0) {
            setValue("name", product.name);
            setValue("price", product.price);
            setValue("stock", product.stock);
            setValue("material", product.material);
            setValue("size", product.size);
            setValue("category", product.category);
            setValue("description", product.description);
        }
    }, [product, categories, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                if (key === "image" && data.image.length > 0) {
                    formData.append("image", data.image[0]);
                } else {
                    formData.append(key, data[key]);
                }
            }
            await updateProduct(product.id, formData);
            onClose();
        } catch (error) {
            console.error("Error al actualizar producto:", error);
        }
    });

    return (
        <div className="add-product-modal-overlay">
            <div className="add-product-modal-content">
                <form onSubmit={onSubmit} className="add-product-form">
                    <h1 className="add-product-title">Editar Producto</h1>
                    <ProductFormFields
                        register={register}
                        errors={errors}
                        categories={categories}
                        isEdit={true}
                    />
                    <div className="add-product-actions">
                        <button type="button" onClick={onClose} className="add-product-cancel-button">Cancelar</button>
                        <button type="submit" className="add-product-submit-button">Actualizar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductForm;
