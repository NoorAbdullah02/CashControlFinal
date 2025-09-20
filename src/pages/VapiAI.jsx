import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Plus, LoaderCircle } from "lucide-react";
import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import toast from "react-hot-toast";

// AI Chat Overview Component (similar to ExpenseOverview)
const AIOverview = ({ onStartNewChat, totalMessages }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h5 className="text-lg font-semibold text-gray-800">AI Assistant Overview</h5>
                    <p className="text-sm text-gray-500 mt-1">
                        Get intelligent insights about your finances and manage your money smarter.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                        onClick={onStartNewChat}
                    >
                        <Plus size={15} />
                        New Chat
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Bot className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-purple-900">Total Messages</p>
                            <p className="text-lg font-semibold text-purple-600">{totalMessages}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Sparkles className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-green-900">AI Status</p>
                            <p className="text-lg font-semibold text-green-600">Online</p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-blue-900">Session</p>
                            <p className="text-lg font-semibold text-blue-600">Active</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Chat List Component (similar to ExpenseList but without download/email)
const ChatList = ({ messages, onClearChat }) => {
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h5 className="text-lg font-semibold text-gray-800">Chat History</h5>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onClearChat}
                        disabled={messages.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                    >
                        Clear Chat
                    </button>
                </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No messages yet. Start a conversation with the AI!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} mb-4`}
                        >
                            <div className={`flex items-start gap-3 max-w-lg`}>
                                {msg.type === "bot" && (
                                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-purple-600" />
                                    </div>
                                )}

                                <div
                                    className={`p-4 rounded-lg shadow-sm ${msg.type === "user"
                                        ? "bg-purple-600 text-white rounded-br-sm"
                                        : "bg-gray-50 border rounded-bl-sm"
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                    <span className={`text-xs mt-2 block ${msg.type === "user" ? "text-purple-200" : "text-gray-400"
                                        }`}>
                                        {formatTime(msg.timestamp)}
                                    </span>
                                </div>

                                {msg.type === "user" && (
                                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-gray-600" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-end gap-3">
                <div className="flex-1">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about your finances..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows="3"
                        disabled={isLoading}
                    />
                </div>
                <button
                    onClick={onSendMessage}
                    disabled={!input.trim() || isLoading}
                    className="flex items-center justify-center w-12 h-12 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                >
                    {isLoading ? (
                        <LoaderCircle className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </button>
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

    const API_KEY = API_KEY_GEMINI;     //Gemini API KEY

    // const API_KEY = "sk-GSHWIHUganGbkJ72zj94ymNZ1wUkhTeQGkdcZFGEBYjmsPcs"; // DeepSick API Key


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
            // For Gemini API
            // Replace with your actual Vapi API endpoint
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

            // For Deeksiclk API

            // const response = await fetch("https://api.deepseek.com/chat/completions", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         "Authorization": `Bearer ${API_KEY}`
            //     },
            //     body: JSON.stringify({
            //         model: "deepseek-chat",
            //         messages: [
            //             {
            //                 role: "system",
            //                 content: "You are a helpful AI financial assistant. Provide clear, accurate, and actionable financial advice."
            //             },
            //             {
            //                 role: "user",
            //                 content: currentInput
            //             }
            //         ],
            //         stream: false
            //     })
            // });

            let botResponse;
            // For Gemini API
            if (response.ok) {
                const data = await response.json();
                botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I received your message, but I'm having trouble processing it right now.";
            }

            // For DeepSick API
            // if (response.ok) {
            //     const data = await response.json();
            //     botResponse = data.choices?.[0]?.message?.content || "I received your message, but I'm having trouble processing it right now.";
            // }
            else {
                // Fallback response for demo purposes
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

        // Default response
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
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    {/* AI Overview */}
                    <AIOverview
                        onStartNewChat={handleStartNewChat}
                        totalMessages={messages.length}
                    />

                    {/* Chat History */}
                    <ChatList
                        messages={messages}
                        onClearChat={handleClearChat}
                    />

                    {/* Chat Input */}
                    <ChatInput
                        input={input}
                        setInput={setInput}
                        onSendMessage={sendMessage}
                        isLoading={isLoading}
                    />

                    {/* Scroll to bottom reference */}
                    <div ref={messagesEndRef} />
                </div>
            </div>
        </Dashboard>
    );
};

export default VapiAI;

