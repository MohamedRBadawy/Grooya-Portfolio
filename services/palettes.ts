import type { Palette } from '../types';

export const defaultPalettes: Palette[] = [
  {
    id: 'default-light',
    name: 'Light',
    colors: {
      background: '#ffffff', // white
      text: '#334155', // slate-700
      heading: '#0f172a', // slate-900
      subtle: '#475569', // slate-600
      cardBackground: '#f8fafc', // slate-50
      cardBorder: '#e2e8f0', // slate-200
      inputBackground: '#f1f5f9', // slate-100
      inputBorder: '#cbd5e1', // slate-300
      inputText: '#0f172a', // slate-900
      inputPlaceholder: '#64748b', // slate-500
    },
  },
  {
    id: 'default-dark',
    name: 'Dark',
    colors: {
      background: '#020617', // slate-950
      text: '#cbd5e1', // slate-300
      heading: '#f1f5f9', // slate-100
      subtle: '#94a3b8', // slate-400
      cardBackground: '#0f172a', // slate-900
      cardBorder: '#1e293b', // slate-800
      inputBackground: '#1e293b', // slate-800
      inputBorder: '#334155', // slate-700
      inputText: '#f1f5f9', // slate-100
      inputPlaceholder: '#64748b', // slate-500
    },
  },
  {
    id: 'default-mint',
    name: 'Mint',
    colors: {
      background: '#f0fdfa', // teal-50 custom
      text: '#115e59', // teal-800 custom
      heading: '#0f766e', // teal-700 custom
      subtle: '#134e4a', // teal-900 custom
      cardBackground: '#ffffff', // white
      cardBorder: '#ccfbf1', // teal-200 custom
      inputBackground: '#ccfbf1', // teal-200 custom
      inputBorder: '#99f6e4', // teal-300 custom
      inputText: '#134e4a', // teal-900 custom
      inputPlaceholder: '#2dd4bf', // teal-400 custom
    },
  },
  {
    id: 'default-rose',
    name: 'Rose',
    colors: {
      background: '#fff1f2', // rose-50
      text: '#9f1239', // rose-800 custom
      heading: '#881337', // rose-900
      subtle: '#be185d', // rose-700 custom
      cardBackground: '#ffffff', // white
      cardBorder: '#ffe4e6', // rose-100
      inputBackground: '#fecdd3', // rose-200 custom
      inputBorder: '#fda4af', // rose-300 custom
      inputText: '#881337', // rose-900
      inputPlaceholder: '#f472b6', // rose-400 custom
    },
  },
];