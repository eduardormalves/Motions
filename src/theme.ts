import { loadFont as loadDmSans } from '@remotion/google-fonts/DmSans';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

export const COLORS = {
  bg:          '#f0f4f8',
  bgCard:      '#ffffff',
  bgInput:     '#f1f5f9',
  primary:     '#2563eb',
  accentDark:  '#1e3a6e',
  navy:        '#1e3a6e',
  card:        '#ffffff',
  text:        '#1e293b',
  textMuted:   '#64748b',
  textFaint:   '#94a3b8',
  success:     '#16a34a',
  danger:      '#ef4444',
  warning:     '#d97706',
  purple:      '#7c3aed',
  border:      '#e2e8f0',
  borderInput: '#cbd5e1',
} as const;

// DM Sans — display/headlines (matches AVO brand)
const { fontFamily: dmSansFamily } = loadDmSans('normal', {
  weights: ['400', '700', '800', '900'],
  subsets: ['latin'],
});

// Inter — body / UI text
const { fontFamily: interFamily } = loadInter('normal', {
  weights: ['400', '600', '700'],
  subsets: ['latin'],
});

export const FONTS = {
  display: dmSansFamily, // headlines — DM Sans
  syne:    dmSansFamily, // alias para compatibilidade
  inter:   interFamily,
};
