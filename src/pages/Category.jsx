import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { Plus, Tag, Sparkles, Grid3X3, Layers, Search, Filter, FolderOpen, Hash, Zap } from "lucide-react";
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
            {/* Animated Blue & White Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Gradient Orbs - Blue Theme */}
                <div className="absolute top-20 right-16 w-80 h-80 bg-gradient-to-r from-sky-200 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute top-64 left-20 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-32 right-1/3 w-72 h-72 bg-gradient-to-r from-cyan-200 to-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-pulse" style={{ animationDelay: '4s' }}></div>

                {/* Floating Category Icons - Blue Tones */}
                {[...Array(18)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float-category opacity-25"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 6}s`,
                            animationDuration: `${8 + Math.random() * 4}s`
                        }}
                    >
                        {i % 6 === 0 ? (
                            <Tag className="h-6 w-6 text-blue-400" />
                        ) : i % 6 === 1 ? (
                            <FolderOpen className="h-5 w-5 text-sky-400" />
                        ) : i % 6 === 2 ? (
                            <Grid3X3 className="h-5 w-5 text-cyan-400" />
                        ) : i % 6 === 3 ? (
                            <Layers className="h-4 w-4 text-teal-400" />
                        ) : i % 6 === 4 ? (
                            <Hash className="h-5 w-5 text-blue-500" />
                        ) : (
                            <Sparkles className="h-4 w-4 text-sky-500" />
                        )}
                    </div>
                ))}

                {/* Geometric Elements - Blue Theme */}
                <div className="absolute top-1/4 left-1/5 w-12 h-12 border-2 border-blue-300 transform rotate-45 animate-spin opacity-30" style={{ animationDuration: '15s' }}></div>
                <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-cyan-300 rounded-full animate-bounce opacity-40" style={{ animationDelay: '3s' }}></div>
                <div className="absolute top-2/3 left-1/3 w-6 h-6 bg-sky-400 transform rotate-45 animate-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 right-1/6 w-10 h-10 border-2 border-teal-300 rounded-full animate-ping opacity-40" style={{ animationDelay: '4s' }}></div>

                {/* Hexagonal patterns - Blue Accents */}
                <div className="absolute top-1/6 right-1/3 w-4 h-4 bg-blue-300 transform rotate-12 animate-pulse opacity-60" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)', animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/4 left-1/4 w-6 h-6 bg-cyan-300 transform rotate-45 animate-pulse opacity-50" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)', animationDelay: '3s' }}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                {/* Page Header with Blue Theme */}
                <div className="mb-8 mt-6 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                                <div className="relative bg-gradient-to-r from-blue-500 to-cyan-600 p-4 rounded-2xl shadow-xl">
                                    <Tag className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                                    Category Management
                                </h1>
                                <p className="text-slate-600 mt-1 text-lg">Organize your financial transactions</p>
                            </div>
                        </div>

                        {/* Quick Add Button - Blue Theme */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                            <button
                                onClick={() => setOpenAddCategoryModal(true)}
                                className="relative bg-gradient-to-r from-teal-400 to-cyan-500 text-white py-3 px-7 rounded-2xl shadow-lg hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-105 flex items-center gap-3 font-semibold"
                            >
                                <Plus className="h-5 w-5" />
                                <span>Add Category</span>
                            </button>
                        </div>
                    </div>

                    {/* Decorative Line - Blue Gradient */}
                    <div className="mt-6 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-full opacity-60"></div>
                </div>

                {/* Statistics Cards - Blue & White Theme */}
                <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Categories Card - Blue */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
                            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-blue-200/50 shadow-2xl p-6 transform transition-all group-hover:scale-105 group-hover:shadow-3xl overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full opacity-60"></div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-2xl shadow-lg">
                                        <Grid3X3 className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-slate-600 text-sm font-medium">Total Categories</p>
                                        <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
                                    </div>
                                </div>

                                <div className="absolute -bottom-2 -right-2">
                                    <Zap className="h-4 w-4 text-blue-300 animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Income Categories Card - Teal */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-3xl blur-xl"></div>
                            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-teal-200/50 shadow-2xl p-6 transform transition-all group-hover:scale-105 group-hover:shadow-3xl overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                                <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-tr from-teal-100 to-emerald-100 rounded-full opacity-50"></div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-3 rounded-2xl shadow-lg">
                                        <Sparkles className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-slate-600 text-sm font-medium">Income Types</p>
                                        <p className="text-3xl font-bold text-slate-800">{stats.income}</p>
                                    </div>
                                </div>

                                <div className="absolute -top-1 -right-1 animate-bounce-slow">
                                    <Sparkles className="h-3 w-3 text-teal-400" />
                                </div>
                            </div>
                        </div>

                        {/* Expense Categories Card - Orange/Coral */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-rose-500/10 rounded-3xl blur-xl"></div>
                            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-orange-200/50 shadow-2xl p-6 transform transition-all group-hover:scale-105 group-hover:shadow-3xl overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-rose-500"></div>
                                <div className="absolute top-4 left-4 w-10 h-10 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full opacity-50"></div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-r from-orange-500 to-rose-600 p-3 rounded-2xl shadow-lg">
                                        <Layers className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-slate-600 text-sm font-medium">Expense Types</p>
                                        <p className="text-3xl font-bold text-slate-800">{stats.expense}</p>
                                    </div>
                                </div>

                                <div className="absolute bottom-2 right-2 animate-pulse">
                                    <Hash className="h-4 w-4 text-rose-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories Section - Blue & White */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <div className="relative">
                        {/* Card Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>

                        {/* Main Categories Card */}
                        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-blue-200/50 shadow-2xl overflow-hidden">
                            {/* Card Header Decoration */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"></div>

                            {/* Corner Decorations */}
                            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full opacity-50"></div>
                            <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-tr from-cyan-100 to-teal-100 rounded-full opacity-40"></div>

                            {/* Floating icons */}
                            <div className="absolute top-8 left-8 animate-bounce-slow">
                                <Tag className="h-4 w-4 text-blue-300 opacity-60" />
                            </div>
                            <div className="absolute bottom-8 right-8 animate-pulse">
                                <FolderOpen className="h-5 w-5 text-cyan-300 opacity-50" />
                            </div>

                            <div className="relative p-6">
                                {/* Section Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-xl shadow-lg">
                                            <Tag className="text-white h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-800">All Categories</h2>
                                            <p className="text-slate-600">
                                                {categoryData.length > 0 ? `Manage your ${categoryData.length} categories` : 'No categories yet'}
                                            </p>
                                        </div>
                                    </div>

                                    {categoryData.length > 0 && (
                                        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200">
                                            {categoryData.length} categories
                                        </div>
                                    )}
                                </div>

                                {/* Loading State - Blue Theme */}
                                {loading && (
                                    <div className="flex items-center justify-center py-16">
                                        <div className="text-center">
                                            <div className="relative w-16 h-16 mx-auto mb-4">
                                                <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                                                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                            <p className="text-slate-700 font-semibold text-lg">Loading Categories</p>
                                            <p className="text-slate-500 text-sm mt-1">Please wait while we organize your data...</p>
                                        </div>
                                    </div>
                                )}

                                {/* Empty State - Blue Theme */}
                                {!loading && categoryData.length === 0 && (
                                    <div className="text-center py-16">
                                        <div className="relative mb-6">
                                            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto relative">
                                                <Tag className="text-blue-600 h-10 w-10" />
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                                                    <Plus className="h-3 w-3 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No Categories Yet</h3>
                                        <p className="text-slate-600 mb-6 max-w-md mx-auto">Start organizing your finances by creating custom categories for your income and expenses</p>
                                        <button
                                            onClick={() => setOpenAddCategoryModal(true)}
                                            className="group relative"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                                            <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-2xl shadow-xl transform transition-all group-hover:scale-105 flex items-center space-x-2 font-semibold">
                                                <Plus className="h-5 w-5" />
                                                <span>Create First Category</span>
                                            </div>
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
                    </div>
                </div>

                {/* Floating Action Button - Blue Theme */}
                <div
                    className="fixed bottom-8 right-8 z-50 animate-bounce-slow cursor-pointer"
                    onClick={() => setOpenAddCategoryModal(true)}
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-opacity animate-pulse"></div>
                        <div className="relative bg-gradient-to-r from-blue-500 to-cyan-600 p-4 rounded-full shadow-2xl transform transition-all group-hover:scale-110 group-hover:shadow-3xl">
                            <Plus className="h-6 w-6 text-white" />
                        </div>
                        {/* Floating category indicator */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <Tag className="h-3 w-3 text-white" />
                        </div>
                    </div>
                </div>

                {/* Modals */}
                <Modal
                    isOpen={openAddCategoryModal}
                    onClose={() => setOpenAddCategoryModal(false)}
                    title="Add Category"
                >
                    <AddCategoryForm onAddCategory={handleAddCategory} />
                </Modal>

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

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes float-category {
                    0%, 100% { 
                        transform: translateY(0px) rotate(0deg) scale(1); 
                        opacity: 0.25;
                    }
                    20% { 
                        transform: translateY(-12px) rotate(72deg) scale(1.1); 
                        opacity: 0.35;
                    }
                    40% { 
                        transform: translateY(-20px) rotate(144deg) scale(0.9); 
                        opacity: 0.3;
                    }
                    60% { 
                        transform: translateY(-15px) rotate(216deg) scale(1.05); 
                        opacity: 0.4;
                    }
                    80% { 
                        transform: translateY(-8px) rotate(288deg) scale(0.95); 
                        opacity: 0.32;
                    }
                }
                
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes bounce-slow {
                    0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
                    40%, 43% { transform: translate3d(0,-15px,0); }
                    70% { transform: translate3d(0,-8px,0); }
                    90% { transform: translate3d(0,-3px,0); }
                }
                
                .animate-float-category {
                    animation: float-category 8s ease-in-out infinite;
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-bounce-slow {
                    animation: bounce-slow 3s infinite;
                }
                
                .shadow-3xl {
                    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
                }
            `}</style>
        </Dashboard>
    )
}

export default Category;