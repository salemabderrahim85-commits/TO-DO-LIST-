import React from 'react';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';
import { FilterStatus, Category, SortBy } from '../types';
import { CATEGORY_CONFIG } from '../utils/constants';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  categoryFilter: Category | 'all';
  onCategoryChange: (cat: Category | 'all') => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
  counts,
}) => {
  return (
    <div className="space-y-3">
      {/* Android Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          id="search-tasks-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher une tâche..."
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition shadow-inner"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Material 3 Segmented Status Tabs */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/50">
        <button
          id="filter-status-all"
          type="button"
          onClick={() => onStatusChange('all')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            statusFilter === 'all'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <span>Toutes</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              statusFilter === 'all'
                ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                : 'bg-slate-200 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400'
            }`}
          >
            {counts.all}
          </span>
        </button>

        <button
          id="filter-status-active"
          type="button"
          onClick={() => onStatusChange('active')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            statusFilter === 'active'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <span>En cours</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              statusFilter === 'active'
                ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                : 'bg-slate-200 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400'
            }`}
          >
            {counts.active}
          </span>
        </button>

        <button
          id="filter-status-completed"
          type="button"
          onClick={() => onStatusChange('completed')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            statusFilter === 'completed'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <span>Terminées</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              statusFilter === 'completed'
                ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-200 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400'
            }`}
          >
            {counts.completed}
          </span>
        </button>
      </div>

      {/* Horizontal scrollable Category & Sort controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          id="category-filter-all"
          type="button"
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1 rounded-full whitespace-nowrap border transition ${
            categoryFilter === 'all'
              ? 'bg-indigo-600 text-white border-indigo-600 font-medium shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          Tous les dossiers
        </button>

        {(Object.keys(CATEGORY_CONFIG) as Category[]).map((catKey) => {
          const cfg = CATEGORY_CONFIG[catKey];
          const isSelected = categoryFilter === catKey;
          return (
            <button
              key={catKey}
              id={`category-filter-${catKey}`}
              type="button"
              onClick={() => onCategoryChange(catKey)}
              className={`px-3 py-1 rounded-full whitespace-nowrap border transition ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 font-medium shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cfg.label}
            </button>
          );
        })}

        {/* Sort selector */}
        <div className="ml-auto flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-700">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            id="sort-tasks-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
            className="bg-transparent text-xs text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer pr-1"
          >
            <option value="date_asc" className="dark:bg-slate-800">Date d'échéance</option>
            <option value="priority" className="dark:bg-slate-800">Priorité (Haute)</option>
            <option value="date_desc" className="dark:bg-slate-800">Plus récentes</option>
            <option value="alphabetical" className="dark:bg-slate-800">Nom (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
