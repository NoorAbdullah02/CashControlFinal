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
            {/* Animated Blue & White Background - Mobile Optimized */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Gradient Orbs - Blue Theme - Responsive Sizing */}
                <div className="absolute top-10 sm:top-20 right-8 sm:right-16 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-gradient-to-r from-sky-200 to-blue-300 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute top-32 sm:top-64 left-8 sm:left-20 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-gradient-to-r from-blue-200 to-cyan-300 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-25 animate-pulse delay-1000"></div>
                <div className="absolute bottom-16 sm:bottom-32 right-1/4 sm:right-1/3 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-gradient-to-r from-cyan-200 to-teal-300 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-35 animate-pulse delay-500"></div>

                {/* Floating Category Icons - Blue Tones - Reduced for mobile */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float-category opacity-15 sm:opacity-25 hidden sm:block"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 6}s`,
                            animationDuration: `${8 + Math.random() * 4}s`
                        }}
                    >
                        {i % 6 === 0 ? (
                            <Tag className="h-4 w-4 sm:h-6 sm:w-6 text-blue-400" />
                        ) : i % 6 === 1 ? (
                            <FolderOpen className="h-3 w-3 sm:h-5 sm:w-5 text-sky-400" />
                        ) : i % 6 === 2 ? (
                            <Grid3X3 className="h-3 w-3 sm:h-5 sm:w-5 text-cyan-400" />
                        ) : i % 6 === 3 ? (
                            <Layers className="h-3 w-3 sm:h-4 sm:w-4 text-teal-400" />
                        ) : i % 6 === 4 ? (
                            <Hash className="h-3 w-3 sm:h-5 sm:w-5 text-blue-500" />
                        ) : (
                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-sky-500" />
                        )}
                    </div>
                ))}

                {/* Geometric Elements - Responsive */}
                <div className="absolute top-1/4 left-1/5 w-6 h-6 sm:w-12 sm:h-12 border border-blue-300 sm:border-2 transform rotate-45 animate-spin opacity-30 duration-15s"></div>
                <div className="absolute bottom-1/3 right-1/4 w-4 h-4 sm:w-8 sm:h-8 bg-cyan-300 rounded-full animate-bounce opacity-40 delay-3s"></div>
                <div className="absolute top-2/3 left-1/3 w-3 h-3 sm:w-6 sm:h-6 bg-sky-400 transform rotate-45 animate-pulse opacity-50 delay-2s"></div>
                <div className="absolute top-1/2 right-1/6 w-5 h-5 sm:w-10 sm:h-10 border border-teal-300 sm:border-2 rounded-full animate-ping opacity-40 delay-4s"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 px-3 sm:px-6">
                {/* Page Header - Mobile Responsive */}
                <div className="mb-6 sm:mb-8 mt-4 sm:mt-6 animate-fade-in-up">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-50 animate-pulse"></div>
                                <div className="relative bg-gradient-to-r from-blue-500 to-cyan-600 p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl">
                                    <Tag className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                                    Category Management
                                </h1>
                                <p className="text-slate-600 mt-1 text-sm sm:text-base lg:text-lg">Organize your financial transactions</p>
                            </div>
                        </div>

                        {/* Quick Add Button - Mobile Responsive */}
                        <div className="relative group self-start sm:self-auto">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                            <button
                                onClick={() => setOpenAddCategoryModal(true)}
                                className="relative bg-gradient-to-r from-teal-400 to-cyan-500 text-white py-2 px-4 sm:py-3 sm:px-7 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-105 flex items-center gap-2 sm:gap-3 font-semibold text-sm sm:text-base"
                            >
                                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span>Add Category</span>
                            </button>
                        </div>
                    </div>

                    {/* Decorative Line - Mobile Responsive */}
                    <div className="mt-4 sm:mt-6 w-full h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-full opacity-60"></div>
                </div>

                {/* Statistics Cards - Mobile Grid */}
                <div className="mb-6 sm:mb-8 animate-fade-in-up animation-delay-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Total Categories Card - Mobile Optimized */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl"></div>
                            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-blue-200/50 shadow-xl sm:shadow-2xl p-4 sm:p-6 transform transition-all group-hover:scale-105 group-hover:shadow-3xl overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full opacity-60"></div>

                                <div className="flex items-center space-x-3 sm:space-x-4">
                                    <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                                        <Grid3X3 className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-slate-600 text-xs sm:text-sm font-medium">Total Categories</p>
                                        <p className="text-2xl sm:text-3xl font-bold text-slate-800">{stats.total}</p>
                                    </div>
                                </div>

                                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2">
                                    <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-blue-300 animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Income Categories Card - Mobile Optimized */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl"></div>
                            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-teal-200/50 shadow-xl sm:shadow-2xl p-4 sm:p-6 transform transition-all group-hover:scale-105 group-hover:shadow-3xl overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-tr from-teal-100 to-emerald-100 rounded-full opacity-50"></div>

                                <div className="flex items-center space-x-3 sm:space-x-4">
                                    <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                                        <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-slate-600 text-xs sm:text-sm font-medium">Income Types</p>
                                        <p className="text-2xl sm:text-3xl font-bold text-slate-800">{stats.income}</p>
                                    </div>
                                </div>

                                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 animate-bounce-slow">
                                    <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 text-teal-400" />
                                </div>
                            </div>
                        </div>

                        {/* Expense Categories Card - Mobile Optimized */}
                        <div className="relative group sm:col-span-2 lg:col-span-1">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-rose-500/10 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl"></div>
                            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-orange-200/50 shadow-xl sm:shadow-2xl p-4 sm:p-6 transform transition-all group-hover:scale-105 group-hover:shadow-3xl overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-orange-500 to-rose-500"></div>
                                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full opacity-50"></div>

                                <div className="flex items-center space-x-3 sm:space-x-4">
                                    <div className="bg-gradient-to-r from-orange-500 to-rose-600 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                                        <Layers className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-slate-600 text-xs sm:text-sm font-medium">Expense Types</p>
                                        <p className="text-2xl sm:text-3xl font-bold text-slate-800">{stats.expense}</p>
                                    </div>
                                </div>

                                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 animate-pulse">
                                    <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-rose-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories Section - Mobile Optimized */}
                <div className="animate-fade-in-up animation-delay-400">
                    <div className="relative">
                        {/* Card Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl"></div>

                        {/* Main Categories Card */}
                        <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-blue-200/50 shadow-xl sm:shadow-2xl overflow-hidden">
                            {/* Card Header Decoration */}
                            <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"></div>

                            {/* Corner Decorations - Mobile Responsive */}
                            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full opacity-50"></div>
                            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-tr from-cyan-100 to-teal-100 rounded-full opacity-40"></div>

                            {/* Floating icons - Hidden on mobile */}
                            <div className="absolute top-4 sm:top-8 left-4 sm:left-8 animate-bounce-slow hidden sm:block">
                                <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-blue-300 opacity-60" />
                            </div>
                            <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 animate-pulse hidden sm:block">
                                <FolderOpen className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-300 opacity-50" />
                            </div>

                            <div className="relative p-4 sm:p-6">
                                {/* Section Header - Mobile Responsive */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
                                            <Tag className="text-white h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">All Categories</h2>
                                            <p className="text-slate-600 text-sm sm:text-base">
                                                {categoryData.length > 0 ? `Manage your ${categoryData.length} categories` : 'No categories yet'}
                                            </p>
                                        </div>
                                    </div>

                                    {categoryData.length > 0 && (
                                        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border border-blue-200 self-start sm:self-auto">
                                            {categoryData.length} categories
                                        </div>
                                    )}
                                </div>

                                {/* Loading State - Mobile Optimized */}
                                {loading && (
                                    <div className="flex items-center justify-center py-12 sm:py-16">
                                        <div className="text-center">
                                            <div className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4">
                                                <div className="w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4 border-blue-200 rounded-full"></div>
                                                <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                            <p className="text-slate-700 font-semibold text-base sm:text-lg">Loading Categories</p>
                                            <p className="text-slate-500 text-xs sm:text-sm mt-1">Please wait while we organize your data...</p>
                                        </div>
                                    </div>
                                )}

                                {/* Empty State - Mobile Optimized */}
                                {!loading && categoryData.length === 0 && (
                                    <div className="text-center py-12 sm:py-16">
                                        <div className="relative mb-4 sm:mb-6">
                                            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto relative">
                                                <Tag className="text-blue-600 h-6 w-6 sm:h-10 sm:w-10" />
                                                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                                                    <Plus className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 mb-2">No Categories Yet</h3>
                                        <p className="text-slate-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">Start organizing your finances by creating custom categories for your income and expenses</p>
                                        <button
                                            onClick={() => setOpenAddCategoryModal(true)}
                                            className="group relative"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                                            <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl transform transition-all group-hover:scale-105 flex items-center space-x-2 font-semibold text-sm sm:text-base">
                                                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                                                <span>Create First Category</span>
                                            </div>
                                        </button>
                                    </div>
                                )}

                                {/* Category List - Mobile Responsive */}
                                {!loading && categoryData.length > 0 && (
                                    <div className="space-y-3 sm:space-y-4">
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

                {/* Mobile-only Floating Action Button */}
                <div
                    className="fixed bottom-6 right-6 z-50 animate-bounce-slow cursor-pointer sm:hidden"
                    onClick={() => setOpenAddCategoryModal(true)}
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity animate-pulse"></div>
                        <div className="relative bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-full shadow-xl transform transition-all group-hover:scale-110 group-hover:shadow-2xl">
                            <Plus className="h-5 w-5 text-white" />
                        </div>
                        {/* Floating category indicator */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <Tag className="h-2 w-2 text-white" />
                        </div>
                    </div>
                </div>

                {/* Desktop Floating Action Button */}
                <div
                    className="fixed bottom-8 right-8 z-50 animate-bounce-slow cursor-pointer hidden sm:block"
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
                        opacity: 0.15;
                    }
                    20% { 
                        transform: translateY(-8px) rotate(72deg) scale(1.05); 
                        opacity: 0.25;
                    }
                    40% { 
                        transform: translateY(-12px) rotate(144deg) scale(0.95); 
                        opacity: 0.2;
                    }
                    60% { 
                        transform: translateY(-10px) rotate(216deg) scale(1.02); 
                        opacity: 0.3;
                    }
                    80% { 
                        transform: translateY(-6px) rotate(288deg) scale(0.98); 
                        opacity: 0.22;
                    }
                }
                
                                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease forwards;
                }

                .animation-delay-200 {
                    animation-delay: 0.2s;
                }

                .animation-delay-400 {
                    animation-delay: 0.4s;
                }

                .animate-bounce-slow {
                    animation: bounce 3s infinite;
                }
            `}</style>
        </Dashboard>
    );
};

export default Category;
