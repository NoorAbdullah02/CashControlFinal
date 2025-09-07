import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { Plus, Tag, Sparkles, Grid3X3, Layers, Search, Filter } from "lucide-react";
import CategoryList from "../components/CategoryList.jsx";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import Modal from "../components/Modal.jsx";
import AddCategoryForm from "../components/AddCategoryForm.jsx";

const Category = () => {
    useUser();
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchCategoryDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if (response.status === 200) {
                console.log('categories', response.data);
                setCategoryData(response.data);
            }
        } catch (error) {
            console.error('Something went wrong. Please try again.', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoryDetails();
    }, []);

    const handleAddCategory = async (category) => {
        const { name, type, icon } = category;

        if (!name.trim()) {
            toast.error("Category Name is required");
            return;
        }

        // Check if the category already exists
        const isDuplicate = categoryData.some((category) => {
            return category.name.toLowerCase() === name.trim().toLowerCase();
        });

        if (isDuplicate) {
            toast.error("Category Name already exists");
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, { name, type, icon });
            if (response.status === 201) {
                toast.success("Category added successfully");
                setOpenAddCategoryModal(false);
                fetchCategoryDetails();
            }
        } catch (error) {
            console.error('Error adding category:', error);
            toast.error(error.response?.data?.message || "Failed to add category.");
        }
    }

    const handleEditCategory = (categoryToEdit) => {
        setSelectedCategory(categoryToEdit);
        setOpenEditCategoryModal(true);
    }

    const handleUpdateCategory = async (updatedCategory) => {
        const { id, name, type, icon } = updatedCategory;
        if (!name.trim()) {
            toast.error("Category Name is required");
            return;
        }

        if (!id) {
            toast.error("Category ID is missing for update");
            return;
        }

        try {
            await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), { name, type, icon });
            setOpenEditCategoryModal(false);
            setSelectedCategory(null);
            toast.success("Category updated successfully");
            fetchCategoryDetails();
        } catch (error) {
            console.error('Error updating category:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to update category.");
        }
    }

    // Get category statistics
    const getCategoryStats = () => {
        const incomeCategories = categoryData.filter(cat => cat.type === 'income').length;
        const expenseCategories = categoryData.filter(cat => cat.type === 'expense').length;
        return { total: categoryData.length, income: incomeCategories, expense: expenseCategories };
    };

    const stats = getCategoryStats();

    return (
        <Dashboard activeMenu="Category">
            <div className="my-5 mx-auto">
                {/* Enhanced Header Section */}
                <div className="mb-6">
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-0 overflow-hidden relative">
                        {/* Decorative gradient line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"></div>

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            <div className="flex items-center space-x-4">
                                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl shadow-lg">
                                    <Tag className="text-white" size={24} />
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                        Category Management
                                    </h1>
                                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                                        Organize your financial transactions with custom categories
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setOpenAddCategoryModal(true)}
                                    className="add-btn"
                                >
                                    <Plus size={15} className="text-lg" /> Add Category
                                </button>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Total Categories */}
                        <div className="bg-white rounded-xl shadow-lg p-4 border-0 relative overflow-hidden transform hover:scale-105 transition-all duration-300">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
                                    <Grid3X3 className="text-white" size={20} />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Total Categories</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                                </div>
                            </div>
                        </div>

                        {/* Income Categories */}
                        <div className="bg-white rounded-xl shadow-lg p-4 border-0 relative overflow-hidden transform hover:scale-105 transition-all duration-300">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl">
                                    <Sparkles className="text-white" size={20} />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Income Types</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.income}</p>
                                </div>
                            </div>
                        </div>

                        {/* Expense Categories */}
                        <div className="bg-white rounded-xl shadow-lg p-4 border-0 relative overflow-hidden transform hover:scale-105 transition-all duration-300">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-xl">
                                    <Layers className="text-white" size={20} />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Expense Types</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.expense}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories Section */}
                <div className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden relative">
                    {/* Decorative gradient line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                    <div className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-xl">
                                    <Tag className="text-white" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">All Categories</h2>
                                    <p className="text-sm text-gray-600">
                                        {categoryData.length > 0 ? `Manage your ${categoryData.length} categories` : 'No categories yet'}
                                    </p>
                                </div>
                            </div>

                            {categoryData.length > 0 && (
                                <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
                                    {categoryData.length} categories
                                </div>
                            )}
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center py-16">
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-700 font-semibold text-lg">Loading Categories</p>
                                    <p className="text-gray-500 text-sm mt-1">Please wait while we fetch your categories...</p>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && categoryData.length === 0 && (
                            <div className="text-center py-16">
                                <div className="bg-gradient-to-r from-purple-100 to-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Tag className="text-purple-600" size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Categories Yet</h3>
                                <p className="text-gray-600 mb-6">Start organizing your finances by creating your first category</p>
                                <button
                                    onClick={() => setOpenAddCategoryModal(true)}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                                >
                                    <Plus size={18} />
                                    <span>Create First Category</span>
                                </button>
                            </div>
                        )}

                        {/* Category List */}
                        {!loading && categoryData.length > 0 && (
                            <div className="space-y-4">
                                <CategoryList
                                    categories={categoryData}
                                    onEditCategory={handleEditCategory}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Adding Category Modal */}
                <Modal
                    isOpen={openAddCategoryModal}
                    onClose={() => setOpenAddCategoryModal(false)}
                    title="Add Category"
                >
                    <AddCategoryForm onAddCategory={handleAddCategory} />
                </Modal>

                {/* Updating Category Modal */}
                <Modal
                    onClose={() => {
                        setOpenEditCategoryModal(false);
                        setSelectedCategory(null);
                    }}
                    isOpen={openEditCategoryModal}
                    title="Update Category"
                >
                    <AddCategoryForm
                        initialCategoryData={selectedCategory}
                        onAddCategory={handleUpdateCategory}
                        isEditing={true}
                    />
                </Modal>
            </div>
        </Dashboard>
    )
}

export default Category;