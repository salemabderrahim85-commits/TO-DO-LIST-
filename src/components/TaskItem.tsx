import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Briefcase,
  User,
  ShoppingCart,
  HeartPulse,
  GraduationCap,
  Tag as TagIcon,
} from 'lucide-react';
import { Task, Category } from '../types';
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from '../utils/constants';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const categoryCfg = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.other;
  const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  // Format date helper
  const getDueInfo = () => {
    if (!task.dueDate) return null;
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const isOverdue = !task.completed && task.dueDate < today;

    let dateText = task.dueDate;
    if (task.dueDate === today) {
      dateText = "Aujourd'hui";
    } else if (task.dueDate === tomorrow) {
      dateText = 'Demain';
    } else {
      const [year, month, day] = task.dueDate.split('-');
      dateText = `${day}/${month}/${year}`;
    }

    return {
      text: dateText,
      isOverdue,
    };
  };

  const dueInfo = getDueInfo();

  const renderCategoryIcon = (category: Category) => {
    const iconClass = 'w-3 h-3';
    switch (category) {
      case 'work':
        return <Briefcase className={iconClass} />;
      case 'personal':
        return <User className={iconClass} />;
      case 'shopping':
        return <ShoppingCart className={iconClass} />;
      case 'health':
        return <HeartPulse className={iconClass} />;
      case 'education':
        return <GraduationCap className={iconClass} />;
      default:
        return <TagIcon className={iconClass} />;
    }
  };

  return (
    <motion.div
      id={`task-item-${task.id}`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden ${
        task.completed
          ? 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-75'
          : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md dark:shadow-none'
      }`}
    >
      <div className="p-3.5 sm:p-4">
        <div className="flex items-start gap-3">
          {/* Circular Android Checkbox */}
          <button
            id={`checkbox-task-${task.id}`}
            type="button"
            onClick={() => onToggle(task.id)}
            aria-label={task.completed ? 'Marquer comme non terminée' : 'Marquer comme terminée'}
            className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
              task.completed
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs shadow-emerald-500/30'
                : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 bg-transparent'
            }`}
          >
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </motion.div>
            )}
          </button>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4
                onClick={() => onToggle(task.id)}
                className={`text-sm sm:text-base font-medium cursor-pointer select-none transition-all truncate ${
                  task.completed
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                {task.title}
              </h4>

              {/* Action buttons (Modifier, Supprimer) */}
              <div className="flex items-center gap-1 opacity-90 sm:opacity-75 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  id={`btn-edit-task-${task.id}`}
                  type="button"
                  title="Modifier la tâche"
                  onClick={() => onEdit(task)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700/80 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  id={`btn-delete-task-${task.id}`}
                  type="button"
                  title="Supprimer la tâche"
                  onClick={() => setShowConfirmDelete(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Badges / Metadata row */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {/* Category Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${categoryCfg.bgLight} ${categoryCfg.textLight} dark:${categoryCfg.bgDark} dark:${categoryCfg.textDark}`}
              >
                {renderCategoryIcon(task.category)}
                <span>{categoryCfg.label}</span>
              </span>

              {/* Priority Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${priorityCfg.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${priorityCfg.colorDot}`} />
                <span>{priorityCfg.label}</span>
              </span>

              {/* Due Date & Time Badge */}
              {dueInfo && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                    dueInfo.isOverdue
                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {dueInfo.isOverdue ? (
                    <AlertTriangle className="w-3 h-3 text-rose-500" />
                  ) : (
                    <Calendar className="w-3 h-3 text-slate-400" />
                  )}
                  <span>{dueInfo.text}</span>
                  {task.dueTime && (
                    <>
                      <Clock className="w-2.5 h-2.5 ml-0.5 text-slate-400" />
                      <span>{task.dueTime}</span>
                    </>
                  )}
                </span>
              )}

              {/* Description preview toggle if description exists */}
              {task.description && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-auto text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-0.5 py-0.5 px-1 rounded transition"
                >
                  <span>{isExpanded ? 'Moins' : 'Détails'}</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>

            {/* Expandable Description */}
            {task.description && isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/40 p-2 rounded-lg"
              >
                {task.description}
              </motion.div>
            )}
          </div>
        </div>

        {/* Delete confirmation bar */}
        {showConfirmDelete && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 pt-2.5 border-t border-rose-100 dark:border-rose-900/50 flex items-center justify-between gap-2 bg-rose-50/70 dark:bg-rose-950/30 p-2 rounded-xl text-xs"
          >
            <span className="text-rose-700 dark:text-rose-300 font-medium">
              Supprimer cette tâche ?
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-50 transition"
              >
                Annuler
              </button>
              <button
                id={`btn-confirm-delete-${task.id}`}
                type="button"
                onClick={() => onDelete(task.id)}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-xs transition"
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
