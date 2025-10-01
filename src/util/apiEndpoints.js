//export const BASE_URL = "http://localhost:8080/api/v1.0";

//export const BASE_URL = "https://cash-control-api.onrender.com/api/v1.0"; // Notification at Night First Time // My Own Githb

export const BASE_URL = "https://cash-control-final-api.onrender.com/api/v1.0";  // Second Time Notification at Night noor04;  using Gamail


const CLOUDINARY_CLOUD_NAME = "dseibtclb";

export const API_ENDPOINTS = {
    LOGIN: "/login",
    REGISTER: "/register",
    GET_USER_INFO: "/profile",
    GET_ALL_CATEGORIES: "/categories",
    ADD_CATEGORY: "/categories",
    UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
    GET_ALL_INCOMES: "/incomes",
    CATEGORY_BY_TYPE: (type) => `/categories/${type}`,
    ADD_INCOME: "/incomes",
    DELETE_INCOME: (incomeId) => `/incomes/${incomeId}`,
    INCOME_EXCEL_DOWNLOAD: "excel/download/income",
    EMAIL_INCOME: "/email/income-excel",
    GET_ALL_EXPENSE: "/expenses",
    ADD_EXPENSE: "/expenses",
    DELETE_EXPENSE: (expenseId) => `/expenses/${expenseId}`,
    EXPENSE_EXCEL_DOWNLOAD: "excel/download/expense",
    EMAIL_EXPENSE: "/email/expense-excel",
    APPLY_FILTERS: "/filter",
    DASHBOARD_DATA: "/dashboard",
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    // FORGET_PASSWORD: "/forgot-password",
    // RESET_PASSWORD: "/reset-password"
    FORGET_PASSWORD: `${BASE_URL}/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/reset-password`,
    UPDATE_NAME:   `/profile/name`,
    UPDATE_IMAGE: `/profile/image`,
}



//`https://cash-control-final-api.onrender.com/api/v1.0/resend-activation?email=${encodeURIComponent(email)}`