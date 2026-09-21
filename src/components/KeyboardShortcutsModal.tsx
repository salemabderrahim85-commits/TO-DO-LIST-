import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '0 - 9', desc: 'Chiffres' },
    { key: '+, -, *, /', desc: 'Opérateurs arithmétiques' },
    { key: 'Enter ou =', desc: 'Calculer le résultat' },
    { key: 'Backspace', desc: 'Effacer le dernier caractère' },
    { key: 'Escape (Échap)', desc: 'Tout effacer (AC)' },
    { key: '%', desc: 'Pourcentage' },
    { key: '( et )', desc: 'Parenthèses' },
    { key: '.', desc: 'Point décimal' },
  ];

  return (
    <AnimatePresence>
      <div
        id="shortcuts-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        onClick={onClose}
      >
        <motion.div
          id="shortcuts-modal-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Keyboard className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Raccourcis Clavier
              </h3>
            </div>
            <button
              id="btn-close-shortcuts"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-2 text-xs">
            {shortcuts.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <span className="text-slate-600 dark:text-slate-300">{s.desc}</span>
                <kbd className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono text-slate-800 dark:text-slate-200 shadow-2xs font-semibold">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>

          <button
            id="btn-dismiss-shortcuts"
            type="button"
            onClick={onClose}
            className="w-full mt-4 py-2 rounded-xl bg-indigo-600 text-white font-medium text-xs hover:bg-indigo-700 transition"
          >
            Compris
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
