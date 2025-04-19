import Sidebar from "../../../components/Sidebar/Sidebar";
import './Users.css';

const Users = () => {
    return (
        <div className="users-container">
            <Sidebar />
           <div className="users-content">
                <h1>Usuarios</h1>
           </div>
        </div>

    );
};

export default Users;