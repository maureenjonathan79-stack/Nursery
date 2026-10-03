import React, { useState } from 'react';
import { Sparkles, Plus, Equal, RotateCcw, Volume2 } from 'lucide-react';
import { sound, speakDialogue } from '../utils/audio';

interface RainbowMixerProps {
  voiceEnabled: boolean;
}

interface MixingRecipe {
  colorA: string;
  colorB: string;
  resultName: string;
  resultHex: string;
  resultEmoji: string;
  explanation: string;
}

const RECIPES: MixingRecipe[] = [
  {
    colorA: 'Red',
    colorB: 'Yellow',
    resultName: 'Orange',
    resultHex: '#F97316',
    resultEmoji: '🍊',
    explanation: 'When Red and Yellow dance together, they make bright Orange!',
  },
  {
    colorA: 'Yellow',
    colorB: 'Blue',
    resultName: 'Green',
    resultHex: '#10B981',
    resultEmoji: '🦖',
    explanation: 'Yellow sunshine meets Blue water to create lush, happy Green!',
  },
  {
    colorA: 'Red',
    colorB: 'Blue',
    resultName: 'Purple',
    resultHex: '#A855F7',
    resultEmoji: '🍇',
    explanation: 'Red warmth and Blue coolness swirl together to make royal Purple!',
  },
  {
    colorA: 'Red',
    colorB: 'White',
    resultName: 'Pink',
    resultHex: '#EC4899',
    resultEmoji: '🌸',
    explanation: 'Red with a gentle touch of soft White blossoms into sweet Pink!',
  },
];

const PRIMARY_COLORS = [
  { name: 'Red', hex: '#EF4444', emoji: '🍎' },
  { name: 'Yellow', hex: '#EAB308', emoji: '⭐' },
  { name: 'Blue', hex: '#3B82F6', emoji: '🚂' },
  { name: 'White', hex: '#F8FAFC', emoji: '☁️' },
];

export const RainbowMixer: React.FC<RainbowMixerProps> = ({ voiceEnabled }) => {
  const [selectedA, setSelectedA] = useState<string | null>('Red');
  const [selectedB, setSelectedB] = useState<string | null>('Yellow');
  const [isMixing, setIsMixing] = useState(false);

  // Find matching recipe
  const matchedRecipe = RECIPES.find(
    (r) =>
      (r.colorA === selectedA && r.colorB === selectedB) ||
      (r.colorA === selectedB && r.colorB === selectedA)
  );

  const handleSelectColor = (name: string) => {
    sound.playPop();
    if (!selectedA) {
      setSelectedA(name);
    } else if (!selectedB) {
      if (selectedA !== name) {
        setSelectedB(name);
      }
    } else {
      setSelectedA(name);
      setSelectedB(null);
    }
  };

  const handleMix = () => {
    if (!matchedRecipe) return;
    setIsMixing(true);
    sound.playSparkle();

    setTimeout(() => {
      setIsMixing(false);
      sound.playSuccessFanfare();
      if (voiceEnabled) {
        speakDialogue(
          `${matchedRecipe.colorA} and ${matchedRecipe.colorB} make ${matchedRecipe.resultName}! ${matchedRecipe.explanation}`,
          'leo'
        );
      }
    }, 800);
  };

  const handleReset = () => {
    sound.playPop();
    setSelectedA(null);
    setSelectedB(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold font-['Fredoka'] text-amber-950">
          Magical Rainbow Mixer
        </h2>
        <p className="text-sm sm:text-base text-amber-900/80">
          Pick two primary colors and discover what secret color they make together!
        </p>
      </div>

      {/* Primary Color Selectors */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {PRIMARY_COLORS.map((pc) => {
            const isSelected = selectedA === pc.name || selectedB === pc.name;
            return (
              <button
                key={pc.name}
                type="button"
                onClick={() => handleSelectColor(pc.name)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-['Fredoka'] text-base font-bold transition-all ${
                  isSelected
                    ? 'ring-4 ring-amber-400 scale-105 shadow-md text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
                style={{
                  backgroundColor: isSelected ? pc.hex : undefined,
                  color: isSelected && pc.name === 'White' ? '#1e293b' : undefined,
                }}
              >
                <span className="text-xl">{pc.emoji}</span>
                <span>{pc.name}</span>
              </button>
            );
          })}
        </div>

        {/* The Mixing Cauldron / Beaker */}
        <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col md:flex-row items-center justify-center gap-6">
          {/* First Color */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-500 mb-1">Color 1</span>
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow flex items-center justify-center text-3xl font-bold border-2 border-white"
              style={{
                backgroundColor:
                  PRIMARY_COLORS.find((p) => p.name === selectedA)?.hex || '#e2e8f0',
              }}
            >
              {PRIMARY_COLORS.find((p) => p.name === selectedA)?.emoji || '?'}
            </div>
            <span className="font-['Fredoka'] font-bold text-slate-800 text-sm mt-1">
              {selectedA || 'Choose'}
            </span>
          </div>

          <div className="text-2xl font-black text-amber-800">
            <Plus className="w-8 h-8 stroke-[3]" />
          </div>

          {/* Second Color */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-500 mb-1">Color 2</span>
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow flex items-center justify-center text-3xl font-bold border-2 border-white"
              style={{
                backgroundColor:
                  PRIMARY_COLORS.find((p) => p.name === selectedB)?.hex || '#e2e8f0',
              }}
            >
              {PRIMARY_COLORS.find((p) => p.name === selectedB)?.emoji || '?'}
            </div>
            <span className="font-['Fredoka'] font-bold text-slate-800 text-sm mt-1">
              {selectedB || 'Choose'}
            </span>
          </div>

          <div className="text-2xl font-black text-amber-800">
            <Equal className="w-8 h-8 stroke-[3]" />
          </div>

          {/* Result Color Beaker */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-500 mb-1">Magic Result!</span>
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl shadow-xl flex items-center justify-center text-4xl border-4 border-white transition-all ${
                isMixing ? 'animate-spin' : ''
              }`}
              style={{
                backgroundColor: matchedRecipe ? matchedRecipe.resultHex : '#e2e8f0',
              }}
            >
              {matchedRecipe ? matchedRecipe.resultEmoji : '✨'}
            </div>
            <span className="font-['Fredoka'] font-extrabold text-slate-900 text-base mt-1">
              {matchedRecipe ? matchedRecipe.resultName : 'Magic Color'}
            </span>
          </div>
        </div>

        {/* Explanation & Celebration */}
        {matchedRecipe && (
          <div
            className="p-5 rounded-2xl text-center space-y-2 border shadow-sm animate-in fade-in"
            style={{
              backgroundColor: `${matchedRecipe.resultHex}15`,
              borderColor: `${matchedRecipe.resultHex}55`,
            }}
          >
            <h4
              className="text-xl sm:text-2xl font-bold font-['Fredoka']"
              style={{ color: matchedRecipe.resultHex }}
            >
              {matchedRecipe.colorA} + {matchedRecipe.colorB} = {matchedRecipe.resultName}!
            </h4>
            <p className="text-slate-700 font-medium text-sm sm:text-base font-['Fredoka']">
              {matchedRecipe.explanation}
            </p>
            <button
              type="button"
              onClick={() => {
                sound.playSparkle();
                if (voiceEnabled) {
                  speakDialogue(matchedRecipe.explanation, 'mia');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-800 font-bold text-xs shadow-sm mt-1"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>Listen to Mia & Leo</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleMix}
            disabled={!matchedRecipe}
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-amber-950 font-bold font-['Fredoka'] text-base shadow-lg transition-transform active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Mix Colors Now!</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
