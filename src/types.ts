export type Priority = 'low' | 'medium' | 'high';

export type Category = 'personal' | 'work' | 'shopping' | 'health' | 'education' | 'other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  priority: Priority;
  category: Category;
}

export type FilterStatus = 'all' | 'active' | 'completed';

export type SortBy = 'date_asc' | 'date_desc' | 'priority' | 'alphabetical';
