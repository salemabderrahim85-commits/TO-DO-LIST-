import React, { useState } from 'react';
import { Copy, Check, Clock } from 'lucide-react';
import { formatDisplayNumber, formatExpression } from '../utils/calculatorEngine';

interface CalculatorDisplayProps {
  expression: string;
  currentInput: string;
  hasMemory: boolean;
  onToggleHistory: () => void;
  showHistory: boolean;
  historyCount: number;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  currentInput,
  hasMemory,
  onToggleHistory,
  showHistory,
  historyCount,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = currentInput || '0';
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  // Dynamic font size depending on length of currentInput
  const getFontSizeClass = (text: string) => {
    const len = text.length;
    if (len <= 7) return 'text-4xl sm:text-5xl';
    if (len <= 11) return 'text-3xl sm:text-4xl';
    if (len <= 15) return 'text-2xl sm:text-3xl';
    return 'text-xl sm:text-2xl';
  };

  const formattedDisplay = formatDisplayNumber(currentInput);
  const formattedExpr = formatExpression(expression);

  return (
    <div
      id="calculator-display-container"
      className="w-full bg-slate-100/90 dark:bg-slate-900/90 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-inner flex flex-col justify-between min-h-[150px] relative transition-colors duration-200"
    >
      {/* Top row: Status indicators & History toggle */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          {hasMemory && (
            <span
              id="memory-indicator"
              className="px-2 py-0.5 rounded-md bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold tracking-wider border border-indigo-500/20"
            >
              M
            </span>
          )}
          <span className="text-[11px] uppercase tracking-wider font-mono opacity-60">
            DEG
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Copy Button */}
          <button
            id="btn-copy-result"
            type="button"
            onClick={handleCopy}
            title="Copier le résultat"
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">Copié</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden xs:inline">Copier</span>
              </>
            )}
          </button>

          {/* History Toggle Button */}
          <button
            id="btn-toggle-history"
            type="button"
            onClick={onToggleHistory}
            title="Historique des calculs"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium border transition shadow-xs ${
              showHistory
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px]">Historique</span>
            {historyCount > 0 && (
              <span
                className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  showHistory
                    ? 'bg-white text-indigo-600'
                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300'
                }`}
              >
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Middle row: Expression equation */}
      <div
        id="calculator-expression-display"
        className="w-full text-right overflow-x-auto no-scrollbar py-1 text-slate-500 dark:text-slate-400 text-sm sm:text-base font-mono min-h-[24px] tracking-wide"
      >
        {formattedExpr || '\u00A0'}
      </div>

      {/* Bottom row: Main Input / Result */}
      <div
        id="calculator-main-display"
        className={`w-full text-right overflow-x-auto no-scrollbar font-semibold tracking-tight font-['JetBrains_Mono',monospace] text-slate-900 dark:text-white transition-all duration-150 ${getFontSizeClass(
          formattedDisplay
        )}`}
      >
        {formattedDisplay}
      </div>
    </div>
  );
};
