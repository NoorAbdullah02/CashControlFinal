import { CheckCircle, Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ActivationSuccess() {
  const [countdown, setCountdown] = useState(5);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/login';
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 max-w-2xl w-full transform transition-all duration-1000 ${show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 text-center relative overflow-hidden">
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-400 opacity-10 rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-400 to-emerald-400 opacity-10 rounded-tr-full"></div>

          {/* Success Icon with Animation */}
          <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full animate-pulse opacity-30"></div>
            <div className="relative bg-gradient-to-br from-emerald-50 to-green-50 rounded-full p-8 shadow-lg">
              <CheckCircle className="w-24 h-24 text-green-500" strokeWidth={2.5} />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-bounce" />
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Welcome Aboard! 🎉
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your account has been <span className="font-semibold text-green-600">successfully activated</span>
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
              <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700">Secure</p>
              <p className="text-xs text-gray-500 mt-1">Bank-level security</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <Zap className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700">Fast</p>
              <p className="text-xs text-gray-500 mt-1">Instant tracking</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
              <Sparkles className="w-8 h-8 text-teal-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700">Smart</p>
              <p className="text-xs text-gray-500 mt-1">AI-powered insights</p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="mb-8 inline-block">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl px-8 py-4 border border-emerald-200 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">Redirecting to login in</p>
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <span className="relative text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  {countdown}
                </span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => window.location.href = '/login'}
            className="group bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 hover:from-teal-600 hover:via-emerald-600 hover:to-green-600 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 mx-auto"
          >
            Start Managing Your Money
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Footer Text */}
          <p className="mt-8 text-sm text-gray-500">
            Ready to take control of your finances? Let's go! 💚
          </p>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help? <a href="/support" className="text-teal-600 hover:text-teal-700 font-semibold hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}