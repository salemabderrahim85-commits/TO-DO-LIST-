import { Task } from '../types';

const STORAGE_KEY = 'android_todo_tasks_v1';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Finaliser la présentation du projet',
    description: 'Relire les diapositives et préparer les réponses aux questions.',
    completed: false,
    createdAt: Date.now() - 3600000 * 24,
    dueDate: new Date(Date.now() + 3600000 * 24).toISOString().split('T')[0],
    dueTime: '14:30',
    priority: 'high',
    category: 'work',
  },
  {
    id: 'task-2',
    title: 'Faire les courses de la semaine',
    description: 'Fruits, légumes, café en grains et pain complet.',
    completed: true,
    createdAt: Date.now() - 3600000 * 48,
    completedAt: Date.now() - 3600000 * 5,
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    category: 'shopping',
  },
  {
    id: 'task-3',
    title: 'Séance de sport (Cardio & Gainage)',
    description: '30 minutes de course puis étirements.',
    completed: false,
    createdAt: Date.now() - 3600000 * 12,
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '18:00',
    priority: 'medium',
    category: 'health',
  },
  {
    id: 'task-4',
    title: 'Appeler le garagiste pour la révision',
    completed: false,
    createdAt: Date.now() - 3600000 * 6,
    priority: 'low',
    category: 'personal',
  },
  {
    id: 'task-5',
    title: 'Lire 20 pages du livre de JavaScript',
    description: 'Chapitre sur les Promises et Async/Await.',
    completed: true,
    createdAt: Date.now() - 3600000 * 72,
    completedAt: Date.now() - 3600000 * 20,
    priority: 'low',
    category: 'education',
  },
];

export function loadTasksFromStorage(): Task[] {
  if (typeof window === 'undefined') return INITIAL_TASKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveTasksToStorage(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_TASKS;
  } catch (err) {
    console.error('Erreur lors du chargement des tâches depuis le stockage', err);
    return INITIAL_TASKS;
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Erreur lors de la sauvegarde des tâches', err);
  }
}
