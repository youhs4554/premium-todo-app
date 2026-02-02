"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckCircle2, Circle, LogOut, Loader2 } from "lucide-react";
import apiClient from "@/lib/api";

interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

export default function Dashboard() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState({ title: "", description: "" });
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const res = await apiClient.get("/todos");
            setTodos(res.data);
        } catch (err) {
            router.push("/auth");
        } finally {
            setLoading(false);
        }
    };

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.title) return;
        setAdding(true);
        try {
            const res = await apiClient.post("/todos", newTodo);
            setTodos([res.data, ...todos]);
            setNewTodo({ title: "", description: "" });
        } catch (err) {
            console.error(err);
        } finally {
            setAdding(false);
        }
    };

    const toggleTodo = async (todo: Todo) => {
        try {
            const res = await apiClient.put(`/todos/${todo.id}`, {
                completed: !todo.completed,
            });
            setTodos(todos.map((t) => (t.id === todo.id ? res.data : t)));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTodo = async (id: number) => {
        try {
            await apiClient.delete(`/todos/${id}`);
            setTodos(todos.filter((t) => t.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/auth");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto space-y-8">
            <header className="flex justify-between items-center bg-white/5 p-6 rounded-2xl glass">
                <div>
                    <h1 className="text-2xl font-bold">My Tasks</h1>
                    <p className="text-gray-400 text-sm">Organize your day</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                >
                    <LogOut size={20} />
                </button>
            </header>

            {todos.length > 0 && (
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass p-6 text-center">
                        <p className="text-gray-400 text-sm">Total Tasks</p>
                        <p className="text-3xl font-bold">{todos.length}</p>
                    </div>
                    <div className="glass p-6 text-center">
                        <p className="text-gray-400 text-sm">Completed</p>
                        <p className="text-3xl font-bold text-green-500">
                            {todos.filter((t) => t.completed).length}
                        </p>
                    </div>
                    <div className="glass p-6 flex flex-col justify-center gap-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="font-bold">
                                {Math.round((todos.filter((t) => t.completed).length / todos.length) * 100)}%
                            </span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${(todos.filter((t) => t.completed).length / todos.length) * 100}%`,
                                }}
                                className="h-full premium-gradient"
                            />
                        </div>
                    </div>
                </section>
            )}

            <section className="glass p-6 space-y-4">
                <form onSubmit={handleAddTodo} className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-4">
                            <input
                                type="text"
                                placeholder="Task title..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newTodo.title}
                                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                            />
                            <textarea
                                placeholder="Add some details..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                                value={newTodo.description}
                                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={adding}
                            className="premium-gradient px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 font-semibold"
                        >
                            {adding ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                            Add Task
                        </button>
                    </div>
                </form>
            </section>

            <section className="space-y-4">
                <AnimatePresence>
                    {todos.map((todo) => (
                        <motion.div
                            key={todo.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass p-4 flex items-start gap-4 group hover:border-white/20 transition-colors"
                        >
                            <button
                                onClick={() => toggleTodo(todo)}
                                className={`mt-1 transition-colors ${todo.completed ? "text-green-500" : "text-gray-500 hover:text-white"
                                    }`}
                            >
                                {todo.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            </button>
                            <div className="flex-1 space-y-1">
                                <h3 className={`font-semibold text-lg ${todo.completed ? "line-through text-gray-500" : ""}`}>
                                    {todo.title}
                                </h3>
                                {todo.description && (
                                    <p className={`text-sm ${todo.completed ? "text-gray-600" : "text-gray-400"}`}>
                                        {todo.description}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 transition-all"
                            >
                                <Trash2 size={20} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {todos.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No tasks found. Start by adding one above!
                    </div>
                )}
            </section>
        </div>
    );
}
