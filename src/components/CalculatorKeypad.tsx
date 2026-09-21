import React from 'react';
import { Delete, Divide, X as Multiply, Minus, Plus, Equal, Percent, Sparkles } from 'lucide-react';
import { MemoryState } from '../types';

interface CalculatorKeypadProps {
  onDigit: (digit: string) => void;
  onDecimal: () => void;
  onOperator: (op: '+' | '-' | '*' | '/') => void;
  onEqual: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
  onSquare: () => void;
  onSquareRoot: () => void;
  onReciprocal: () => void;
  onParenthesis: (p: '(' | ')') => void;
  onMemoryAction: (action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => void;
  memory: MemoryState;
  showExtended: boolean;
  onToggleExtended: () => void;
}

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  onDigit,
  onDecimal,
  onOperator,
  onEqual,
  onClear,
  onBackspace,
  onToggleSign,
  onPercentage,
  onSquare,
  onSquareRoot,
  onReciprocal,
  onParenthesis,
  onMemoryAction,
  memory,
  showExtended,
  onToggleExtended,
}) => {
  return (
    <div className="w-full flex flex-col gap-2.5 sm:gap-3 select-none">
      {/* Memory bar */}
      <div className="grid grid-cols-5 gap-1.5 px-0.5">
        {(['MC', 'MR', 'M+', 'M-', 'MS'] as const).map((mKey) => {
          const isDisabled = (mKey === 'MC' || mKey === 'MR') && !memory.hasValue;
          return (
            <button
              key={mKey}
              id={`btn-mem-${mKey.toLowerCase()}`}
              type="button"
              disabled={isDisabled}
              onClick={() => onMemoryAction(mKey)}
              className={`py-1.5 rounded-xl text-xs font-semibold tracking-wider transition active:scale-95 ${
                isDisabled
                  ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {mKey}
            </button>
          );
        })}
      </div>

      {/* Extended functions bar toggleable */}
      {showExtended && (
        <div className="grid grid-cols-5 gap-2 px-0.5 pt-1 border-t border-slate-100 dark:border-slate-800/80 animate-fadeIn">
          <button
            id="btn-func-paren-open"
            type="button"
            onClick={() => onParenthesis('(')}
            className="py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition active:scale-95"
          >
            (
          </button>
          <button
            id="btn-func-paren-close"
            type="button"
            onClick={() => onParenthesis(')')}
            className="py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition active:scale-95"
          >
            )
          </button>
          <button
            id="btn-func-sqrt"
            type="button"
            onClick={onSquareRoot}
            className="py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition active:scale-95"
          >
            √x
          </button>
          <button
            id="btn-func-square"
            type="button"
            onClick={onSquare}
            className="py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition active:scale-95"
          >
            x²
          </button>
          <button
            id="btn-func-reciprocal"
            type="button"
            onClick={onReciprocal}
            className="py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition active:scale-95"
          >
            1/x
          </button>
        </div>
      )}

      {/* Main 4x5 Calculator Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {/* Row 1: AC, ⌫, %, ÷ */}
        <button
          id="btn-clear"
          type="button"
          onClick={onClear}
          className="h-14 sm:h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/50 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 font-bold text-lg transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          AC
        </button>

        <button
          id="btn-backspace"
          type="button"
          onClick={onBackspace}
          title="Effacer le dernier caractère"
          className="h-14 sm:h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          <Delete className="w-5 h-5" />
        </button>

        <button
          id="btn-percentage"
          type="button"
          onClick={onPercentage}
          className="h-14 sm:h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 font-semibold text-lg transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          <Percent className="w-4 h-4" />
        </button>

        <button
          id="btn-op-divide"
          type="button"
          onClick={() => onOperator('/')}
          className="h-14 sm:h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 font-bold text-xl transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          <Divide className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Row 2: 7, 8, 9, × */}
        <button
          id="btn-num-7"
          type="button"
          onClick={() => onDigit('7')}
          className="h-14 sm:h-16 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700/70 text-slate-900 dark:text-white font-semibold text-xl transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          7
        </button>
        <button
          id="btn-num-8"
          type="button"
          onClick={() => onDigit('8')}
          className="h-14 sm:h-16 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700/70 text-slate-900 dark:text-white font-semibold text-xl transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          8
        </button>
        <button
          id="btn-num-9"
          type="button"
          onClick={() => onDigit('9')}
          className="h-14 sm:h-16 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700/70 text-slate-900 dark:text-white font-semibold text-xl transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          9
        </button>
        <button
          id="btn-op-multiply"
          type="button"
          onClick={() => onOperator('*')}
          className="h-14 sm:h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 font-bold text-xl transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          <Multiply className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Row 3: 4, 5, 6, − */}
        <button
          id="btn-num-4"
          type="button"
          onClick={() => onDigit('4')}
          className="h-14 sm:h-16 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700/70 text-slate-900 dark:text-white font-semibold text-xl transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          4
        </button>
        <button
          id="btn-num-5"
          type="button"
          onClick={() => onDigit('5')}
          className="h-14 sm:h-16 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700/70 text-slate-900 dark:text-white font-semibold text-xl transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          5
        </button>
        <button
          id="btn-num-6"
          type="button"
          onClick={() => onDigit('6')}
          className="h-14 sm:h-16 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700/70 text-slate-900 dark:text-white font-semibold text-xl transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          6
        </button>
        <button
          id="btn-op-subtract"
          type="button"
          onClick={() => onOperator('-')}
          className="h-14 sm:h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 font-bold text-xl transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          <Minus className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Row 4: 1, 2, 3, + */}
        <button
          id="btn-num-1"
          type="button"
          onClick={() => onDigit('1')}
          className="h-14 sm:h-16 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700/70 text-slate-900 dark:text-white font-semibold text-xl transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          1
        </button>
        <button
          id="btn-num-2"
          type="button"
          onClick={() => onDigit('2')}
          className="h-14 sm:h-16 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700/70 text-slate-900 dark:text-white font-semibold text-xl transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          2
        </button>
        <button
          id="btn-num-3"
          type="button"
          onClick={() => onDigit('3')}
          className="h-14 sm:h-16 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700/70 text-slate-900 dark:text-white font-semibold text-xl transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          3
        </button>
        <button
          id="btn-op-add"
          type="button"
          onClick={() => onOperator('+')}
          className="h-14 sm:h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 font-bold text-xl transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Row 5: ±, 0, ., = */}
        <button
          id="btn-sign"
          type="button"
          onClick={onToggleSign}
          title="Changer le signe"
          className="h-14 sm:h-16 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700/70 text-slate-700 dark:text-slate-300 font-semibold text-lg transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          <span>±</span>
        </button>
        <button
          id="btn-num-0"
          type="button"
          onClick={() => onDigit('0')}
          className="h-14 sm:h-16 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700/70 text-slate-900 dark:text-white font-semibold text-xl transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          0
        </button>
        <button
          id="btn-decimal"
          type="button"
          onClick={onDecimal}
          className="h-14 sm:h-16 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700/70 text-slate-900 dark:text-white font-semibold text-2xl transition active:scale-95 shadow-xs flex items-center justify-center"
        >
          .
        </button>
        <button
          id="btn-equals"
          type="button"
          onClick={onEqual}
          className="h-14 sm:h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-2xl transition active:scale-95 shadow-lg shadow-indigo-600/30 flex items-center justify-center"
        >
          <Equal className="w-6 h-6 stroke-[3]" />
        </button>
      </div>

      {/* Toggle extended math functions */}
      <div className="flex justify-center pt-1">
        <button
          id="btn-toggle-extended"
          type="button"
          onClick={onToggleExtended}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition rounded-lg"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>{showExtended ? 'Masquer fonctions avancées' : 'Fonctions avancées (√, x², parenthèses)'}</span>
        </button>
      </div>
    </div>
  );
};
