/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Calculator as CalcIcon,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Keyboard,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { CalculationHistoryItem, MemoryState } from './types';
import { evaluateExpression, cleanFloat } from './utils/calculatorEngine';
import { playKeySound, triggerHaptic } from './utils/soundAndHaptics';
import { CalculatorDisplay } from './components/CalculatorDisplay';
import { CalculatorKeypad } from './components/CalculatorKeypad';
import { CalculatorHistory } from './components/CalculatorHistory';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';

const HISTORY_STORAGE_KEY = 'calculator_history_v1';
const MEMORY_STORAGE_KEY = 'calculator_memory_v1';
const THEME_STORAGE_KEY = 'calculator_theme_v1';
const SOUND_STORAGE_KEY = 'calculator_sound_v1';

export default function App() {
  // Calculator Core State
  const [expression, setExpression] = useState('');
  const [currentInput, setCurrentInput] = useState('0');
  const [isResult, setIsResult] = useState(false);

  // History & Memory
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [memory, setMemory] = useState<MemoryState>(() => {
    if (typeof window === 'undefined') return { value: 0, hasValue: false };
    try {
      const saved = localStorage.getItem(MEMORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : { value: 0, hasValue: false };
    } catch {
      return { value: 0, hasValue: false };
    }
  });

  // UI state
  const [showHistory, setShowHistory] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showExtended, setShowExtended] = useState(false);

  // Preferences
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      return saved !== 'false';
    }
    return true;
  });

  // Sync theme
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [darkMode]);

  // Sync memory & history
  useEffect(() => {
    try {
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memory));
    } catch {
      // Ignore storage errors
    }
  }, [memory]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignore storage errors
    }
  }, [history]);

  // Sync sound
  useEffect(() => {
    localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
  }, [soundEnabled]);

  const triggerFeedback = useCallback(
    (type: 'digit' | 'operator' | 'action' | 'equal' = 'digit') => {
      if (soundEnabled) playKeySound(type);
      triggerHaptic(type === 'equal' ? 22 : 12);
    },
    [soundEnabled]
  );

  // Digit Input
  const handleDigit = useCallback(
    (digit: string) => {
      triggerFeedback('digit');
      if (isResult) {
        // Start fresh after calculating a result
        setCurrentInput(digit);
        setExpression('');
        setIsResult(false);
      } else {
        if (currentInput === '0') {
          setCurrentInput(digit);
        } else if (currentInput === '-0') {
          setCurrentInput(`-${digit}`);
        } else if (currentInput.replace('-', '').length < 16) {
          setCurrentInput((prev) => prev + digit);
        }
      }
    },
    [isResult, currentInput, triggerFeedback]
  );

  // Decimal Point
  const handleDecimal = useCallback(() => {
    triggerFeedback('digit');
    if (isResult) {
      setCurrentInput('0.');
      setExpression('');
      setIsResult(false);
      return;
    }

    if (!currentInput.includes('.')) {
      setCurrentInput((prev) => `${prev}.`);
    }
  }, [isResult, currentInput, triggerFeedback]);

  // Operator (+, -, *, /)
  const handleOperator = useCallback(
    (op: '+' | '-' | '*' | '/') => {
      triggerFeedback('operator');
      const opDisplay = op === '*' ? '×' : op === '/' ? '÷' : op;

      if (isResult) {
        // Chain calculation using the previous result
        setExpression(`${currentInput} ${opDisplay}`);
        setCurrentInput('0');
        setIsResult(false);
        return;
      }

      if (expression && currentInput === '0') {
        // If user is just changing the operator at the end
        const trimmed = expression.trim();
        const lastChar = trimmed[trimmed.length - 1];
        if (['+', '-', '×', '÷', '*', '/'].includes(lastChar)) {
          setExpression(`${trimmed.slice(0, -1)} ${opDisplay}`);
          return;
        }
      }

      // Add current number and operator to expression
      setExpression((prev) => {
        if (!prev) {
          return `${currentInput} ${opDisplay}`;
        }
        return `${prev} ${currentInput} ${opDisplay}`;
      });
      setCurrentInput('0');
    },
    [isResult, currentInput, expression, triggerFeedback]
  );

  // Equals (=)
  const handleEqual = useCallback(() => {
    triggerFeedback('equal');
    if (!expression && !isResult) {
      return;
    }

    let fullExpr = expression ? `${expression} ${currentInput}` : currentInput;
    // Normalize operators for evaluator
    fullExpr = fullExpr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

    const evalRes = evaluateExpression(fullExpr);

    if (evalRes.error) {
      setCurrentInput('Erreur');
      setIsResult(true);
      return;
    }

    const resultNum = evalRes.result ?? 0;
    const resultStr = String(resultNum);

    // Save to history if it was an actual equation
    if (expression) {
      const historyItem: CalculationHistoryItem = {
        id: `calc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        expression: fullExpr,
        result: resultStr,
        timestamp: Date.now(),
      };
      setHistory((prev) => [historyItem, ...prev.slice(0, 49)]);
    }

    setExpression(`${fullExpr} =`);
    setCurrentInput(resultStr);
    setIsResult(true);
  }, [expression, isResult, currentInput, triggerFeedback]);

  // Clear All (AC)
  const handleClear = useCallback(() => {
    triggerFeedback('action');
    setExpression('');
    setCurrentInput('0');
    setIsResult(false);
  }, [triggerFeedback]);

  // Backspace (⌫)
  const handleBackspace = useCallback(() => {
    triggerFeedback('action');
    if (isResult) {
      handleClear();
      return;
    }

    if (currentInput.length > 1) {
      if (currentInput.length === 2 && currentInput.startsWith('-')) {
        setCurrentInput('0');
      } else {
        setCurrentInput((prev) => prev.slice(0, -1));
      }
    } else {
      setCurrentInput('0');
    }
  }, [isResult, currentInput, handleClear, triggerFeedback]);

  // Toggle Sign (±)
  const handleToggleSign = useCallback(() => {
    triggerFeedback('action');
    if (currentInput === '0' || currentInput === 'Erreur') return;
    setCurrentInput((prev) => (prev.startsWith('-') ? prev.slice(1) : `-${prev}`));
  }, [currentInput, triggerFeedback]);

  // Percentage (%)
  const handlePercentage = useCallback(() => {
    triggerFeedback('action');
    const val = parseFloat(currentInput);
    if (isNaN(val)) return;

    if (expression) {
      // Find the base number from expression if possible
      const parts = expression.trim().split(' ');
      const baseVal = parseFloat(parts[0]);
      if (!isNaN(baseVal)) {
        const percentVal = cleanFloat((baseVal * val) / 100);
        setCurrentInput(String(percentVal));
        return;
      }
    }

    const simplePercent = cleanFloat(val / 100);
    setCurrentInput(String(simplePercent));
  }, [currentInput, expression, triggerFeedback]);

  // Math Unary Operations
  const handleSquare = useCallback(() => {
    triggerFeedback('action');
    const val = parseFloat(currentInput);
    if (isNaN(val)) return;
    const res = cleanFloat(val * val);
    setExpression(`sqr(${currentInput})`);
    setCurrentInput(String(res));
    setIsResult(true);
  }, [currentInput, triggerFeedback]);

  const handleSquareRoot = useCallback(() => {
    triggerFeedback('action');
    const val = parseFloat(currentInput);
    if (isNaN(val) || val < 0) {
      setCurrentInput('Erreur');
      setIsResult(true);
      return;
    }
    const res = cleanFloat(Math.sqrt(val));
    setExpression(`√(${currentInput})`);
    setCurrentInput(String(res));
    setIsResult(true);
  }, [currentInput, triggerFeedback]);

  const handleReciprocal = useCallback(() => {
    triggerFeedback('action');
    const val = parseFloat(currentInput);
    if (isNaN(val) || val === 0) {
      setCurrentInput('Erreur');
      setIsResult(true);
      return;
    }
    const res = cleanFloat(1 / val);
    setExpression(`1/(${currentInput})`);
    setCurrentInput(String(res));
    setIsResult(true);
  }, [currentInput, triggerFeedback]);

  // Parentheses
  const handleParenthesis = useCallback(
    (p: '(' | ')') => {
      triggerFeedback('operator');
      if (p === '(') {
        if (isResult) {
          setExpression('(');
          setCurrentInput('0');
          setIsResult(false);
        } else if (currentInput === '0') {
          setExpression((prev) => `${prev} (`.trim());
        } else {
          setExpression((prev) => `${prev} ${currentInput} × (`.trim());
          setCurrentInput('0');
        }
      } else {
        // ')'
        setExpression((prev) => `${prev} ${currentInput} )`.trim());
        setCurrentInput('0');
      }
    },
    [isResult, currentInput, triggerFeedback]
  );

  // Memory Actions
  const handleMemoryAction = useCallback(
    (action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => {
      triggerFeedback('action');
      const val = parseFloat(currentInput) || 0;

      switch (action) {
        case 'MC':
          setMemory({ value: 0, hasValue: false });
          break;
        case 'MR':
          if (memory.hasValue) {
            setCurrentInput(String(memory.value));
            setIsResult(true);
          }
          break;
        case 'M+':
          setMemory((prev) => ({
            value: cleanFloat((prev.hasValue ? prev.value : 0) + val),
            hasValue: true,
          }));
          break;
        case 'M-':
          setMemory((prev) => ({
            value: cleanFloat((prev.hasValue ? prev.value : 0) - val),
            hasValue: true,
          }));
          break;
        case 'MS':
          setMemory({
            value: cleanFloat(val),
            hasValue: true,
          });
          break;
      }
    },
    [currentInput, memory, triggerFeedback]
  );

  // Select History Item
  const handleSelectHistory = useCallback((item: CalculationHistoryItem) => {
    setCurrentInput(item.result);
    setExpression(item.expression);
    setIsResult(true);
    setShowHistory(false);
  }, []);

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if modifier keys like Ctrl/Meta (for copy, reload, etc.)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperator('-');
      } else if (e.key === '*') {
        e.preventDefault();
        handleOperator('*');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('/');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEqual();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      } else if (e.key === '%') {
        e.preventDefault();
        handlePercentage();
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        handleParenthesis(e.key as '(' | ')');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleDigit,
    handleDecimal,
    handleOperator,
    handleEqual,
    handleBackspace,
    handleClear,
    handlePercentage,
    handleParenthesis,
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-3 sm:p-6 select-none transition-colors duration-200">
      {/* Container Wrapper */}
      <div className="w-full max-w-[420px] bg-white dark:bg-slate-900/95 rounded-[36px] sm:rounded-[40px] p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800/80 relative overflow-hidden backdrop-blur-md">
        {/* Header bar: Title & Utilities */}
        <header className="flex items-center justify-between pb-3.5 mb-1 text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <CalcIcon className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Calculatrice</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Keyboard shortcuts helper */}
            <button
              id="btn-shortcuts"
              type="button"
              onClick={() => setShowShortcuts(true)}
              title="Raccourcis clavier"
              className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Sound toggle */}
            <button
              id="btn-sound-toggle"
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Désactiver le son' : 'Activer le son'}
              className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Dark / Light toggle */}
            <button
              id="btn-theme-toggle"
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          </div>
        </header>

        {/* Display screen */}
        <div className="mb-4">
          <CalculatorDisplay
            expression={expression}
            currentInput={currentInput}
            hasMemory={memory.hasValue}
            onToggleHistory={() => setShowHistory(!showHistory)}
            showHistory={showHistory}
            historyCount={history.length}
          />
        </div>

        {/* Keypad */}
        <CalculatorKeypad
          onDigit={handleDigit}
          onDecimal={handleDecimal}
          onOperator={handleOperator}
          onEqual={handleEqual}
          onClear={handleClear}
          onBackspace={handleBackspace}
          onToggleSign={handleToggleSign}
          onPercentage={handlePercentage}
          onSquare={handleSquare}
          onSquareRoot={handleSquareRoot}
          onReciprocal={handleReciprocal}
          onParenthesis={handleParenthesis}
          onMemoryAction={handleMemoryAction}
          memory={memory}
          showExtended={showExtended}
          onToggleExtended={() => setShowExtended(!showExtended)}
        />

        {/* Slide-over History Tape */}
        <CalculatorHistory
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          history={history}
          onSelectHistory={handleSelectHistory}
          onClearHistory={() => setHistory([])}
        />
      </div>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* Footer subtle hint */}
      <footer className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2">
        <span>Saisie tactile & clavier supportée</span>
        <span>•</span>
        <span>Précision arithmétique</span>
      </footer>
    </div>
  );
}
