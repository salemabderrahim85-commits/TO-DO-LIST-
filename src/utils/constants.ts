import { Category, Priority } from '../types';

export const CATEGORY_CONFIG: Record<
  Category,
  { label: string; bgLight: string; textLight: string; bgDark: string; textDark: string; iconName: string }
> = {
  personal: {
    label: 'Personnel',
    bgLight: 'bg-indigo-100',
    textLight: 'text-indigo-700',
    bgDark: 'bg-indigo-950/60',
    textDark: 'text-indigo-300',
    iconName: 'User',
  },
  work: {
    label: 'Travail',
    bgLight: 'bg-blue-100',
    textLight: 'text-blue-700',
    bgDark: 'bg-blue-950/60',
    textDark: 'text-blue-300',
    iconName: 'Briefcase',
  },
  shopping: {
    label: 'Courses',
    bgLight: 'bg-emerald-100',
    textLight: 'text-emerald-700',
    bgDark: 'bg-emerald-950/60',
    textDark: 'text-emerald-300',
    iconName: 'ShoppingCart',
  },
  health: {
    label: 'Santé',
    bgLight: 'bg-rose-100',
    textLight: 'text-rose-700',
    bgDark: 'bg-rose-950/60',
    textDark: 'text-rose-300',
    iconName: 'HeartPulse',
  },
  education: {
    label: 'Études',
    bgLight: 'bg-amber-100',
    textLight: 'text-amber-800',
    bgDark: 'bg-amber-950/60',
    textDark: 'text-amber-300',
    iconName: 'GraduationCap',
  },
  other: {
    label: 'Autre',
    bgLight: 'bg-slate-100',
    textLight: 'text-slate-700',
    bgDark: 'bg-slate-800',
    textDark: 'text-slate-300',
    iconName: 'Tag',
  },
};

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; badgeClass: string; colorDot: string }
> = {
  low: {
    label: 'Basse',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    colorDot: 'bg-emerald-500',
  },
  medium: {
    label: 'Moyenne',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    colorDot: 'bg-amber-500',
  },
  high: {
    label: 'Haute',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-semibold',
    colorDot: 'bg-rose-500',
  },
};
