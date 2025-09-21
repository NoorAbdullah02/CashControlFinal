import { useState, useRef, useEffect, useContext } from "react";
import { 
    User, 
    LogOut, 
    X, 
    Menu, 
    Settings, 
    Camera, 
    Key
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { AppContext } from "../context/AppContext.jsx";
import Sidebar from "./Sidebar.jsx";
import uploadProfileImage from "../util/uploadProfileImage.js";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";

const Menubar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const dropdownRef = useRef(null);
    const fileInputRef = useRef(null);
    const { clearUser, user, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        setShowDropdown(false);
        navigate("/login");
    };

    const handleChangePassword = () => {
        setShowDropdown(false);
        navigate("/forgot-password");
    };

    const handleChangeProfileImage = async () => {
        // Create a file input element
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select a valid image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            setImageUploading(true);
            
            try {
                // Upload to Cloudinary
                const imageUrl = await uploadProfileImage(file);
                
                // Update user profile with new image
                const response = await axiosConfig.put(API_ENDPOINTS.UPLOAD_IMAGE, {
                    ...user,
                    profileImageUrl: imageUrl
                });
                
                if (response.status === 200) {
                    // Update user context
                    setUser(prev => ({
                        ...prev,
                        profileImageUrl: imageUrl
                    }));
                    
                    toast.success("Profile photo updated successfully!");
                }
            } catch (error) {
                console.error("Error updating profile image:", error);
                toast.error(error.response?.data?.message || "Failed to update profile photo");
            } finally {
                setImageUploading(false);
            }
        };
        
        // Trigger file picker
        input.click();
        setShowDropdown(false);
    };

    const handleProfileSettings = () => {
        setShowDropdown(false);
        navigate("/profile-settings");
    };

    return (
        <div className="flex items-center justify-between gap-5 bg-white/95 border-b border-blue-200/50 backdrop-blur-md py-4 px-4 sm:px-7 sticky top-0 z-30 shadow-sm">
            {/* Left side - Menu button and title */}
            <div className="flex items-center gap-5">
                <button
                    className="block lg:hidden text-slate-700 hover:bg-blue-50 p-2 rounded-xl transition-all duration-200 hover:scale-105"
                    onClick={() => {
                        setOpenSideMenu(!openSideMenu);
                    }}
                >
                    {openSideMenu ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl blur-lg opacity-30"></div>
                        <img src={assets.logo} alt="logo" className="relative h-10 w-10 rounded-xl shadow-lg" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                        Cash Control
                    </span>
                </div>
            </div>

            {/* Right side - Enhanced Avatar dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className="relative group"
                >
                    {/* Animated ring */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-300 animate-pulse"></div>
                    
                    {/* Avatar container */}
                    <div className="relative flex items-center justify-center w-11 h-11 bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 rounded-full transition-all duration-300 transform group-hover:scale-105 border-2 border-white shadow-lg">
                        {user?.profileImageUrl ? (
                            <img 
                                src={user.profileImageUrl} 
                                alt="profile" 
                                className="w-9 h-9 rounded-full object-cover" 
                            />
                        ) : (
                            <User className="w-5 h-5 text-blue-600" />
                        )}
                        
                        {/* Online indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                </button>

                {/* Enhanced Dropdown Menu */}
                {showDropdown && (
                    <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-200/50 overflow-hidden z-50">
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4 text-white">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    {user?.profileImageUrl ? (
                                        <img 
                                            src={user.profileImageUrl} 
                                            alt="profile" 
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white/50" 
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-white" />
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-lg font-semibold text-white truncate">
                                        {user.fullName || "User Name"}
                                    </p>
                                    <p className="text-blue-100 text-sm truncate">{user.email || "user@email.com"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu sections */}
                        <div className="py-2">
                            {/* <button
                                onClick={handleProfileSettings}
                                className="flex items-center gap-4 w-full px-6 py-3 text-slate-700 hover:bg-blue-50 transition-all duration-200 group"
                            >
                                <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
                                    <Settings className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium">Profile Settings</p>
                                    <p className="text-xs text-slate-500">Update your profile information</p>
                                </div>
                            </button>

                            <button
                                onClick={handleChangeProfileImage}
                                disabled={imageUploading}
                                className="flex items-center gap-4 w-full px-6 py-3 text-slate-700 hover:bg-blue-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="w-8 h-8 bg-cyan-100 group-hover:bg-cyan-200 rounded-lg flex items-center justify-center transition-colors">
                                    {imageUploading ? (
                                        <div className="w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Camera className="w-4 h-4 text-cyan-600" />
                                    )}
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium">
                                        {imageUploading ? "Uploading..." : "Change Photo"}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {imageUploading ? "Please wait..." : "Upload a new profile picture"}
                                    </p>
                                </div>
                            </button> */}

                            <button
                                onClick={handleChangePassword}
                                className="flex items-center gap-4 w-full px-6 py-3 text-slate-700 hover:bg-blue-50 transition-all duration-200 group"
                            >
                                <div className="w-8 h-8 bg-teal-100 group-hover:bg-teal-200 rounded-lg flex items-center justify-center transition-colors">
                                    <Key className="w-4 h-4 text-teal-600" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium">Change Password</p>
                                    <p className="text-xs text-slate-500">Update your login password</p>
                                </div>
                            </button>

                            {/* Divider */}
                            <div className="mx-4 my-3 h-px bg-gradient-to-r from-transparent via-red-200 to-transparent"></div>
                            
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-4 w-full px-6 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 group"
                            >
                                <div className="w-8 h-8 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors">
                                    <LogOut className="w-4 h-4 text-red-600" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium">Sign Out</p>
                                    <p className="text-xs text-red-400">Log out of your account</p>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile side menu */}
            {openSideMenu && (
                <div className="fixed top-[73px] left-0 right-0 bg-white/95 backdrop-blur-md border-b border-blue-200/50 lg:hidden z-20 shadow-lg">
                    <Sidebar activeMenu={activeMenu} />
                </div>
            )}
        </div>
    );
};

export default Menubar;