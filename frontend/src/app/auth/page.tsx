"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Loader2 } from "lucide-react";
import apiClient from "@/lib/api";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        full_name: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isLogin) {
                const res = await apiClient.post("/auth/login", {
                    email: formData.email,
                    password: formData.password,
                });
                localStorage.setItem("token", res.data.access_token);
                router.push("/dashboard");
            } else {
                await apiClient.post("/auth/register", formData);
                setIsLogin(true);
                setError("Account created! Please login.");
            }
        } catch (err: unknown) {
            let errorMessage = "Something went wrong";
            if (err && typeof err === "object" && "response" in err) {
                const response = (err as { response?: { data?: { detail?: string } } }).response;
                errorMessage = response?.data?.detail || errorMessage;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass w-full max-w-md p-8 space-y-6"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="text-gray-400">
                        {isLogin ? "Login to manage your tasks" : "Sign up to get started"}
                    </p>
                </div>

                {error && (
                    <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>
                    )}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full premium-gradient text-white rounded-lg p-3 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : isLogin ? (
                            <>
                                <LogIn size={20} /> Login
                            </>
                        ) : (
                            <>
                                <UserPlus size={20} /> Sign Up
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-blue-400 hover:underline"
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
