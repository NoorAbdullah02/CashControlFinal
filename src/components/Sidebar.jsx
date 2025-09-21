import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { User } from "lucide-react";
import { SIDE_BAR_DATA } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeMenu }) => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  
  return (
    <div className="w-64 h-[calc(100vh-61px)] relative sticky top-[61px] z-20 overflow-hidden">
      {/* Scrollable content wrapper - wider than container to push scrollbar outside */}
      <div className="w-[280px] h-full overflow-y-auto pr-4 -mr-4 scrollbar-hide">
        {/* Dynamic white background with animated patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/80 to-blue-50/60"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-12 left-6 w-24 h-24 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-3xl rotate-12 blur-sm animate-pulse hover:blur-none transition-all duration-700"></div>
        <div className="absolute top-32 right-8 w-16 h-16 bg-gradient-to-br from-pink-200/50 to-orange-200/50 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
        <div className="absolute bottom-24 left-8 w-20 h-20 bg-gradient-to-br from-green-200/40 to-teal-200/40 rounded-2xl -rotate-12 animate-pulse" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute bottom-40 right-4 w-12 h-12 bg-gradient-to-br from-violet-200/50 to-indigo-200/50 rounded-full animate-spin" style={{animationDuration: '15s'}}></div>
        
        {/* Interactive mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-80"></div>
        
        {/* Dynamic border with color waves */}
        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 via-purple-500 via-pink-500 to-green-400 opacity-60">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent animate-pulse"></div>
        </div>
        
        <div className="relative p-6 min-h-full flex flex-col">
          {/* Interactive User Profile Section */}
          <div className="flex flex-col items-center justify-center gap-5 mt-4 mb-8 group cursor-pointer">
            <div className="relative">
              {/* Multi-layer hover ring system */}
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-70 group-hover:animate-spin transition-all duration-500" style={{animationDuration: '10s'}}></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-50 group-hover:animate-spin transition-all duration-700" style={{animationDuration: '8s', animationDirection: 'reverse'}}></div>
              
              {/* Profile container with advanced interactions */}
              <div className="relative transform group-hover:scale-110 transition-all duration-500">
                {user?.profileImageUrl ? (
                  <div className="relative">
                    <img 
                      src={user?.profileImageUrl || ""} 
                      alt="profile image" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-2xl group-hover:shadow-blue-500/30 transition-all duration-500" 
                    />
                    {/* Overlay effects on hover */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/20 via-transparent to-purple-400/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center border-4 border-white shadow-2xl group-hover:shadow-blue-500/30 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-blue-200 group-hover:to-purple-200">
                    <User className="w-12 h-12 text-blue-600 group-hover:text-purple-600 transition-colors duration-500" />
                  </div>
                )}
                
                {/* Interactive status with multiple animations */}
                <div className="absolute -bottom-2 -right-2 group">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-125 transition-transform duration-300">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                  <div className="absolute inset-0 bg-green-300 rounded-full animate-ping opacity-60"></div>
                </div>
              </div>
            </div>
            
            {/* Enhanced user info with interactions */}
            <div className="text-center transform group-hover:scale-105 transition-all duration-300">
              <h5 className="text-gray-800 font-bold text-xl leading-6 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-500">
                {user.fullName || "Welcome User"}
              </h5>
              <div className="flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
                <p className="text-gray-600 text-sm font-medium group-hover:text-blue-600 transition-colors duration-300">Online & Active</p>
              </div>
            </div>
          </div>

          {/* Hyper-interactive Navigation Menu */}
          <nav className="flex-1 space-y-2 min-h-0">
            {SIDE_BAR_DATA.map((item, index) => (
              <div 
                key={`menu_${index}`}
                className="relative group"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'slideInRight 0.8s ease-out forwards'
                }}
              >
                <button
                  onClick={() => navigate(item.path)}
                  className={`
                    relative w-full flex items-center gap-4 text-[15px] py-4 px-6 rounded-2xl transition-all duration-500 font-semibold overflow-hidden transform group-hover:scale-105
                    ${activeMenu === item.label 
                      ? "text-white shadow-2xl shadow-blue-500/30 scale-105" 
                      : "text-gray-700 hover:text-white group-hover:shadow-xl group-hover:shadow-purple-500/20"
                    }
                  `}
                >
                  {/* Dynamic background system */}
                  {activeMenu === item.label ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-pulse"></div>
                      <div className="absolute inset-0 bg-white/10 rounded-2xl"></div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    </>
                  )}
                  
                  {/* Interactive icon container */}
                  <div className={`
                    relative z-10 flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 group-hover:rotate-12
                    ${activeMenu === item.label 
                      ? "text-white bg-white/20 shadow-lg" 
                      : "text-gray-600 bg-white/80 shadow-md group-hover:text-white group-hover:bg-white/20 group-hover:shadow-xl group-hover:scale-110"
                    }
                  `}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  
                  {/* Label with advanced effects */}
                  <span className="relative z-10 transition-all duration-300 group-hover:tracking-wide">
                    {item.label}
                  </span>
                  
                  {/* Active state indicators */}
                  {activeMenu === item.label && (
                    <div className="relative z-10 flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-lg"></div>
                      <div className="w-1 h-1 bg-white/70 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    </div>
                  )}
                  
                  {/* Interactive hover elements */}
                  {activeMenu !== item.label && (
                    <div className="relative z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-white to-transparent transform translate-x-4 group-hover:translate-x-0 transition-transform duration-300"></div>
                      <div className="w-2 h-2 bg-white rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    </div>
                  )}
                  
                  {/* Ripple effect on click */}
                  <div className="absolute inset-0 rounded-2xl bg-white/40 opacity-0 group-active:opacity-100 group-active:scale-110 transition-all duration-200"></div>
                </button>
                
                {/* Side accent for active item */}
                {activeMenu === item.label && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full shadow-lg animate-pulse"></div>
                )}
              </div>
            ))}
          </nav>

          {/* Interactive bottom section */}
          <div className="mt-6 space-y-4 group">
            {/* Animated progress/activity bar */}
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-2000 ease-out"></div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center group-hover:text-blue-600 transition-colors duration-300">Activity Level</p>
            </div>
            
            {/* Interactive stats card */}
            <div className="bg-gradient-to-r from-white to-blue-50/50 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">Dashboard</p>
                  <p className="text-xs text-gray-500">Version 4.0</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse group-hover:animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Advanced CSS animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        .group:hover .animate-bounce {
          animation-duration: 1s;
        }
        
        /* Hide scrollbar completely - Enhanced version for all browsers */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;     /* Firefox */
          overflow-y: scroll;        /* Enable scrolling */
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;             /* Chrome, Safari, Opera */
          width: 0;                  /* Remove width */
          height: 0;                 /* Remove height */
          background: transparent;   /* Transparent background */
        }
        
        .scrollbar-hide::-webkit-scrollbar-track {
          display: none;
          background: transparent;
        }
        
        .scrollbar-hide::-webkit-scrollbar-thumb {
          display: none;
          background: transparent;
        }
        
        .scrollbar-hide::-webkit-scrollbar-corner {
          display: none;
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;