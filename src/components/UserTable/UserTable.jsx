import React from 'react';
import './UserTable.css'; 

const UserTable = ({}) => {
  return (
    <div className="user-table-container">
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
