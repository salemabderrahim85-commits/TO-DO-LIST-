import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Tag, Flag, AlertCircle, Check } from 'lucide-react';
import { Task, Priority, Category } from '../types';
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from '../utils/constants';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'> & { id?: string }) => void;
  editingTask: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('personal');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setDueDate(editingTask.dueDate || '');
      setDueTime(editingTask.dueTime || '');
      setPriority(editingTask.priority);
      setCategory(editingTask.category);
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setDueTime('');
      setPriority('medium');
      setCategory('personal');
    }
    setError('');
  }, [editingTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Veuillez saisir un titre pour la tâche');
      return;
    }

    onSave({
      ...(editingTask ? { id: editingTask.id } : {}),
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      priority,
      category,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="task-modal-backdrop"
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      >
        <motion.div
          id="task-modal-sheet"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
        >
          {/* Material Handle for mobile */}
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {editingTask
                  ? 'Modifiez les détails de votre tâche'
                  : 'Remplissez les détails pour planifier votre tâche'}
              </p>
            </div>
            <button
              id="btn-close-modal"
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Titre de la tâche *
              </label>
              <input
                id="task-input-title"
                type="text"
                autoFocus
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Ex : Réunion d'équipe, Acheter du lait..."
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                  error
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                } text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 transition`}
              />
              {error && (
                <div className="flex items-center gap-1.5 text-xs text-rose-500 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Description / Notes (Optionnel)
              </label>
              <textarea
                id="task-input-description"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Détails supplémentaires, liens, étapes..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
              />
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                Catégorie
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(Object.keys(CATEGORY_CONFIG) as Category[]).map((catKey) => {
                  const cfg = CATEGORY_CONFIG[catKey];
                  const isSelected = category === catKey;
                  return (
                    <button
                      key={catKey}
                      id={`category-select-${catKey}`}
                      type="button"
                      onClick={() => setCategory(catKey)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-medium transition ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className="truncate">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-amber-500" />
                Priorité
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((pKey) => {
                  const pCfg = PRIORITY_CONFIG[pKey];
                  const isSelected = priority === pKey;
                  return (
                    <button
                      key={pKey}
                      id={`priority-select-${pKey}`}
                      type="button"
                      onClick={() => setPriority(pKey)}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-xs font-semibold'
                          : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${pCfg.colorDot}`} />
                      <span>{pCfg.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Date d'échéance
                </label>
                <input
                  id="task-input-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Heure (Optionnel)
                </label>
                <input
                  id="task-input-time"
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                id="btn-cancel-task"
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Annuler
              </button>
              <button
                id="btn-submit-task"
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-sm font-medium shadow-md shadow-indigo-500/20 transition flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{editingTask ? 'Mettre à jour' : 'Ajouter la tâche'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
