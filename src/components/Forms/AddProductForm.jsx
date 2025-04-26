import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../api/categories.api";
import { addProduct } from "../../api/products.api";
import ProductFormFields from "./ProductFormFields";
import Swal from "sweetalert2";
import './AddProductForm.css';

const AddProductForm = ({ onClose }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
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
            await addProduct(formData);

            Swal.fire({
                icon: 'success',
                title: '¡Producto agregado!',
                text: 'El producto se ha agregado correctamente.',
                confirmButtonColor: '#993f6b',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'confirm-add-product-button-alert'
                }
            }).then(() => {
                onClose();
            });

        } catch (error) {
            console.error("Error al crear producto:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al crear el producto.',
                confirmButtonColor: '#6F4559'
            });
        }
    });

    return (
        <div className="add-product-modal-overlay">
            <div className="add-product-modal-content">
                <form onSubmit={onSubmit} className="add-product-form">
                    <h1 className="add-product-title">Nuevo Producto</h1>
                    <ProductFormFields
                        register={register}
                        errors={errors}
                        categories={categories}
                        isEdit={false}
                    />
                    <div className="add-product-actions">
                        <button type="button" onClick={onClose} className="add-product-cancel-button">Cancelar</button>
                        <button type="submit" className="add-product-submit-button">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;