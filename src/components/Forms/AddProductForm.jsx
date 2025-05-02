import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../api/categories.api";
import { addProduct, getAllSizes } from "../../api/products.api";
import ProductFormFields from "./ProductFormFields";
import Swal from "sweetalert2";
import './AddProductForm.css';

const AddProductForm = ({ onClose }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);

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
        async function loadSizes() {
            try {
                const res = await getAllSizes();
                setSizes(res.data);
            } catch (error) {
                console.error("Error al cargar tallas:", error);
            }
        }
        loadSizes();
    }, []);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const formData = new FormData();

            // Imagen principal
            if (data.main_image && data.main_image.length > 0) {
                formData.append("main_image", data.main_image[0]);
            }

            // Imágenes adicionales
            if (data.additional_images && data.additional_images.length > 0) {
                for (let i = 0; i < data.additional_images.length; i++) {
                    formData.append("additional_images", data.additional_images[i]);
                }
            }

            // Tallas y stock
            if (data.sizeStock) {
                const sizeStockJson = JSON.stringify(data.sizeStock);
                formData.append("sizes_json", sizeStockJson);
            }

            // Otros campos
            for (const key in data) {
                if (["main_image", "additional_images", "sizeStock"].includes(key)) continue;
                formData.append(key, data[key]);
            }

            // (Opcional) Verificar lo que se está enviando
            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
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
                        sizes={sizes}
                        setValue={setValue}
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