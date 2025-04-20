import Sidebar from "../../../components/Sidebar/Sidebar";
import UserTable from "../../../components/UserTable/UserTable";
import "./Users.css";

const Users = () => {
  return (
    <div className="users-container">
      <Sidebar />
      <div className="users-content">
        <h1 className="users-title"> Usuarios </h1>
        <UserTable />
      </div>
    </div>
  );
};

export default Users;
