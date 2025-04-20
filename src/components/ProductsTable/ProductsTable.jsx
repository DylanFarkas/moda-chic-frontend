import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getAllProducts, deleteProduct } from "../../api/products.api";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { HiUserAdd } from "react-icons/hi";
import AddProductForm from "../Forms/AddProductForm";
import { useParams, useSearchParams } from "react-router-dom";
import "./ProductsTable.css";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null); // Nuevo estado
  const params = useParams();
  const [searchParams] = useSearchParams();

  console.log(params);

  useEffect(() => {
    async function loadProducts() {
      const res = await getAllProducts();
      setProducts(res.data);
    }
    loadProducts();
  }, []);

  //Accón rápida
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setShowAddProductForm(true);
    }
  }, [searchParams]);

  const handleShowAddProductForm = () => {
    setShowAddProductForm(true);
    setProductToEdit(null);
  };

  const handleCloseAddProductForm = async () => {
    setShowAddProductForm(false);
    setProductToEdit(null);
    const res = await getAllProducts(); // Recarga productos después de editar o crear
    setProducts(res.data);
  };

  return (
    <div className="products-content">
      <div className="table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Categoría</th>
              <th>Tallas</th>
              <th colSpan="2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product_data) => (
              <tr key={product_data.id}>
                <td data-label="Nombre">{product_data.name}</td>
                <td data-label="Precio">{product_data.price}</td>
                <td data-label="Cantidad">{product_data.stock}</td>
                <td data-label="Categoría">{product_data.category?.name}</td>
                <td data-label="Tallas">{product_data.size}</td>
                <td className="action-buttons">
                  <button
                    className="edit-button"
                    onClick={() => {
                      setProductToEdit(product_data);
                      setShowAddProductForm(true);
                    }}
                  >
                    <FiEdit />
                  </button>
                </td>
                <td>
                  <button
                    className="delete-button"
                    onClick={async () => {
                      const accepted = window.confirm("¿Estás seguro?");
                      if (accepted) {
                        try {
                          await deleteProduct(product_data.id);
                          toast.success("Producto eliminado correctamente");
                          setProducts(prev => prev.filter(p => p.id !== product_data.id));
                        } catch (error) {
                          toast.error("Error al eliminar el producto");
                          console.error("Error al eliminar producto:", error);
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

      <button className="add-button" onClick={handleShowAddProductForm}>
        <HiUserAdd className="addUser-icon" />
        Agregar Producto
      </button>

      {showAddProductForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddProductForm
              onClose={handleCloseAddProductForm}
              product={productToEdit} // si estás editando
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;
