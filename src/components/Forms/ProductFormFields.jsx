import { useEffect, useState } from 'react';
import './ProductFormFields.css';

const ProductFormFields = ({ register, errors, categories, isEdit, sizes, initialSizeStock, control, setValue }) => {
    const [sizeStock, setSizeStock] = useState(initialSizeStock || [{ size: "", stock: "" }]);

    useEffect(() => {
        if (initialSizeStock && initialSizeStock.length > 0) {
            // Normalizar los datos de tallas
            const normalizedSizeStock = initialSizeStock.map(item => ({
                size: item.size?.name || item.size,
                stock: item.stock
            }));

            setSizeStock(normalizedSizeStock);

            // Sincronizar con react-hook-form
            normalizedSizeStock.forEach((item, index) => {
                setValue(`sizeStock[${index}].size`, item.size);
                setValue(`sizeStock[${index}].stock`, item.stock);
            });
        }
    }, [initialSizeStock, setValue]);

    const handleSizeStockChange = (index, field, value) => {
        const updatedSizeStock = [...sizeStock];
        updatedSizeStock[index][field] = value;
        setSizeStock(updatedSizeStock);
        // Actualizar react-hook-form
        setValue(`sizeStock[${index}].${field}`, value);
    };

    const handleAddSizeStock = () => {
        const newSizeStock = [...sizeStock, { size: "", stock: "" }];
        setSizeStock(newSizeStock);
        // Actualizar react-hook-form para la nueva entrada
        setValue(`sizeStock[${newSizeStock.length - 1}]`, { size: "", stock: "" });
    };

    const handleRemoveSizeStock = (index) => {
        const updatedSizeStock = sizeStock.filter((_, i) => i !== index);
        setSizeStock(updatedSizeStock);
        // Reindexar los valores en react-hook-form
        setValue("sizeStock", updatedSizeStock);
    };

    // Función para obtener las tallas disponibles para un select específico
    const getAvailableSizes = (currentIndex) => {
        const selectedSizes = sizeStock
            .map((item, index) => (index !== currentIndex ? item.size : null))
            .filter(Boolean);

        return sizes.filter(sizeItem =>
            !selectedSizes.includes(sizeItem.name)
        );
    };

    return (
        <>
            <div className="form-products">
                <div className="form-row">
                    <div className="form-group">
                        <label className="label-name">Nombre del producto</label>
                        <input type="text" {...register("name", { required: true })} className="add-product-input name-a" />
                        {errors.name && <span className="add-product-error">Este campo es requerido</span>}
                    </div>

                    <div className="form-group">
                        <label className="label-name">Precio</label>
                        <input type="number" {...register("price", { required: true })} className="add-product-input price" />
                        {errors.price && <span className="add-product-error">Este campo es requerido</span>}
                    </div>

                    <div className="form-group">
                        <label className="label-name">Material</label>
                        <input type="text" {...register("material", { required: true })} className="add-product-input" />
                        {errors.material && <span className="add-product-error">Este campo es requerido</span>}
                    </div>

                    <div className="form-group">
                        <label className="label-name">Categoría</label>
                        <select {...register("category", { required: true })} className="add-product-select">
                            <option value="">Seleccione una Categoría</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.category && <span className="add-product-error">Este campo es requerido</span>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="label-name">Descripción</label>
                        <textarea {...register("description", { required: true })} className="add-product-textarea" />
                        {errors.description && <span className="add-product-error">Este campo es requerido</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label className="label-name">Tallas y Stock</label>
                    {sizeStock.map((entry, index) => (
                        <div key={index} className="size-stock-group">
                            <div className="form-row">
                                <div className="form-group">
                                    <select
                                        {...register(`sizeStock[${index}].size`, { required: true })}
                                        value={entry.size || ""}
                                        onChange={(e) => handleSizeStockChange(index, "size", e.target.value)}
                                        className="add-product-input"
                                    >
                                        <option value="">Selecciona una talla</option>
                                        {getAvailableSizes(index).map((sizeItem) => (
                                            <option key={sizeItem.id} value={sizeItem.name}>
                                                {sizeItem.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.sizeStock?.[index]?.size && (
                                        <span className="add-product-error">Este campo es requerido</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <input
                                        type="number"
                                        {...register(`sizeStock[${index}].stock`, { required: true })}
                                        value={entry.stock || ""}
                                        onChange={(e) => handleSizeStockChange(index, "stock", e.target.value)}
                                        className="add-product-input"
                                        placeholder="Stock"
                                    />

                                    {errors.sizeStock?.[index]?.stock && (
                                        <span className="add-product-error">Este campo es requerido</span>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleRemoveSizeStock(index)}
                                    className="remove-size-button"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddSizeStock} className="add-size-button">
                        Agregar Talla
                    </button>
                </div>

                {!isEdit && (
                    <div className="form-group">
                        <label className="label-name">Imagen principal</label>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("main_image", { required: true })}
                            className="add-product-file"
                        />
                        {errors.main_image && <span className="add-product-error">Este campo es requerido</span>}
                    </div>
                )}

                {!isEdit && (
                    <div className="form-group">
                        <label className="label-name">Imágenes adicionales (opcional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            {...register("additional_images")}
                            className="add-product-file"
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductFormFields;