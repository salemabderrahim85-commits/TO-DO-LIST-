export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type CalculatorTheme = 'dark' | 'light' | 'amoled';

export interface MemoryState {
  value: number;
  hasValue: boolean;
}
