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
                `${process.env.REACT_APP_BACKEND_API_URL}/api/login`,
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
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your password"
                            />
                            
                           
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
