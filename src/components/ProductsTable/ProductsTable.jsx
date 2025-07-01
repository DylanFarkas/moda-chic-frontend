import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getAllProducts, deleteProduct } from "../../api/products.api";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { HiUserAdd } from "react-icons/hi";
import AddProductForm from "../Forms/AddProductForm";
import EditProductForm from "../Forms/EditProductForm";
import { useParams, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import "./ProductsTable.css";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToView, setProductToView] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchSize, setSearchSize] = useState("");
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const params = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function loadProducts() {
      const res = await getAllProducts();
      setProducts(res.data);

      const allSizes = res.data.flatMap((product) =>
        product.size_stock?.map((item) => item.size.name) || []
      );
      const uniqueSizes = [...new Set(allSizes)];
      setAvailableSizes(uniqueSizes);

      const allCategories = res.data.map((product) => product.category_name?.name).filter(Boolean);
      const uniqueCategories = [...new Set(allCategories)];
      setAvailableCategories(uniqueCategories);
    }

    loadProducts();
  }, []);

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

  const clearFilters = () => {
    setSearchName("");
    setSearchCategory("");
    setSearchSize("");
  };

  const filteredProducts = products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesCategory = product.category_name?.name.toLowerCase().includes(searchCategory.toLowerCase());
    const matchesSize =
      searchSize === "" ||
      product.size_stock?.some((item) => item.size.name === searchSize);
    return matchesName && matchesCategory && matchesSize;
  }).sort((a, b) => b.id - a.id);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="products-content">
      {/* FILTROS */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="filter-input"
        />
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="filter-input"
        >
          <option value="">Todas las categorías</option>
          {availableCategories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={searchSize}
          onChange={(e) => setSearchSize(e.target.value)}
          className="filter-input"
        >
          <option value="">Todas las tallas</option>
          {availableSizes.map((size, index) => (
            <option key={index} value={size}>{size}</option>
          ))}
        </select>
        <button className="clear-filters-button" onClick={clearFilters}>
          Limpiar filtros
        </button>
      </div>

      {/* Selector de cantidad por página */}
      <div className="pagination-settings">
        <label>Productos por página:</label>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="items-per-page-select"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* TABLA */}
      <div className="table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Tallas / Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product_data) => (
              <tr key={product_data.id}>
                <td>{product_data.name}</td>
                <td>{product_data.price}</td>
                <td>{product_data.category_name?.name}</td>
                <td>
                  <div className="sizes-wrapper">
                    {product_data.size_stock && product_data.size_stock.length > 0 ? (
                      product_data.size_stock.map((item, index) => (
                        <span key={index} className="size-badge">
                          {item.size.name}: <strong>{item.stock}</strong>
                        </span>
                      ))
                    ) : (
                      <span className="no-sizes">No hay tallas</span>
                    )}
                  </div>
                </td>
                <td className="action-buttons">
                  <button className="view-button" onClick={() => setProductToView(product_data)}>
                    <FiEye />
                  </button>
                  <button className="edit-button" onClick={() => {
                    setProductToEdit(product_data);
                    setShowAddProductForm(true);
                  }}>
                    <FiEdit />
                  </button>
                  <button className="delete-button" onClick={async () => {
                    const result = await Swal.fire({
                      title: '¿Estás seguro?',
                      text: 'Esta acción eliminará el producto permanentemente.',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#d33',
                      cancelButtonColor: '#aaa',
                      confirmButtonText: 'Sí, eliminar',
                      cancelButtonText: 'Cancelar'
                    });

                    if (result.isConfirmed) {
                      try {
                        await deleteProduct(product_data.id);
                        setProducts(prev => prev.filter(p => p.id !== product_data.id));
                        await Swal.fire('¡Eliminado!', 'El producto fue eliminado correctamente.', 'success');
                      } catch (error) {
                        console.error("Error al eliminar producto:", error);
                        await Swal.fire('Error', 'Hubo un problema al eliminar el producto.', 'error');
                      }
                    }
                  }}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          ⬅
        </button>
        <span className="pagination-info">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          ➡
        </button>
      </div>

      {/* BOTÓN AGREGAR */}
      <button className="add-button" onClick={handleShowAddProductForm}>
        <HiUserAdd className="addUser-icon" />
        Agregar Producto
      </button>

      {/* FORMULARIO MODAL */}
      {showAddProductForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            {productToEdit ? (
              <EditProductForm onClose={handleCloseAddProductForm} product={productToEdit} />
            ) : (
              <AddProductForm onClose={handleCloseAddProductForm} />
            )}
          </div>
        </div>
      )}

      {/* VISTA MODAL */}
      {productToView && (
        <div className="modal-overlay" onClick={() => setProductToView(null)}>
          <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="product-title-modal-view">{productToView.name}</h2>
            <div className="gallery-modal-table-view">
              <div className="main-image-gallery-table-container">
                <img
                  src={selectedImage || productToView.main_image}
                  alt={productToView.name}
                  className="main-product-image"
                />
              </div>
              <div className="thumbnails-table-container">
                <img
                  src={productToView.main_image}
                  alt="Imagen principal"
                  className="thumbnail-table-view-product"
                  onClick={() => setSelectedImage(productToView.main_image)}
                />
                {productToView.additional_images?.map((img, index) => (
                  <img
                    key={index}
                    src={img.image}
                    alt={`Imagen adicional ${index + 1}`}
                    className="thumbnail-table-view-product"
                    onClick={() => setSelectedImage(img.image)}
                  />
                ))}
              </div>
            </div>
            <button
              className="close-button"
              onClick={() => {
                setProductToView(null);
                setSelectedImage(null);
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;