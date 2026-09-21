/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, CheckCircle, ListTodo, Sparkles, FilterX } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Task, FilterStatus, Category, SortBy } from './types';
import { loadTasksFromStorage, saveTasksToStorage } from './utils/storage';
import { playSuccessSound, playTapSound, triggerHaptic } from './utils/soundAndHaptics';
import { AndroidFrame } from './components/AndroidFrame';
import { TaskItem } from './components/TaskItem';
import { TaskModal } from './components/TaskModal';
import { TaskFilters } from './components/TaskFilters';
import { TaskStats } from './components/TaskStats';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date_asc');

  // App Settings
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('android_todo_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('android_todo_sound');
      return saved !== 'false';
    }
    return true;
  });

  // Sync dark mode class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('android_todo_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('android_todo_theme', 'light');
    }
  }, [darkMode]);

  // Sync sound setting
  useEffect(() => {
    localStorage.setItem('android_todo_sound', String(soundEnabled));
  }, [soundEnabled]);

  // Save tasks on change
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Action: Add or Edit Task
  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'> & { id?: string }
  ) => {
    if (soundEnabled) playTapSound();
    triggerHaptic(20);

    if (taskData.id) {
      // Edit existing task
      setTasks((prev) =>
        prev.map((t) => (t.id === taskData.id ? { ...t, ...taskData } : t))
      );
    } else {
      // Add new task
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: taskData.title,
        description: taskData.description,
        completed: false,
        createdAt: Date.now(),
        dueDate: taskData.dueDate,
        dueTime: taskData.dueTime,
        priority: taskData.priority,
        category: taskData.category,
      };
      setTasks((prev) => [newTask, ...prev]);
    }
    setEditingTask(null);
  };

  // Action: Toggle Complete
  const handleToggleTask = (id: string) => {
    triggerHaptic(15);

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted && soundEnabled) {
            playSuccessSound();
          } else if (soundEnabled) {
            playTapSound();
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? Date.now() : undefined,
          };
        }
        return t;
      })
    );
  };

  // Action: Delete Task
  const handleDeleteTask = (id: string) => {
    if (soundEnabled) playTapSound();
    triggerHaptic(25);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Action: Open Modal for Edit
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Action: Clear Completed Tasks
  const handleClearCompleted = () => {
    if (soundEnabled) playTapSound();
    triggerHaptic(30);
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  // Action: Mark All as Completed
  const handleCompleteAll = () => {
    if (soundEnabled) playSuccessSound();
    triggerHaptic(30);
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        completed: true,
        completedAt: t.completedAt || Date.now(),
      }))
    );
  };

  // Counts for tabs
  const counts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    return { all: total, active, completed };
  }, [tasks]);

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (statusFilter === 'active' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;

        // Category filter
        if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(query);
          const matchDesc = task.description?.toLowerCase().includes(query) ?? false;
          if (!matchTitle && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Keep active tasks first unless sorting alphabetically
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        if (sortBy === 'priority') {
          const priorityScore: Record<string, number> = { high: 3, medium: 2, low: 1 };
          return priorityScore[b.priority] - priorityScore[a.priority];
        }

        if (sortBy === 'date_asc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }

        if (sortBy === 'date_desc') {
          return b.createdAt - a.createdAt;
        }

        if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title);
        }

        return 0;
      });
  }, [tasks, statusFilter, categoryFilter, searchQuery, sortBy]);

  return (
    <AndroidFrame
      darkMode={darkMode}
      onToggleDarkMode={() => setDarkMode(!darkMode)}
      soundEnabled={soundEnabled}
      onToggleSound={() => setSoundEnabled(!soundEnabled)}
      onOpenNewTaskModal={() => {
        setEditingTask(null);
        setIsModalOpen(true);
      }}
    >
      <div className="flex-1 flex flex-col p-4 sm:p-5 relative min-h-full">
        {/* Android Material App Bar Header */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>To-Do List</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
                  Android
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {counts.active} tâche{counts.active > 1 ? 's' : ''} en attente
              </p>
            </div>
          </div>

          <button
            id="btn-header-add-task"
            type="button"
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="flex sm:hidden p-2 rounded-xl bg-indigo-600 text-white shadow-xs"
            title="Ajouter une tâche"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stats Card */}
        <div className="mb-4">
          <TaskStats
            total={counts.all}
            completed={counts.completed}
            onClearCompleted={handleClearCompleted}
            onCompleteAll={handleCompleteAll}
          />
        </div>

        {/* Filters & Search */}
        <div className="mb-4">
          <TaskFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            counts={counts}
          />
        </div>

        {/* Task List */}
        <div className="flex-1 space-y-2.5 pb-20">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteTask}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 px-4 text-center rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center"
              >
                {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' ? (
                  <>
                    <FilterX className="w-10 h-10 text-slate-400 mb-2" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Aucune tâche ne correspond à vos filtres
                    </p>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Essayez de réinitialiser la recherche ou de changer les catégories.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setCategoryFilter('all');
                      }}
                      className="mt-3 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-300 transition"
                    >
                      Effacer les filtres
                    </button>
                  </>
                ) : counts.all > 0 && counts.completed === counts.all ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Toutes les tâches sont terminées !
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Profitez de votre journée ou ajoutez de nouveaux objectifs.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Aucune tâche pour le moment
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Commencez en appuyant sur le bouton d'ajout ci-dessous.
                    </p>
                    <button
                      id="btn-empty-add-task"
                      type="button"
                      onClick={() => {
                        setEditingTask(null);
                        setIsModalOpen(true);
                      }}
                      className="mt-3.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-medium shadow-sm hover:bg-indigo-700 transition flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter une première tâche</span>
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Material 3 Floating Action Button (FAB) */}
        <motion.button
          id="btn-fab-add-task"
          type="button"
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Ajouter une nouvelle tâche"
          className="fixed sm:absolute bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 border border-indigo-400/20 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </motion.button>
      </div>

      {/* Task Creation & Editing Bottom Sheet Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />
    </AndroidFrame>
  );
}
