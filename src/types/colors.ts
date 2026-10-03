export type Character = 'mia' | 'leo' | 'both';

export interface DialogueLine {
  id: string;
  speaker: Character;
  text: string;
  expression: 'happy' | 'excited' | 'curious' | 'celebrate' | 'waving';
  targetColor?: string;
  targetItem?: string;
  durationMs: number;
}

export interface ClassroomItem {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
  category: 'toy' | 'decoration' | 'nature' | 'art';
  xPercent: number; // position on stage
  yPercent: number;
  iconName: string;
  funFact: string;
  soundType: 'chime' | 'boing' | 'sparkle' | 'whistle' | 'pop';
}

export interface ColorDefinition {
  id: string;
  name: string;
  hex: string;
  textColor: string;
  bgLight: string;
  bgSoft: string;
  borderColor: string;
  items: string[];
  emoji: string;
  rhyme: string;
}
