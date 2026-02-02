"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckCircle2, Circle, LogOut, Loader2, LayoutDashboard, ListTodo, Search } from "lucide-react";
import apiClient from "@/lib/api";

interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

type ViewMode = "dashboard" | "add" | "list";

export default function Dashboard() {
    const [view, setView] = useState<ViewMode>("dashboard");
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState({ title: "", description: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const res = await apiClient.get("/todos");
                setTodos(res.data);
            } catch {
                router.push("/auth");
            } finally {
                setLoading(false);
            }
        };
        fetchTodos();
    }, [router]);

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.title) return;
        setAdding(true);
        try {
            const res = await apiClient.post("/todos", newTodo);
            setTodos([res.data, ...todos]);
            setNewTodo({ title: "", description: "" });
            setView("list"); // Redirect to list after adding
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

    const filteredTodos = todos.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-24">
            <header className="flex justify-between items-center bg-white/5 p-6 rounded-2xl glass">
                <div>
                    <h1 className="text-2xl font-bold">
                        {view === "dashboard" && "Dashboard"}
                        {view === "add" && "Add New Task"}
                        {view === "list" && "Tasks List"}
                    </h1>
                    <p className="text-gray-400 text-sm">Organize your day with precision</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                >
                    <LogOut size={20} />
                </button>
            </header>

            {/* Navigation Tabs */}
            <nav className="flex gap-2 p-1.5 bg-white/5 rounded-2xl glass w-fit">
                <button
                    onClick={() => setView("dashboard")}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${view === "dashboard" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
                        }`}
                >
                    <LayoutDashboard size={20} />
                    <span className="font-semibold">Overview</span>
                </button>
                <button
                    onClick={() => setView("add")}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${view === "add" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
                        }`}
                >
                    <Plus size={20} />
                    <span className="font-semibold">Add</span>
                </button>
                <button
                    onClick={() => setView("list")}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${view === "list" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
                        }`}
                >
                    <ListTodo size={20} />
                    <span className="font-semibold">List</span>
                </button>
            </nav>

            <AnimatePresence mode="wait">
                {view === "dashboard" && (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        {todos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="glass p-8 text-center space-y-2">
                                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Tasks</p>
                                    <p className="text-5xl font-extrabold">{todos.length}</p>
                                </div>
                                <div className="glass p-8 text-center space-y-2">
                                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Completed</p>
                                    <p className="text-5xl font-extrabold text-green-500">
                                        {todos.filter((t) => t.completed).length}
                                    </p>
                                </div>
                                <div className="glass p-8 flex flex-col justify-center gap-4">
                                    <div className="flex justify-between items-end">
                                        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Progress</p>
                                        <span className="text-2xl font-bold">
                                            {Math.round((todos.filter((t) => t.completed).length / todos.length) * 100)}%
                                        </span>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${(todos.filter((t) => t.completed).length / todos.length) * 100}%`,
                                            }}
                                            className="h-full premium-gradient shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="glass p-12 text-center text-gray-500 rounded-3xl">
                                <p className="text-lg">No statistics to show yet.</p>
                                <p className="text-sm">Go to the Add tab to create your first task!</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {view === "add" && (
                    <motion.div
                        key="add"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass p-8"
                    >
                        <form onSubmit={handleAddTodo} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 ml-1">Task Title</label>
                                    <input
                                        type="text"
                                        placeholder="What needs to be done?"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                                        value={newTodo.title}
                                        onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 ml-1">Description (Optional)</label>
                                    <textarea
                                        placeholder="Add more details about this task..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px] resize-none transition-all"
                                        value={newTodo.description}
                                        onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={adding}
                                className="w-full premium-gradient p-4 rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3 font-bold text-lg shadow-lg"
                            >
                                {adding ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} />}
                                Add New Task
                            </button>
                        </form>
                    </motion.div>
                )}

                {view === "list" && (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Search Bar */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search tasks by title or description..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence initial={false}>
                                {filteredTodos.map((todo) => (
                                    <motion.div
                                        key={todo.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="glass p-5 flex items-start gap-4 group hover:border-white/20 transition-all hover:bg-white/[0.02]"
                                    >
                                        <button
                                            onClick={() => toggleTodo(todo)}
                                            className={`mt-1 transition-all hover:scale-110 active:scale-90 ${todo.completed ? "text-green-500" : "text-gray-500 hover:text-white"
                                                }`}
                                        >
                                            {todo.completed ? <CheckCircle2 size={26} /> : <Circle size={26} />}
                                        </button>
                                        <div className="flex-1 space-y-1">
                                            <h3 className={`font-bold text-lg transition-all ${todo.completed ? "line-through text-gray-500 opacity-60" : ""}`}>
                                                {todo.title}
                                            </h3>
                                            {todo.description && (
                                                <p className={`text-sm leading-relaxed transition-all ${todo.completed ? "text-gray-600 opacity-40" : "text-gray-400"}`}>
                                                    {todo.description}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => deleteTodo(todo.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {filteredTodos.length === 0 && (
                                <div className="text-center py-20 glass rounded-3xl border-dashed border-2 border-white/5">
                                    <div className="text-gray-500 space-y-2">
                                        <p className="text-xl font-medium">No matches found</p>
                                        <p className="text-sm">Try adjusting your search query or add a new task.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

