import Sidebar from "../../../components/Sidebar/Sidebar";
import UserTable from "../../../components/UserTable/UserTable";
import './Users.css';

const Users = () => {
    return (
        <div className="users-container">
            <Sidebar />
           <div className="users-content">
                <UserTable />
           </div>
        </div>

    );
};

export default Users;