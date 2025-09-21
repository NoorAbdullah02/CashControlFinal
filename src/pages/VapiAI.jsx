import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Plus, LoaderCircle, MessageCircle, Zap, Brain } from "lucide-react";
import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import toast from "react-hot-toast";

// AI Chat Overview Component
const AIOverview = ({ onStartNewChat, totalMessages }) => {
    return (
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
            {/* Header Decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-cyan-500"></div>
            
            {/* Corner Decorations */}
            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full opacity-50"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-tr from-cyan-100 to-blue-100 rounded-full opacity-40"></div>
            
            {/* Floating AI icon */}
            <div className="absolute top-6 left-6 animate-bounce-slow">
                <Brain className="h-4 w-4 text-blue-300 opacity-60" />
            </div>
            
            <div className="relative p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-500 rounded-2xl blur-sm opacity-50 animate-pulse"></div>
                            <div className="relative bg-gradient-to-r from-blue-500 to-teal-600 p-3 rounded-2xl shadow-xl">
                                <Bot className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <h5 className="text-xl font-bold text-gray-800">AI Financial Assistant</h5>
                            <p className="text-gray-600 mt-1">
                                Get intelligent insights about your finances and manage your money smarter.
                            </p>
                        </div>
                    </div>
                    
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <button
                            className="relative bg-gradient-to-r from-blue-500 to-teal-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl transform transition-all group-hover:scale-105 flex items-center space-x-2"
                            onClick={onStartNewChat}
                        >
                            <Plus className="h-4 w-4" />
                            <span>New Chat</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-2xl blur-sm"></div>
                        <div className="relative bg-white/70 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 transform transition-all group-hover:scale-105">
                            <div className="flex items-center">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-xl shadow-lg">
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-blue-900">Total Messages</p>
                                    <p className="text-2xl font-bold text-blue-600">{totalMessages}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl blur-sm"></div>
                        <div className="relative bg-white/70 backdrop-blur-sm border border-emerald-200 rounded-2xl p-4 transform transition-all group-hover:scale-105">
                            <div className="flex items-center">
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-xl shadow-lg">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-emerald-900">AI Status</p>
                                    <p className="text-2xl font-bold text-emerald-600">Online</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl blur-sm"></div>
                        <div className="relative bg-white/70 backdrop-blur-sm border border-teal-200 rounded-2xl p-4 transform transition-all group-hover:scale-105">
                            <div className="flex items-center">
                                <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-2 rounded-xl shadow-lg">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-teal-900">Session</p>
                                    <p className="text-2xl font-bold text-teal-600">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Chat List Component
const ChatList = ({ messages, onClearChat }) => {
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
            {/* Header Decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500"></div>
            
            {/* Corner Decorations */}
            <div className="absolute top-4 left-4 w-10 h-10 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full opacity-60"></div>
            <div className="absolute bottom-4 right-4 w-14 h-14 bg-gradient-to-tl from-cyan-100 to-blue-100 rounded-full opacity-40"></div>
            
            <div className="relative p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-2 rounded-xl shadow-lg">
                            <MessageCircle className="text-white h-5 w-5" />
                        </div>
                        <div>
                            <h5 className="text-xl font-bold text-gray-800">Chat History</h5>
                            <p className="text-gray-600 text-sm">Your conversation with the AI assistant</p>
                        </div>
                    </div>
                    
                    <div className="relative group">
                        <button
                            onClick={onClearChat}
                            disabled={messages.length === 0}
                            className="bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 text-red-700 px-4 py-2 rounded-2xl transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transform group-hover:scale-105"
                        >
                            Clear Chat
                        </button>
                    </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {messages.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-gradient-to-r from-blue-100 to-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bot className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-gray-500 font-medium">No messages yet</p>
                            <p className="text-gray-400 text-sm mt-1">Start a conversation with the AI!</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} mb-4 animate-fade-in-up`}
                                style={{animationDelay: `${index * 0.1}s`}}
                            >
                                <div className={`flex items-start gap-3 max-w-lg`}>
                                    {msg.type === "bot" && (
                                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    )}

                                    <div
                                        className={`p-4 rounded-2xl shadow-xl backdrop-blur-sm transform transition-all hover:scale-105 ${
                                            msg.type === "user"
                                                ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-br-sm"
                                                : "bg-white/90 border border-gray-200 rounded-bl-sm"
                                        }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <span className={`text-xs mt-2 block ${
                                            msg.type === "user" ? "text-blue-200" : "text-gray-400"
                                        }`}>
                                            {formatTime(msg.timestamp)}
                                        </span>
                                    </div>

                                    {msg.type === "user" && (
                                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// Chat Input Component
const ChatInput = ({ input, setInput, onSendMessage, isLoading }) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };

    return (
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
            {/* Header Decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500"></div>
            
            <div className="relative p-6">
                <div className="flex items-end gap-4">
                    <div className="flex-1 relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything about your finances..."
                            className="w-full p-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-gray-700"
                            rows="3"
                            disabled={isLoading}
                        />
                        {/* Input glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-teal-500/5 rounded-2xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <button
                            onClick={onSendMessage}
                            disabled={!input.trim() || isLoading}
                            className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl transition-all transform group-hover:scale-110 shadow-xl disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <LoaderCircle className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VapiAI = () => {
    useUser();

    const [messages, setMessages] = useState([
        {
            type: "bot",
            text: "Hello! I'm your AI financial assistant. I can help you with expense tracking, budget planning, financial analysis, and money-saving tips. What would you like to know?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const API_KEY = "AIzaSyDoMVhmBOUfFfZ60qGj6TO1F8yyE0hdbBQ";     //Gemini API KEY

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Send text query to AI
    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = {
            type: "user",
            text: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input.trim();
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `As a financial assistant, please respond to this question: ${currentInput}`
                                }
                            ]
                        }
                    ]
                })
            });

            let botResponse;
            if (response.ok) {
                const data = await response.json();
                botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I received your message, but I'm having trouble processing it right now.";
            } else {
                botResponse = generateFinancialResponse(currentInput);
            }

            const botMessage = {
                type: "bot",
                text: botResponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = {
                type: "bot",
                text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Generate financial response (fallback)
    const generateFinancialResponse = (input) => {
        const lowerInput = input.toLowerCase();

        if (lowerInput.includes('expense') || lowerInput.includes('spending')) {
            return "I can help you track and analyze your expenses. To better manage your spending, try categorizing your expenses, setting monthly budgets for each category, and reviewing your spending patterns regularly. Would you like me to analyze your current expense data?";
        }

        if (lowerInput.includes('income') || lowerInput.includes('salary') || lowerInput.includes('earning')) {
            return "Great question about income! I can help you optimize your income streams. Consider diversifying your income sources, tracking all income sources systematically, and setting aside a percentage for savings and investments. Would you like tips on increasing your income?";
        }

        if (lowerInput.includes('budget') || lowerInput.includes('plan')) {
            return "Budgeting is crucial for financial health! I recommend the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment. Would you like me to help you create a personalized budget based on your income and expenses?";
        }

        if (lowerInput.includes('save') || lowerInput.includes('saving')) {
            return "Saving money is a great habit! Start with an emergency fund covering 3-6 months of expenses. Then consider high-yield savings accounts, automate your savings, and look for areas to cut unnecessary expenses. What's your current savings goal?";
        }

        if (lowerInput.includes('invest') || lowerInput.includes('investment')) {
            return "Investment is key to building wealth! Consider starting with low-cost index funds, diversify your portfolio, and invest consistently over time. Remember to only invest money you won't need in the short term. Would you like to know more about investment basics?";
        }

        if (lowerInput.includes('debt') || lowerInput.includes('loan')) {
            return "Managing debt is important for financial freedom. Consider the debt avalanche method (pay minimums on all debts, extra on highest interest) or debt snowball method (pay minimums on all debts, extra on smallest balance). Which approach interests you more?";
        }

        return "I'm here to help with all your financial questions! I can assist with budgeting, expense tracking, saving strategies, investment basics, debt management, and financial planning. What specific area would you like to explore?";
    };

    const handleStartNewChat = () => {
        setMessages([
            {
                type: "bot",
                text: "Hello! I'm your AI financial assistant. I can help you with expense tracking, budget planning, financial analysis, and money-saving tips. What would you like to know?",
                timestamp: new Date()
            }
        ]);
        toast.success("New chat started!");
    };

    const handleClearChat = () => {
        setMessages([]);
        toast.success("Chat history cleared!");
    };

    return (
        <Dashboard activeMenu="AI Assistant">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute top-16 right-12 w-80 h-80 bg-gradient-to-r from-blue-200 to-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse"></div>
                <div className="absolute bottom-32 left-16 w-96 h-96 bg-gradient-to-r from-cyan-200 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-gradient-to-r from-teal-200 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-500"></div>
                
                {/* Floating AI Elements */}
                {[...Array(10)].map((_, i) => (
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
                        {i % 4 === 0 ? (
                            <Bot className="h-6 w-6 text-blue-400" />
                        ) : i % 4 === 1 ? (
                            <Brain className="h-5 w-5 text-teal-400" />
                        ) : i % 4 === 2 ? (
                            <Sparkles className="h-4 w-4 text-cyan-400" />
                        ) : (
                            <MessageCircle className="h-5 w-5 text-blue-400" />
                        )}
                    </div>
                ))}

                {/* Geometric shapes */}
                <div className="absolute top-1/4 left-1/5 w-8 h-8 border-2 border-teal-300 rotate-45 animate-spin opacity-30" style={{animationDuration: '12s'}}></div>
                <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-cyan-300 rounded-full animate-bounce opacity-40" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-2/3 left-1/3 w-4 h-4 bg-blue-400 transform rotate-45 animate-pulse opacity-50" style={{animationDelay: '1.5s'}}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                {/* Page Header with Animation */}
                <div className="mb-8 mt-6 animate-fade-in-up px-4 sm:px-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                                <div className="relative bg-gradient-to-r from-blue-500 to-teal-600 p-4 rounded-2xl shadow-xl">
                                    <Bot className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    AI Assistant
                                </h1>
                                <p className="text-gray-500 mt-1 text-lg">Your intelligent financial advisor</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Decorative Line */}
                    <div className="mt-6 w-full h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-cyan-500 rounded-full opacity-60"></div>
                </div>

                {/* Content Grid with Staggered Animation */}
                <div className="grid grid-cols-1 gap-8 px-4 sm:px-0">
                    {/* AI Overview */}
                    <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        <AIOverview
                            onStartNewChat={handleStartNewChat}
                            totalMessages={messages.length}
                        />
                    </div>

                    {/* Chat History */}
                    <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                        <ChatList
                            messages={messages}
                            onClearChat={handleClearChat}
                        />
                    </div>

                    {/* Chat Input */}
                    <div className="animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                        <ChatInput
                            input={input}
                            setInput={setInput}
                            onSendMessage={sendMessage}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Scroll to bottom reference */}
                    <div ref={messagesEndRef} />
                </div>
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
                
                .scrollbar-thin {
                    scrollbar-width: thin;
                }
                
                .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
                    background-color: #d1d5db;
                    border-radius: 0.5rem;
                }
                
                .scrollbar-track-gray-100::-webkit-scrollbar-track {
                    background-color: #f3f4f6;
                    border-radius: 0.5rem;
                }
                
                .scrollbar-thin::-webkit-scrollbar {
                    width: 8px;
                }
            `}</style>
        </Dashboard>
    );
};

export default VapiAI;