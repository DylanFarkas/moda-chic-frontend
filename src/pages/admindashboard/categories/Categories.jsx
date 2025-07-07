import CategoriesTable from "../../../components/CategoriesTable/CategoriesTable";
import Sidebar from "../../../components/Sidebar/Sidebar";
import './Categories.css';

const Categories = () => {
    return (
        <div className="categories-container">
            <Sidebar />
            <div className="categories-content">
                <h1 className="categories-title"> Categorías </h1>
                <CategoriesTable />
            </div>
        </div>

    );
};

export default Categories;