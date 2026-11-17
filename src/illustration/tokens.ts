import {colors, technicalFont} from '../theme';

export const illustrationTokens = {
  brand: colors,
  font: technicalFont,
  nature: {sky: '#7fc7ee', skyHorizon: '#c3e8f6', grass: '#94c778', foliage: '#3e9954', sunlight: '#ffe6a1'},
  material: {metal: '#8fa6a3', metalLight: '#c4d3ce', metalShadow: '#607b7c', ceramic: '#b58255', copper: '#b87940', wire: '#4b6476', roof: '#ce6d45'},
  // Extracted material ramps from the supplied SF6 Remotion V2 source.
  ramps: {steel: ['#7998a9', '#edf3f1', '#456b80'], porcelain: ['#668f9f', '#f0f9f6', '#739ba9'], copper: ['#f8d58e', '#bf743d', '#6d3e36']},
  depth: {background: .1, midground: .25, foreground: .45},
  stroke: {detail: 2, outline: 4, conductor: 7},
  transitionSeconds: .8,
} as const;
