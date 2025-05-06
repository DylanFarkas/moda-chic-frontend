import React, { useEffect, useState } from 'react';
import { getUsers } from '../../api/users.api'; 
import './UserTable.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);

    useEffect(() => {
        async function loadUsers() {
            const res = await getUsers();
            setUsers(res.data);
        }
        loadUsers();
    }, []);

  return (
    <div className="users-content">
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
