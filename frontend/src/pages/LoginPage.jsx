import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeRequest, notifyError, notifySuccess } from "../utils/Utils";
import { Toaster } from "react-hot-toast";
import LoadingBar from "../Loadingbar";
const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let response = await makeRequest(
                "https://be0a-103-176-170-30.ngrok-free.app/api/login",
                {},
                "POST",
                {
                    "username": username,
                    "password": password
                },
                {}
            );
            if (response.status === 200) {
                localStorage.setItem("fileManagerJwtToken", response.data.token);
                navigate("/");
            } else {
                notifyError("Login Failed.");
            }
        } catch (error) {
            notifyError(error.message || "Login Failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toaster />
            {loading && <LoadingBar />}
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Enter your username"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="relative w-full mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 top-[25px] flex items-center px-3 text-gray-600 focus:outline-none"
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            xmlns="http://www.w3.org/2000/svg"
                                            d="M2 2L22 22"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            xmlns="http://www.w3.org/2000/svg"
                                            d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            xmlns="http://www.w3.org/2000/svg"
                                            d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12c0 1.38-1.12 2.5-2.5 2.5S10 13.38 10 12s1.12-2.5 2.5-2.5S15 10.62 15 12z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 12c3-4.5 7-7.5 9-7.5s6 3 9 7.5c-3 4.5-7 7.5-9 7.5s-6-3-9-7.5z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className="mb-4">
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-gray-800 text-white font-bold rounded-md hover:bg-gray-600"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
