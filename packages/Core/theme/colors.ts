const palette = {
  // dark
  mercury: 'rgba(0, 0, 0, 0.1)',
  todo: 'rgba(0, 0, 0, 0.17)',
  nobel: 'rgba(0, 0, 0, 0.4)',
  empress: 'rgba(0, 0, 0, 0.55)',
  tundora: 'rgba(0, 0, 0, 0.7)',
  black: 'rgba(0, 0, 0, 1)',

  // light
  nero: 'rgba(255, 255, 255, 0.1)',
  mineshaft: 'rgba(255, 255, 255, 0.17)',
  granite: 'rgba(255, 255, 255, 0.4)',
  battleship: 'rgba(255, 255, 255, 0.55)',
  silverchalice: 'rgba(255, 255, 255, 0.7)',
  white: 'rgba(255, 255, 255, 1)',

  // nudes
  isabelline: '#F6F3EF',
  pampas: '#EFEAE4',
  timberwolf: '#D6D2CC',
  naturalgray: '#8F8C88',
  ironside: '#6B6966',
  dune: '#474543',
}

export const colors = {
  'primary-100': '#C6CAFF',
  'primary-200': '#5650EC',
  'primary-500': '#3B35DC',
  'primary-600': '#3B35DC',
  'primary-700': '#241DBB',
  'primary-800': '#1C168F',
  'primary-900': '#171379',
  'success-100': '#E6FAE7',
  'success-200': '#7EC784',
  'success-300': '#52B45A',
  'success-400': '#2F9237',
  'success-500': '#206626',
  'danger-100': '#FFECEC',
  'danger-200': '#E02F32',
  'danger-300': '#BB1316',
  'danger-400': '#94080A',
  'danger-500': '#670507',
  'warning-100': '#FFF5EF',
  'warning-200': '#F17D39',
  'warning-300': '#D35E1A',
  'warning-400': '#B34607',
  'warning-500': '#7d3104',
  'info-100': '#EAF2FE',
  'info-200': '#6696DF',
  'info-300': '#3E7BD7',
  'info-400': '#1B57B2',
  'info-500': '#123c7c',
  'light-100': palette.nero,
  'light-200': palette.mineshaft,
  'light-400': palette.granite,
  'light-500': palette.battleship,
  'light-700': palette.silverchalice,
  'light-900': palette.white,
  'dark-100': palette.mercury,
  'dark-200': palette.todo,
  'dark-400': palette.nobel,
  'dark-500': palette.empress,
  'dark-700': palette.tundora,
  'dark-900': palette.black,
  'nude-100': palette.isabelline,
  'nude-200': palette.pampas,
  'nude-400': palette.timberwolf,
  'nude-600': palette.naturalgray,
  'nude-700': palette.ironside,
  'nude-900': palette.dune,
  'sub-1': '#3FD1C1',
  'sub-2': '#4AB519',
  'sub-3': '#EA724C',
  'sub-4': '#F0AABF',
  'sub-5': '#965FE6',
  'sub-6': '#F4CF70',
  'sub-7': '#FE6D73',
  black: palette.black,
  white: palette.white,
  border: palette.mercury,
  overlay: palette.empress,
  underline: '#C6CAFF',
}

export type ThemeColors = typeof colors
