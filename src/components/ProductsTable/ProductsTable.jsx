import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getAllProducts, deleteProduct } from "../../api/products.api";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { HiUserAdd } from "react-icons/hi";
import AddProductForm from "../Forms/AddProductForm";
import { useParams, useSearchParams } from "react-router-dom";
import "./ProductsTable.css";
import EditProductForm from "../Forms/EditProductForm";
import Swal from "sweetalert2";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToView, setProductToView] = useState(null);
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
    const res = await getAllProducts();
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product_data) => (
              <tr key={product_data.id}>
                <td data-label="Nombre">{product_data.name}</td>
                <td data-label="Precio">{product_data.price}</td>
                <td data-label="Cantidad">{product_data.stock}</td>
                <td data-label="Categoría">{product_data.category_name?.name}</td>
                <td data-label="Tallas">{product_data.size}</td>
                <td className="action-buttons">
                  <button
                    className="view-button"
                    onClick={() => setProductToView(product_data)}
                  >
                    <FiEye />
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => {
                      setProductToEdit(product_data);
                      setShowAddProductForm(true);
                    }}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="delete-button"
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: '¿Estás seguro?',
                        text: 'Esta acción eliminará el producto permanentemente.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#aaa',
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'Cancelar',
                        customClass: {
                          confirmButton: 'confirm-delete-product-button',
                          cancelButton: 'cancel-delete-product-button'
                        }
                      });

                      if (result.isConfirmed) {
                        try {
                          await deleteProduct(product_data.id);
                          setProducts(prev => prev.filter(p => p.id !== product_data.id));
                          await Swal.fire({
                            icon: 'success',
                            title: '¡Eliminado!',
                            text: 'El producto fue eliminado correctamente.',
                            confirmButtonColor: '#993f6b',
                            customClass: {
                              confirmButton: 'confirm-delete-product-button-alert',
                            }
                          });
                        } catch (error) {
                          console.error("Error al eliminar producto:", error);
                          await Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un problema al eliminar el producto.',
                            confirmButtonColor: '#6F4559'
                          });
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
            {productToEdit ? (
              <EditProductForm
                onClose={handleCloseAddProductForm}
                product={productToEdit}
              />
            ) : (
              <AddProductForm onClose={handleCloseAddProductForm} />
            )}
          </div>
        </div>
      )}

      {productToView && (
        <div className="modal-overlay" onClick={() => setProductToView(null)}>
          <div className="modal-content view-modal" onClick={e => e.stopPropagation()}>
            <h2 className="product-title-modal-view">{productToView.name}</h2>
            <img
              src={productToView.image}
              alt={productToView.name}
              className="product-img-modal-view"
            />
            <button className="close-button" onClick={() => setProductToView(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;