import React from 'react';
import './UserTable.css'; 

const UserTable = ({}) => {
  return (
    <div className="user-table-container">
      <h2 className="user-table-title">Usuarios registrados</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Correo</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default UserTable;
