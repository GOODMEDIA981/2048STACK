
import { CircleDefinition } from './types';

export interface ExtendedCircleDefinition extends CircleDefinition {
  borderColor: string;
}

export const GAME_WIDTH = 450;
export const GAME_HEIGHT = 700;
export const SPAWN_Y = 100;
export const LOSE_LINE_Y = 160;

export const CIRCLE_DEFS: Record<number, ExtendedCircleDefinition> = {
  2: { value: 2, radius: 25, color: '#ef4444', borderColor: '#991b1b', textColor: '#ffffff' },      // Red
  4: { value: 4, radius: 35, color: '#f97316', borderColor: '#9a3412', textColor: '#ffffff' },      // Orange
  8: { value: 8, radius: 45, color: '#eab308', borderColor: '#854d0e', textColor: '#ffffff' },      // Yellow
  16: { value: 16, radius: 55, color: '#22c55e', borderColor: '#166534', textColor: '#ffffff' },     // Green
  32: { value: 32, radius: 65, color: '#3b82f6', borderColor: '#1e40af', textColor: '#ffffff' },     // Blue
  64: { value: 64, radius: 75, color: '#4f46e5', borderColor: '#3730a3', textColor: '#ffffff' },     // Indigo
  128: { value: 128, radius: 85, color: '#9333ea', borderColor: '#6b21a8', textColor: '#ffffff' },    // Violet
  256: { value: 256, radius: 95, color: '#ec4899', borderColor: '#9d174d', textColor: '#ffffff' },    // Pink
  512: { value: 512, radius: 105, color: '#06b6d4', borderColor: '#155e75', textColor: '#ffffff' },   // Cyan
  1024: { value: 1024, radius: 115, color: '#facc15', borderColor: '#a16207', textColor: '#ffffff' }, // Gold/Yellow
  2048: { value: 2048, radius: 130, color: '#ffffff', borderColor: '#cbd5e1', textColor: '#ffffff' }, // White
};

export const NEXT_TILE_PROBS = [2, 2, 2, 2, 4, 4, 4, 8, 8, 16];
