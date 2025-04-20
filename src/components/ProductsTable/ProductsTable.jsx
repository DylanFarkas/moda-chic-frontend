import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { HiUserAdd } from "react-icons/hi";

import "./ProductsTable.css";

const ProductsTable = () => {
  const products = [
    {
      id: 1,
      name: "Vestido Floral",
      price: "$89.99",
      quantity: 10,
      category: "Vestidos",
      sizes: "S, M, L",
    },
    {
      id: 2,
      name: "Chaqueta Denim",
      price: "$120.00",
      quantity: 5,
      category: "Chaquetas",
      sizes: "M, L",
    },
  ];

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
            {products.map((product) => (
              <tr key={product.id}>
                <td data-label="Nombre">{product.name}</td>
                <td data-label="Precio">{product.price}</td>
                <td data-label="Cantidad">{product.quantity}</td>
                <td data-label="Categoría">{product.category}</td>
                <td data-label="Tallas">{product.sizes}</td>
                <td className="action-buttons">
                  <button className="edit-button">
                    <FiEdit />
                  </button>
                </td>
                <td>
                  <button className="delete-button">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="add-button">
        <HiUserAdd className="addUser-icon" />
        Agregar Producto
      </button>
    </div>
  );
};

export default ProductsTable;
