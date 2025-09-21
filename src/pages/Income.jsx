import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import IncomeList from "../components/IncomeList.jsx";
import log from "eslint-plugin-react/lib/util/log.js";
import Modal from "../components/Modal.jsx";
import { Plus, TrendingUp, Sparkles, DollarSign } from "lucide-react";
import AddIncomeForm from "../components/AddIncomeForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import IncomeOverview from "../components/IncomeOverview.jsx";

const Income = () => {
    useUser();
    const [incomeData, setIncomeData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    // Fetch income details from the API
    const fetchIncomeDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
            if (response.status === 200) {
                setIncomeData(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch income details:', error);
            toast.error(error.response?.data?.message || "Failed to fetch income details");
        } finally {
            setLoading(false);
        }
    }

    // Fetch categories for income
    const fetchIncomeCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
            if (response.status === 200) {
                console.log('income categories', response.data);
                setCategories(response.data);
            }
        } catch (error) {
            console.log('Failed to fetch income categories:', error);
            toast.error(error.data?.message || "Failed to fetch income categories");
        }
    }

    //save the income details
    const handleAddIncome = async (income) => {
        const { name, amount, date, icon, categoryId } = income;

        //validation
        if (!name.trim()) {
            toast.error("Please enter a name");
            return;
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be a valid number greater than 0");
            return;
        }

        if (!date) {
            toast.error("Please select a date");
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (date > today) {
            toast.error('Date cannot be in the future');
            return;
        }

        if (!categoryId) {
            toast.error("Please select a category");
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
                name,
                amount: Number(amount),
                date,
                icon,
                categoryId,
            })
            if (response.status === 201) {
                setOpenAddIncomeModal(false);
                toast.success("Income added successfully");
                fetchIncomeDetails();
                fetchIncomeCategories();
            }
        } catch (error) {
            console.log('Error adding income', error);
            toast.error(error.response?.data?.message || "Failed to adding income");
        }
    }

    //delete income details
    const deleteIncome = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Income deleted successfully");
            fetchIncomeDetails();
        } catch (error) {
            console.log('Error deleting income', error);
            toast.error(error.response?.data?.message || "Failed to delete income");
        }
    }

    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.INCOME_EXCEL_DOWNLOAD, { responseType: "blob" });
            let filename = "income_details.xlsx";
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Download income details successfully");
        } catch (error) {
            console.error('Error downloading income details:', error);
            toast.error(error.response?.data?.message || "Failed to download income");
        }
    }

    const handleEmailIncomeDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_INCOME);
            if (response.status === 200) {
                toast.success("Income details emailed successfully");
            }
        } catch (error) {
            console.error('Error emailing income details:', error);
            toast.error(error.response?.data?.message || "Failed to email income");
        }
    }

    useEffect(() => {
        fetchIncomeDetails();
        fetchIncomeCategories()
    }, []);

    return (
        <Dashboard activeMenu="Income">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-emerald-200 to-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-cyan-200 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-32 left-1/4 w-80 h-80 bg-gradient-to-r from-green-200 to-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
                
                {/* Floating Elements */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float opacity-20"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${6 + Math.random() * 4}s`
                        }}
                    >
                        {i % 3 === 0 ? (
                            <DollarSign className="h-6 w-6 text-emerald-400" />
                        ) : i % 3 === 1 ? (
                            <TrendingUp className="h-5 w-5 text-teal-400" />
                        ) : (
                            <Sparkles className="h-4 w-4 text-cyan-400" />
                        )}
                    </div>
                ))}

                {/* Geometric Shapes */}
                <div className="absolute top-1/4 right-1/3 w-8 h-8 border-2 border-emerald-300 rotate-45 animate-spin opacity-30" style={{animationDuration: '15s'}}></div>
                <div className="absolute bottom-1/3 left-1/5 w-6 h-6 bg-teal-300 rounded-full animate-bounce opacity-40" style={{animationDelay: '3s'}}></div>
                <div className="absolute top-2/3 right-1/4 w-4 h-4 bg-cyan-400 transform rotate-45 animate-pulse opacity-50" style={{animationDelay: '1s'}}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                {/* Page Header with Animation */}
                <div className="mb-8 mt-6 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                                <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-2xl shadow-xl">
                                    <TrendingUp className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    Income Management
                                </h1>
                                <p className="text-gray-500 mt-1 text-lg">Track and manage your income streams</p>
                            </div>
                        </div>
                        
                        {/* Quick Stats */}
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Total Entries</p>
                                <p className="text-2xl font-bold text-emerald-600">{incomeData.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Decorative Line */}
                    <div className="mt-6 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full opacity-60"></div>
                </div>

                {/* Content Grid with Staggered Animation */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Overview Section */}
                    <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        <div className="relative">
                            {/* Card Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-xl"></div>
                            
                            {/* Overview Card */}
                            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                                {/* Card Header Decoration */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                                
                                {/* Corner Decorations */}
                                <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full opacity-50"></div>
                                <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-tr from-cyan-100 to-blue-100 rounded-full opacity-40"></div>
                                
                                <div className="relative p-2">
                                    <IncomeOverview 
                                        transactions={incomeData} 
                                        onAddIncome={() => setOpenAddIncomeModal(true)} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Income List Section */}
                    <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                        <div className="relative">
                            {/* Card Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
                            
                            {/* List Card */}
                            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                                {/* Card Header Decoration */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500"></div>
                                
                                {/* Corner Decorations */}
                                <div className="absolute top-4 left-4 w-10 h-10 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full opacity-60"></div>
                                <div className="absolute bottom-4 right-4 w-14 h-14 bg-gradient-to-tl from-blue-100 to-purple-100 rounded-full opacity-40"></div>
                                
                                <div className="relative p-2">
                                    <IncomeList
                                        transactions={incomeData}
                                        onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                                        onDownload={handleDownloadIncomeDetails}
                                        onEmail={handleEmailIncomeDetails}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Action Button */}
                <div 
                    className="fixed bottom-8 right-8 z-50 animate-bounce-slow cursor-pointer"
                    onClick={() => setOpenAddIncomeModal(true)}
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-opacity animate-pulse"></div>
                        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-full shadow-2xl transform transition-all group-hover:scale-110 group-hover:shadow-3xl">
                            <Plus className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Modals */}
                <Modal
                    isOpen={openAddIncomeModal}
                    onClose={() => setOpenAddIncomeModal(false)}
                    title="Add Income"
                >
                    <AddIncomeForm
                        onAddIncome={(income) => handleAddIncome(income)}
                        categories={categories}
                    />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Income"
                >
                    <DeleteAlert
                        content="Are you sure want to delete this income details?"
                        onDelete={() => deleteIncome(openDeleteAlert.data)}
                    />
                </Modal>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
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
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
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

export default Income;