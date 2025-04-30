import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../api/categories.api";
import { getAllSizes, updateProduct } from "../../api/products.api";
import ProductFormFields from "./ProductFormFields";
import Swal from 'sweetalert2';
import './EditProductForm.css';

const EditProductForm = ({ onClose, product }) => {
    const { register, handleSubmit, formState: { errors }, setValue, control } = useForm();
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const [categoriesRes, sizesRes] = await Promise.all([
                    getAllCategories(),
                    getAllSizes()
                ]);
                
                setCategories(categoriesRes.data);
                setSizes(sizesRes.data);
                
                if (product) {
                    setValue("name", product.name);
                    setValue("price", product.price);
                    setValue("material", product.material);
                    setValue("category", product.category);
                    setValue("description", product.description);

                    // Normalizar las tallas
                    const formattedSizeStock = product.size_stock.map(item => ({
                        size: item.size?.name || item.size,
                        stock: item.stock
                    }));
                    
                    setValue("sizeStock", formattedSizeStock);
                }
            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setLoading(false);
            }
        }
        
        loadData();
    }, [product, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                if (key === "image" && data.image.length > 0) {
                    formData.append("image", data.image[0]);
                } else if (key === "sizeStock") {
                    // Enviar las tallas como JSON
                    formData.append("sizes_json", JSON.stringify(data.sizeStock));
                } else {
                    formData.append(key, data[key]);
                }
            }

            await updateProduct(product.id, formData);

            Swal.fire({
                icon: 'success',
                title: 'Producto actualizado',
                text: 'El producto ha sido editado correctamente.',
                confirmButtonColor: '#993f6b',
                customClass: {
                    confirmButton: 'confirm-button-alert'
                }
            });

            onClose();
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el producto.',
                confirmButtonColor: '#6F4559'
            });
        }
    });

    if (loading) {
        return <div className="loading-overlay">Cargando...</div>;
    }

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
                        sizes={sizes}
                        initialSizeStock={product.size_stock}
                        control={control}
                        setValue={setValue}
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