import { useState, useEffect } from "react";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Task Manager - CI/CD Monorepo" },
    { name: "description", content: "Sample Task App for CI/CD Testing" },
  ];
}

interface Task {
  id: number;
  title: string;
  is_completed: boolean;
  created_at?: string;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Setup GitHub Actions CI/CD", is_completed: true },
    { id: 2, title: "Configure Monorepo Path Filtering", is_completed: false },
    { id: 3, title: "Run Automated Tests on PR", is_completed: false },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/tasks`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Task[] | null) => {
        if (data && Array.isArray(data)) {
          setTasks(data);
        }
      })
      .catch(() => {
        // Fallback to local default state if backend is offline
      });
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      if (res.ok) {
        const created: Task = await res.json();
        setTasks((prev) => [created, ...prev]);
      } else {
        const mockTask: Task = {
          id: Date.now(),
          title: newTitle,
          is_completed: false,
        };
        setTasks((prev) => [mockTask, ...prev]);
      }
      setNewTitle("");
    } catch {
      const mockTask: Task = {
        id: Date.now(),
        title: newTitle,
        is_completed: false,
      };
      setTasks((prev) => [mockTask, ...prev]);
      setNewTitle("");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (task: Task) => {
    const updatedStatus = !task.is_completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, is_completed: updatedStatus } : t))
    );

    try {
      await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: updatedStatus }),
      });
    } catch {
      // Silently keep local update
    }
  };

  const handleDeleteTask = async (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
    } catch {
      // Silently keep local update
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-semibold mb-3">
            <span>●</span> CI/CD Monorepo Pipeline Ready
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Task Tracker</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Frontend: React Router v7 | Backend: Laravel 12 API
          </p>
        </header>

        <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Tambah tugas baru..."
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !newTitle.trim()}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition"
          >
            {loading ? "Menambahkan..." : "Tambah"}
          </button>
        </form>

        <div className="bg-slate-800 border border-slate-700 rounded-xl divide-y divide-slate-700/60 shadow-lg overflow-hidden">
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Belum ada task. Tambahkan task pertamamu!
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 hover:bg-slate-700/50 transition"
              >
                <label className="flex items-center gap-3 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={task.is_completed}
                    onChange={() => handleToggleTask(task)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-600 focus:ring-0"
                  />
                  <span
                    className={`text-sm ${
                      task.is_completed
                        ? "line-through text-slate-500"
                        : "text-slate-200"
                    }`}
                  >
                    {task.title}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 hover:bg-rose-950/40 rounded transition"
                >
                  Hapus
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 p-4 bg-slate-800/60 border border-slate-700/60 rounded-lg text-xs text-slate-400 flex justify-between">
          <span>Total: {tasks.length}</span>
          <span>Selesai: {tasks.filter((t) => t.is_completed).length}</span>
        </div>
      </div>
    </main>
  );
}
