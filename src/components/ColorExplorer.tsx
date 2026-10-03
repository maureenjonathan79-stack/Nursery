import React, { useState } from 'react';
import { Sparkles, Volume2, ArrowRight, Check } from 'lucide-react';
import { COLORS } from '../data/episodeData';
import { ColorDefinition } from '../types/colors';
import { sound, speakDialogue } from '../utils/audio';

interface ColorExplorerProps {
  selectedColorId?: string;
  onSelectColor: (colorId: string) => void;
  voiceEnabled: boolean;
}

export const ColorExplorer: React.FC<ColorExplorerProps> = ({
  selectedColorId = 'red',
  onSelectColor,
  voiceEnabled,
}) => {
  const [activeColorId, setActiveColorId] = useState(selectedColorId);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  const currentColor = COLORS.find((c) => c.id === activeColorId) || COLORS[0];

  const handleColorClick = (color: ColorDefinition) => {
    sound.playSparkle();
    setActiveColorId(color.id);
    onSelectColor(color.id);

    if (voiceEnabled) {
      speakDialogue(`${color.name}! ${color.rhyme}`, 'mia');
    }
  };

  const handleCanvasTap = (e: React.MouseEvent<HTMLDivElement>) => {
    sound.playPop();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newBubble = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: Math.floor(Math.random() * 40) + 24,
    };
    setBubbles((prev) => [...prev, newBubble]);
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
    }, 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Introduction Banner */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold font-['Fredoka'] text-amber-950">
          Color Explorer with Mia & Leo
        </h2>
        <p className="text-sm sm:text-base text-amber-900/80">
          Tap each color below to discover its special rhyme and see colorful treasures!
        </p>
      </div>

      {/* Color Palette Selector Tabs (Interactive Functional Buttons) */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3 p-2 bg-white rounded-3xl shadow-sm border border-amber-200/80">
        {COLORS.map((c) => {
          const isSelected = c.id === activeColorId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleColorClick(c)}
              className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl transition-all ${
                isSelected
                  ? 'ring-4 ring-offset-2 ring-amber-400 shadow-md scale-105'
                  : 'hover:scale-102 hover:bg-slate-50 opacity-90'
              }`}
              style={{
                backgroundColor: isSelected ? `${c.hex}18` : undefined,
                color: c.hex,
              }}
            >
              <div
                className="w-8 h-8 sm:w-11 sm:h-11 rounded-full shadow-inner flex items-center justify-center text-base sm:text-lg mb-1 transition-transform group-hover:scale-110"
                style={{ backgroundColor: c.hex }}
              >
                {isSelected ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[3]" /> : c.emoji}
              </div>
              <span className="text-xs sm:text-sm font-bold font-['Fredoka'] text-slate-800">
                {c.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Featured Color Showcase Card */}
      <div
        className="rounded-3xl p-6 sm:p-8 shadow-xl border-2 transition-all relative overflow-hidden"
        style={{
          backgroundColor: `${currentColor.hex}0f`,
          borderColor: `${currentColor.hex}44`,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Color Rhyme & Character Narration */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border text-xs font-bold font-['Fredoka']">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentColor.hex }}
              />
              <span className="text-slate-800">Learning Color: {currentColor.name}</span>
            </div>

            <h3
              className="text-3xl sm:text-4xl font-extrabold font-['Fredoka'] tracking-tight"
              style={{ color: currentColor.hex }}
            >
              The Wonder of {currentColor.name}!
            </h3>

            <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-amber-200/50 shadow-sm relative">
              <p className="text-base sm:text-lg font-semibold text-slate-800 font-['Fredoka'] leading-relaxed">
                “{currentColor.rhyme}”
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Preschool Rhyme Time</span>
                <button
                  type="button"
                  onClick={() => {
                    sound.playSparkle();
                    if (voiceEnabled) {
                      speakDialogue(currentColor.rhyme, 'mia');
                    }
                  }}
                  className="inline-flex items-center gap-1 font-bold text-amber-900 hover:text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>
              </div>
            </div>

            {/* Real World Item Chips */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-['Fredoka']">
                Things that are {currentColor.name}:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {currentColor.items.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      sound.playBoing();
                      if (voiceEnabled) {
                        speakDialogue(`${item} is ${currentColor.name}!`, 'leo');
                      }
                    }}
                    className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center gap-2 cursor-pointer hover:border-amber-300 hover:scale-102 transition-transform"
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: currentColor.hex }}
                    />
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Magical Splash Pad (Children tap to pop color bubbles) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
              <span>Magic Splash Pad: Tap anywhere to create bubbles!</span>
              <span className="text-amber-800 font-bold">✨ Tap to Pop</span>
            </div>

            <div
              onClick={handleCanvasTap}
              className="relative w-full h-64 sm:h-72 rounded-2xl bg-white shadow-inner border-2 border-dashed cursor-pointer overflow-hidden flex items-center justify-center select-none"
              style={{ borderColor: currentColor.hex }}
            >
              {bubbles.length === 0 && (
                <div className="text-center p-4 pointer-events-none opacity-60">
                  <div
                    className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl mb-2 animate-bounce"
                    style={{ backgroundColor: `${currentColor.hex}25` }}
                  >
                    {currentColor.emoji}
                  </div>
                  <p className="text-sm font-bold text-slate-700 font-['Fredoka']">
                    Tap anywhere inside to splash {currentColor.name} bubbles!
                  </p>
                </div>
              )}

              {/* Dynamic Animated Bubbles */}
              {bubbles.map((b) => (
                <div
                  key={b.id}
                  style={{
                    left: `${b.x}px`,
                    top: `${b.y}px`,
                    width: `${b.size}px`,
                    height: `${b.size}px`,
                    backgroundColor: currentColor.hex,
                  }}
                  className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping opacity-75 shadow-lg pointer-events-none"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
