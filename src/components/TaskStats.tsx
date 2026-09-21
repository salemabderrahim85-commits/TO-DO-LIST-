import React from 'react';
import { CheckCircle2, Sparkles, Trash2, CheckCheck } from 'lucide-react';

interface TaskStatsProps {
  total: number;
  completed: number;
  onClearCompleted: () => void;
  onCompleteAll: () => void;
}

export const TaskStats: React.FC<TaskStatsProps> = ({
  total,
  completed,
  onClearCompleted,
  onCompleteAll,
}) => {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isAllDone = total > 0 && completed === total;

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-500/20 dark:via-purple-500/10 p-4 rounded-2xl border border-indigo-500/20 dark:border-indigo-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/30">
            {isAllDone ? (
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {completed}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                sur {total} tâches terminées
              </span>
            </div>
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              {isAllDone
                ? 'Bravo ! Toutes les tâches sont complétées 🎉'
                : `${percent}% de votre objectif accompli`}
            </p>
          </div>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-1.5">
          {total > completed && (
            <button
              id="btn-complete-all"
              type="button"
              onClick={onCompleteAll}
              title="Tout marquer comme terminé"
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}

          {completed > 0 && (
            <button
              id="btn-clear-completed"
              type="button"
              onClick={onClearCompleted}
              title="Supprimer les tâches terminées"
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800 transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 w-full bg-slate-200/80 dark:bg-slate-700/60 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${
            isAllDone
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
              : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
