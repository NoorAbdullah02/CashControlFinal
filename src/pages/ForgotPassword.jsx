import { useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Use direct URL for testing
    const FORGOT_PASSWORD_URL = 'http://localhost:8080/api/v1.0/forgot-password';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Validate email
        if (!email || !email.trim()) {
            setMessage('Please enter your email address');
            setLoading(false);
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            // Configure request
            const requestBody = JSON.stringify({ email: email.trim() });

            console.log('Request URL:', FORGOT_PASSWORD_URL);
            console.log('Request body:', requestBody);

            const response = await fetch(FORGOT_PASSWORD_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: email.trim() })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            console.log('Success response:', response);
            console.log('Response data:', data);

            setMessage(data.message || 'Reset link sent successfully!');
            setEmail('');
        } catch (error) {
            console.error('=== ERROR DETAILS ===');
            console.error('Full error:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);

            if (error.message.includes('HTTP')) {
                const status = error.message.match(/HTTP (\d+)/)?.[1];
                switch (status) {
                    case '403':
                        setMessage('Access forbidden. This might be a CORS issue or authentication problem.');
                        break;
                    case '404':
                        setMessage('Endpoint not found. Please check if the backend server is running.');
                        break;
                    case '500':
                        setMessage('Server error: Internal server error');
                        break;
                    default:
                        setMessage(`Server error: ${error.message}`);
                }
            } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                setMessage('Network error: Unable to reach the server. Please check if the backend is running on http://localhost:8080');
            } else {
                setMessage(`Request error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <div>
                    <h2 className="text-2xl font-bold text-center text-gray-900">Forgot Password</h2>
                    <p className="mt-2 text-sm text-gray-600 text-center">
                        Enter your email address to receive a password reset link
                    </p>
                </div>

                {/* Debug Information */}
                <div className="bg-gray-100 p-3 rounded text-xs">
                    <p className="font-semibold">Debug Info:</p>
                    <p>API URL: {FORGOT_PASSWORD_URL}</p>
                    <p>Current Origin: {window.location.origin}</p>
                    <p>Email: {email}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Sending...
                                </div>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </div>
                </form>

                {message && (
                    <div className={`mt-4 p-3 rounded-md text-sm ${message.includes('successfully') || message.includes('sent')
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                        {message}
                    </div>
                )}

                {/* Network Test Button */}
                <button
                    onClick={async () => {
                        try {
                            const response = await fetch('http://localhost:8080/status');
                            console.log('Server status check:', response.status);
                            setMessage(`Server reachable: ${response.status}`);
                        } catch (err) {
                            console.error('Server unreachable:', err);
                            setMessage('Server unreachable - check if backend is running');
                        }
                    }}
                    className="w-full py-1 px-2 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                >
                    Test Server Connection
                </button>
            </div>
        </div>
    );
};

export default ForgotPassword;