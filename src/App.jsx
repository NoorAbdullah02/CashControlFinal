import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Income from "./pages/Income.jsx";
import Expense from "./pages/Expense.jsx";
import Category from "./pages/Category.jsx";
import Filter from "./pages/Filter.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage.jsx";
import VapiAI from "./pages/VapiAI.jsx";
import BrickBreaker from "./pages/BrickBreaker.jsx";
import CarRacingGame from "./pages/CarRacing.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import UpdateName from "./pages/UpdateName.jsx";
import UpdateProfileImage from "./pages/UpdateProfileImage.jsx";
import EmailVerification from "./pages/EmailVerification.jsx";


const App = () => {
    return (
        <>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Root />} />
                    <Route path="/home" element={<LandingPage />} />
                    <Route path="/dashboard" element={<Home />} />
                    <Route path="/income" element={<Income />} />
                    <Route path="/expense" element={<Expense />} />
                    <Route path="/category" element={<Category />} />
                    <Route path="/filter" element={<Filter />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/vapi-ai" element={<VapiAI />} />
                    <Route path="/brick-breaker" element={<BrickBreaker />} />
                    <Route path="/car-racing" element={<CarRacingGame />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/update-name" element={<UpdateName/>}/>
                    <Route path="/update-profile-image" element={<UpdateProfileImage/>}/>
                    <Route path="/email-verification" element={<EmailVerification />} />

                </Routes>
            </BrowserRouter>
        </>
    );
}

const Root = () => {
    const isAuthenticated = !!localStorage.getItem("token");
    return isAuthenticated ? (
        <Navigate to="/dashboard" />
    ) : (
        <Navigate to="/home" />
    );
}

export default App;