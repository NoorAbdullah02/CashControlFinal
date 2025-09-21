import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "../hooks/useUser.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import Dashboard from "../components/Dashboard.jsx";
import ExpenseOverview from "../components/ExpenseOverview.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import Modal from "../components/Modal.jsx";
import AddExpenseForm from "../components/AddExpenseForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import { Plus, TrendingDown, Receipt, CreditCard, Wallet, ShoppingBag, Sparkles } from "lucide-react";

const Expense = () => {
    useUser();
    const [expenseData, setExpenseData] = useState([]);
    const [categories, setCategories] = useState([]); // New state for expense categories
    const [loading, setLoading] = useState(false);
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    // Get All Expense Details
    const fetchExpenseDetails = async () => {
        if (loading) return; // Prevent multiple fetches if already loading

        setLoading(true);

        try {
            const response = await axiosConfig.get(
                `${API_ENDPOINTS.GET_ALL_EXPENSE}`
            );

            if (response.data) {
                setExpenseData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch expense details:", error);
            toast.error("Failed to fetch expense details.");
        } finally {
            setLoading(false);
        }
    };

    // New: Fetch Expense Categories
    const fetchExpenseCategories = async () => {
        try {
            const response = await axiosConfig.get(
                API_ENDPOINTS.CATEGORY_BY_TYPE("expense")
            );
            if (response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch expense categories:", error);
            toast.error("Failed to fetch expense categories.");
        }
    };

    const handleAddExpense = async (expense) => {
        const { name, categoryId, amount, date, icon } = expense;

        if (!name.trim()) {
            toast.error("Name is required.");
            return;
        }

        if (!categoryId) { // Validate categoryId now
            toast.error("Category is required.");
            return;
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be a valid number greater than 0.");
            return;
        }

        if (!date) {
            toast.error("Date is required.");
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (date > today) {
            toast.error('Date cannot be in the future');
            return;
        }

        try {
            await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
                name,
                categoryId,
                amount: Number(amount), // Ensure amount is a number
                date,
                icon,
            });

            setOpenAddExpenseModal(false);
            toast.success("Expense added successfully");
            fetchExpenseDetails();
            fetchExpenseCategories();
        } catch (error) {
            console.error(
                "Error adding expense:",
                error.response?.data?.message || error.message
            );
            toast.error(error.response?.data?.message || "Failed to add expense.");
        }
    };

    // Delete Expense
    const deleteExpense = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));

            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Expense details deleted successfully");
            fetchExpenseDetails();
        } catch (error) {
            console.error(
                "Error deleting expense:",
                error.response?.data?.message || error.message
            );
            toast.error(error.response?.data?.message || "Failed to delete expense.");
        }
    };

    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axiosConfig.get(
                API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD,
                {
                    responseType: "blob",
                }
            );

            let filename = "expense_details.xlsx";

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Expense details downloaded successfully!");
        } catch (error) {
            console.error("Error downloading expense details:", error);
            toast.error("Failed to download expense details. Please try again.");
        }
    };

    const handleEmailExpenseDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_EXPENSE);
            if (response.status === 200) {
                toast.success("Email sent");
            }
        } catch (e) {
            console.error("Error emailing expense details:", e);
            toast.error("Failed to email expense details. Please try again.");
        }
    }

    useEffect(() => {
        fetchExpenseDetails();
        fetchExpenseCategories();
    }, []);

    return (
        <Dashboard activeMenu="Expense">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute top-16 right-12 w-72 h-72 bg-gradient-to-r from-red-200 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse"></div>
                <div className="absolute top-48 left-16 w-80 h-80 bg-gradient-to-r from-orange-200 to-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-24 right-1/4 w-64 h-64 bg-gradient-to-r from-rose-200 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
                
                {/* Floating Expense Icons */}
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float-expense opacity-20"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${7 + Math.random() * 3}s`
                        }}
                    >
                        {i % 5 === 0 ? (
                            <Receipt className="h-6 w-6 text-red-400" />
                        ) : i % 5 === 1 ? (
                            <CreditCard className="h-5 w-5 text-orange-400" />
                        ) : i % 5 === 2 ? (
                            <Wallet className="h-5 w-5 text-pink-400" />
                        ) : i % 5 === 3 ? (
                            <ShoppingBag className="h-4 w-4 text-rose-400" />
                        ) : (
                            <TrendingDown className="h-6 w-6 text-red-500" />
                        )}
                    </div>
                ))}

                {/* Geometric Expense Elements */}
                <div className="absolute top-1/3 left-1/4 w-10 h-10 border-2 border-red-300 transform rotate-45 animate-spin opacity-30" style={{animationDuration: '12s'}}></div>
                <div className="absolute bottom-1/4 right-1/3 w-6 h-6 bg-orange-300 rounded-full animate-bounce opacity-40" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-3/4 left-1/3 w-8 h-8 bg-pink-400 transform rotate-45 animate-pulse opacity-50" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute top-1/2 right-1/6 w-4 h-4 bg-rose-400 rounded-full animate-ping opacity-40" style={{animationDelay: '3s'}}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                {/* Page Header with Animation */}
                <div className="mb-8 mt-6 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                                <div className="relative bg-gradient-to-r from-red-500 to-pink-600 p-4 rounded-2xl shadow-xl">
                                    <TrendingDown className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    Expense Tracker
                                </h1>
                                <p className="text-gray-500 mt-1 text-lg">Monitor and control your spending</p>
                            </div>
                        </div>
                        
                        {/* Quick Stats */}
                        <div className="flex items-center space-x-6">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Total Expenses</p>
                                <p className="text-2xl font-bold text-red-600">{expenseData.length}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Categories</p>
                                <p className="text-2xl font-bold text-orange-600">{categories.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Decorative Line */}
                    <div className="mt-6 w-full h-1 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 rounded-full opacity-60"></div>
                </div>

                {/* Content Grid with Staggered Animation */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Overview Section */}
                    <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        <div className="relative">
                            {/* Card Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
                            
                            {/* Overview Card */}
                            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                                {/* Card Header Decoration */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500"></div>
                                
                                {/* Corner Decorations */}
                                <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-full opacity-50"></div>
                                <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-tr from-orange-100 to-red-100 rounded-full opacity-40"></div>
                                
                                {/* Floating sparkles */}
                                <div className="absolute top-8 left-8">
                                    <Sparkles className="h-4 w-4 text-red-300 animate-pulse" />
                                </div>
                                <div className="absolute bottom-8 right-8">
                                    <Sparkles className="h-3 w-3 text-pink-300 animate-pulse" style={{animationDelay: '1s'}} />
                                </div>
                                
                                <div className="relative p-2">
                                    <ExpenseOverview
                                        transactions={expenseData}
                                        onExpenseIncome={() => setOpenAddExpenseModal(true)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expense List Section */}
                    <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                        <div className="relative">
                            {/* Card Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-3xl blur-xl"></div>
                            
                            {/* List Card */}
                            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                                {/* Card Header Decoration */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-orange-500 to-red-500"></div>
                                
                                {/* Corner Decorations */}
                                <div className="absolute top-4 left-4 w-10 h-10 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full opacity-60"></div>
                                <div className="absolute bottom-4 right-4 w-14 h-14 bg-gradient-to-tl from-orange-100 to-yellow-100 rounded-full opacity-40"></div>
                                
                                {/* Animated receipt icon */}
                                <div className="absolute top-6 right-6 animate-bounce-slow">
                                    <Receipt className="h-5 w-5 text-red-300 opacity-60" />
                                </div>
                                
                                <div className="relative p-2">
                                    <ExpenseList
                                        transactions={expenseData}
                                        onDelete={(id) => {
                                            setOpenDeleteAlert({ show: true, data: id });
                                        }}
                                        onDownload={handleDownloadExpenseDetails}
                                        onEmail={handleEmailExpenseDetails}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Action Button */}
                <div 
                    className="fixed bottom-8 right-8 z-50 animate-bounce-slow cursor-pointer"
                    onClick={() => setOpenAddExpenseModal(true)}
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-opacity animate-pulse"></div>
                        <div className="relative bg-gradient-to-r from-red-500 to-pink-600 p-4 rounded-full shadow-2xl transform transition-all group-hover:scale-110 group-hover:shadow-3xl">
                            <Plus className="h-6 w-6 text-white" />
                        </div>
                        {/* Floating expense indicator */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <Receipt className="h-3 w-3 text-white" />
                        </div>
                    </div>
                </div>

                {/* Modals */}
                <Modal
                    isOpen={openAddExpenseModal}
                    onClose={() => setOpenAddExpenseModal(false)}
                    title="Add Expense"
                >
                    {/* Pass the fetched expense categories to the AddExpenseForm */}
                    <AddExpenseForm
                        onAddExpense={handleAddExpense}
                        categories={categories} // Pass categories here
                    />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Expense"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this expense detail?"
                        onDelete={() => deleteExpense(openDeleteAlert.data)}
                    />
                </Modal>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes float-expense {
                    0%, 100% { 
                        transform: translateY(0px) rotate(0deg) scale(1); 
                        opacity: 0.2;
                    }
                    25% { 
                        transform: translateY(-15px) rotate(90deg) scale(1.1); 
                        opacity: 0.3;
                    }
                    50% { 
                        transform: translateY(-25px) rotate(180deg) scale(0.9); 
                        opacity: 0.25;
                    }
                    75% { 
                        transform: translateY(-10px) rotate(270deg) scale(1.05); 
                        opacity: 0.35;
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
                
                .animate-float-expense {
                    animation: float-expense 7s ease-in-out infinite;
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
    );
};

export default Expense;