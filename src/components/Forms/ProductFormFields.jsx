import './ProductFormFields.css';

const ProductFormFields = ({ register, errors, categories, isEdit }) => {
    return (
        <>
            <div className="form-group">
                <label className="label-name">Nombre del producto</label>
                <input type="text" {...register("name", { required: true })} className="add-product-input" />
                {errors.name && <span className="add-product-error">Este campo es requerido</span>}
            </div>

            <div className="form-group">
                <label className="label-name">Descripción</label>
                <textarea {...register("description", { required: true })} className="add-product-textarea" />
                {errors.description && <span className="add-product-error">Este campo es requerido</span>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="label-name">Precio</label>
                    <input type="number" {...register("price", { required: true })} className="add-product-input" />
                    {errors.price && <span className="add-product-error">Este campo es requerido</span>}
                </div>

                <div className="form-group">
                    <label className="label-name">Stock</label>
                    <input type="number" {...register("stock", { required: true })} className="add-product-input" />
                    {errors.stock && <span className="add-product-error">Este campo es requerido</span>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="label-name">Material</label>
                    <input type="text" {...register("material", { required: true })} className="add-product-input" />
                    {errors.material && <span className="add-product-error">Este campo es requerido</span>}
                </div>

                <div className="form-group">
                    <label className="label-name">Talla</label>
                    <select {...register("size", { required: true })} className="add-product-input">
                        <option value="">Selecciona una talla</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                    {errors.size && <span className="add-product-error">Este campo es requerido</span>}
                </div>
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

            {!isEdit && (
                <div className="form-group">
                    <label className="label-name">Imagen</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("image", { required: true })}
                        className="add-product-file"
                    />
                    {errors.image && <span className="add-product-error">Este campo es requerido</span>}
                </div>
            )}

        </>
    );
};

export default ProductFormFields;