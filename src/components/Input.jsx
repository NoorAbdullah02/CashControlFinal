import {useState} from "react";
import {Eye, EyeOff, ChevronDown, Sparkles} from "lucide-react";

const Input = ({label, value, onChange, placeholder, type, isSelect, options, onFocus, onBlur}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleFocus = (e) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    }

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    }

    return (
        <div className="relative mb-6">
            {/* Floating Label */}
            <label 
                className={`absolute left-4 transition-all duration-300 pointer-events-none z-10 ${
                    isFocused || value 
                        ? '-top-2 text-xs bg-white px-2 text-blue-600 font-semibold' 
                        : 'top-3 text-sm text-gray-500'
                }`}
            >
                {label}
            </label>

            <div className="relative">
                {isSelect ? (
                    <div className="relative">
                        <select
                            className={`w-full bg-white/90 backdrop-blur-sm outline-none border-2 rounded-xl py-3 px-4 pr-12 text-gray-700 text-base transition-all duration-300 appearance-none cursor-pointer ${
                                isFocused 
                                    ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-white' 
                                    : value 
                                        ? 'border-gray-300 shadow-md' 
                                        : 'border-gray-200 shadow-sm hover:border-gray-300'
                            }`}
                            value={value}
                            onChange={onChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        >
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        
                        {/* Custom dropdown arrow */}
                        <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none ${
                            isFocused ? 'text-blue-500 rotate-180' : 'text-gray-400'
                        }`}>
                            <ChevronDown size={20} />
                        </div>

                        {/* Selection indicator */}
                        {value && (
                            <div className="absolute right-12 top-1/2 -translate-y-1/2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative">
                        <input
                            className={`w-full bg-white/90 backdrop-blur-sm outline-none border-2 rounded-xl py-3 px-4 text-gray-700 text-base transition-all duration-300 ${
                                type === 'password' ? 'pr-12' : 'pr-4'
                            } ${
                                isFocused 
                                    ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-white' 
                                    : value 
                                        ? 'border-gray-300 shadow-md' 
                                        : 'border-gray-200 shadow-sm hover:border-gray-300'
                            }`}
                            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                            placeholder={isFocused ? placeholder : ''}
                            value={value}
                            onChange={onChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />

                        {/* Input value indicator */}
                        {value && type !== 'password' && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            </div>
                        )}
                    </div>
                )}

                {/* Password toggle */}
                {type === 'password' && (
                    <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        onClick={toggleShowPassword}
                    >
                        {showPassword ? (
                            <Eye size={20} className="text-blue-500" />
                        ) : (
                            <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                        )}
                    </button>
                )}
            </div>

            {/* Focus glow effect */}
            {isFocused && (
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-sm"></div>
            )}

            {/* Bottom border animation */}
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ${
                isFocused ? 'w-full' : 'w-0'
            }`}></div>

            {/* Micro animation sparkle */}
            {isFocused && (
                <div className="absolute -top-1 -right-1 animate-ping">
                    <Sparkles size={12} className="text-blue-400 opacity-60" />
                </div>
            )}

            {/* Field type indicator */}
            <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl transition-all duration-300 ${
                type === 'email' ? 'bg-gradient-to-b from-cyan-500 to-blue-500' :
                type === 'password' ? 'bg-gradient-to-b from-red-500 to-pink-500' :
                type === 'number' ? 'bg-gradient-to-b from-emerald-500 to-teal-500' :
                type === 'date' ? 'bg-gradient-to-b from-purple-500 to-indigo-500' :
                isSelect ? 'bg-gradient-to-b from-orange-500 to-amber-500' :
                'bg-gradient-to-b from-gray-400 to-gray-500'
            } ${isFocused ? 'opacity-100' : 'opacity-30'}`}></div>

            {/* Error state placeholder - you can extend this */}
            {/* Validation hint placeholder */}
        </div>
    )
}

export default Input;