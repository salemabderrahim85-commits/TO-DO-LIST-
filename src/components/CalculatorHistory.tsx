import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, X, ArrowUpRight } from 'lucide-react';
import { CalculationHistoryItem } from '../types';
import { formatDisplayNumber, formatExpression } from '../utils/calculatorEngine';

interface CalculatorHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: CalculationHistoryItem[];
  onSelectHistory: (item: CalculationHistoryItem) => void;
  onClearHistory: () => void;
}

export const CalculatorHistory: React.FC<CalculatorHistoryProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="calculator-history-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-30 bg-black/50 backdrop-blur-xs rounded-3xl flex flex-col justify-end sm:justify-start"
        onClick={onClose}
      >
        <motion.div
          id="calculator-history-panel"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full h-3/4 sm:h-full bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                Historique des calculs
              </h3>
              <p className="text-xs text-slate-500">
                {history.length} calcul{history.length > 1 ? 's' : ''} enregistré{history.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {history.length > 0 && (
                <button
                  id="btn-clear-history"
                  type="button"
                  onClick={onClearHistory}
                  title="Effacer tout l'historique"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                id="btn-close-history"
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List of calculations */}
          <div className="flex-1 overflow-y-auto py-3 space-y-2 no-scrollbar">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <p className="text-sm font-medium">Aucun calcul récent</p>
                <p className="text-xs mt-1 text-slate-500">
                  Vos opérations apparaîtront ici au fur et à mesure.
                </p>
              </div>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectHistory(item)}
                  className="w-full text-right p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/70 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-600 transition group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="opacity-0 group-hover:opacity-100 text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-medium transition-opacity">
                      <span>Utiliser</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                    <span className="font-mono">{formatExpression(item.expression)} =</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {formatDisplayNumber(item.result)}
                  </div>
                </button>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
