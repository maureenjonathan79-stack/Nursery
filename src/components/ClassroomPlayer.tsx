import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  Sparkles,
  Camera,
  Maximize,
  Heart,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { EPISODE_DIALOGUE, CLASSROOM_ITEMS, ASSET_IMAGES, COLORS } from '../data/episodeData';
import { ClassroomItem, DialogueLine } from '../types/colors';
import { sound, speakDialogue, stopSpeech } from '../utils/audio';

interface ClassroomPlayerProps {
  onColorSelect?: (colorId: string) => void;
  voiceEnabled: boolean;
}

export const ClassroomPlayer: React.FC<ClassroomPlayerProps> = ({
  onColorSelect,
  voiceEnabled,
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isWaving, setIsWaving] = useState(true);
  const [cameraMode, setCameraMode] = useState<'wide' | 'mia' | 'leo' | 'rainbow'>('wide');
  const [selectedItem, setSelectedItem] = useState<ClassroomItem | null>(null);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isTheater, setIsTheater] = useState(false);
  const timerRef = useRef<number | null>(null);

  const currentDialogue: DialogueLine = EPISODE_DIALOGUE[currentLineIndex] || EPISODE_DIALOGUE[0];

  // Handle line speech & auto progression
  useEffect(() => {
    if (voiceEnabled) {
      speakDialogue(currentDialogue.text, currentDialogue.speaker);
    }

    if (isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      const effectiveDuration = (currentDialogue.durationMs / playbackSpeed) + 800;
      timerRef.current = window.setTimeout(() => {
        setCurrentLineIndex((prev) => {
          if (prev < EPISODE_DIALOGUE.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, effectiveDuration);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentLineIndex, isPlaying, voiceEnabled, playbackSpeed]);

  const handleNext = () => {
    sound.playPop();
    if (currentLineIndex < EPISODE_DIALOGUE.length - 1) {
      setCurrentLineIndex((prev) => prev + 1);
    } else {
      setCurrentLineIndex(0);
    }
  };

  const handlePrev = () => {
    sound.playPop();
    if (currentLineIndex > 0) {
      setCurrentLineIndex((prev) => prev - 1);
    }
  };

  const handleReplay = () => {
    sound.playSparkle();
    stopSpeech();
    if (voiceEnabled) {
      speakDialogue(currentDialogue.text, currentDialogue.speaker);
    }
  };

  const triggerSparkleBurst = (x?: number, y?: number) => {
    sound.playSuccessFanfare();
    const colors = ['#EF4444', '#3B82F6', '#EAB308', '#10B981', '#A855F7', '#EC4899', '#F97316'];
    const newSparkles = Array.from({ length: 14 }).map((_, i) => ({
      id: Date.now() + i,
      x: x ?? 20 + Math.random() * 60,
      y: y ?? 25 + Math.random() * 50,
      color: colors[i % colors.length],
    }));
    setSparkles((prev) => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => !newSparkles.some((ns) => ns.id === s.id)));
    }, 1800);
  };

  const handleItemClick = (item: ClassroomItem) => {
    if (item.soundType === 'pop') sound.playPop();
    else if (item.soundType === 'boing') sound.playBoing();
    else if (item.soundType === 'sparkle') sound.playSparkle();
    else sound.playChime();

    setSelectedItem(item);

    if (voiceEnabled) {
      speakDialogue(
        `Look! That's the ${item.name}! It is bright ${item.colorName}!`,
        currentDialogue.speaker === 'mia' ? 'mia' : 'leo'
      );
    }

    if (onColorSelect) {
      const match = COLORS.find((c) => c.name.toLowerCase() === item.colorName.toLowerCase());
      if (match) onColorSelect(match.id);
    }
  };

  // Camera transform classes based on cameraMode
  const getCameraStyle = () => {
    switch (cameraMode) {
      case 'mia':
        return 'scale-125 translate-x-[12%] translate-y-[-5%]';
      case 'leo':
        return 'scale-125 -translate-x-[12%] translate-y-[-5%]';
      case 'rainbow':
        return 'scale-110 translate-y-[8%]';
      default:
        return 'scale-100 translate-x-0 translate-y-0';
    }
  };

  return (
    <div className={`w-full transition-all duration-300 ${isTheater ? 'fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4' : ''}`}>
      {/* 16:9 Educational Video Stage Container */}
      <div className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-200/80 bg-slate-900 relative">
        {/* Aspect Ratio 16:9 Viewport */}
        <div className="relative aspect-video w-full overflow-hidden select-none">
          {/* Moving Camera Layer */}
          <div
            className={`w-full h-full relative transition-transform duration-1000 ease-out ${getCameraStyle()}`}
          >
            {/* Primary Visual 1: Classroom Background with Rainbow */}
            <img
              src={ASSET_IMAGES.hero}
              alt="Magical classroom with colorful balloons, rainbow and preschool characters Mia and Leo"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              referrerPolicy="no-referrer"
            />

            {/* Subtle Animated Rainbow Glimmer Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-amber-100/10" />

            {/* Animated Floating Balloons in Classroom */}
            <div className="absolute top-[8%] left-[6%] animate-bounce [animation-duration:4s] pointer-events-auto cursor-pointer"
                 onClick={() => { sound.playPop(); triggerSparkleBurst(8, 20); }}
                 title="Pop the red balloon!">
              <div className="w-10 h-13 sm:w-14 sm:h-18 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 shadow-lg relative flex items-center justify-center text-white/90">
                <span className="text-xs font-bold drop-shadow">Red</span>
                {/* String */}
                <div className="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-amber-800/40 transform -translate-x-1/2" />
              </div>
            </div>

            <div className="absolute top-[12%] right-[8%] animate-bounce [animation-duration:5s] [animation-delay:1s] pointer-events-auto cursor-pointer"
                 onClick={() => { sound.playPop(); triggerSparkleBurst(88, 22); }}
                 title="Pop the blue balloon!">
              <div className="w-10 h-13 sm:w-14 sm:h-18 rounded-full bg-gradient-to-tr from-blue-600 to-sky-300 shadow-lg relative flex items-center justify-center text-white/90">
                <span className="text-xs font-bold drop-shadow">Blue</span>
                <div className="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-amber-800/40 transform -translate-x-1/2" />
              </div>
            </div>

            <div className="absolute top-[6%] left-[32%] animate-bounce [animation-duration:4.5s] [animation-delay:0.5s] pointer-events-auto cursor-pointer"
                 onClick={() => { sound.playPop(); triggerSparkleBurst(32, 16); }}>
              <div className="w-9 h-12 sm:w-12 sm:h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 shadow-lg relative flex items-center justify-center text-amber-950 font-bold text-xs">
                <span>Yellow</span>
                <div className="absolute -bottom-7 left-1/2 w-0.5 h-7 bg-amber-800/40 transform -translate-x-1/2" />
              </div>
            </div>

            <div className="absolute top-[9%] right-[32%] animate-bounce [animation-duration:4.8s] [animation-delay:1.5s] pointer-events-auto cursor-pointer"
                 onClick={() => { sound.playPop(); triggerSparkleBurst(68, 18); }}>
              <div className="w-9 h-12 sm:w-12 sm:h-16 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-300 shadow-lg relative flex items-center justify-center text-white font-bold text-xs">
                <span>Purple</span>
                <div className="absolute -bottom-7 left-1/2 w-0.5 h-7 bg-amber-800/40 transform -translate-x-1/2" />
              </div>
            </div>

            {/* Twinkling Magical Stars */}
            <div className="absolute top-[16%] left-[20%] text-yellow-300 animate-pulse pointer-events-none drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">
              <Star className="w-6 h-6 fill-yellow-300" />
            </div>
            <div className="absolute top-[14%] right-[22%] text-amber-200 animate-pulse [animation-delay:0.7s] pointer-events-none drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">
              <Star className="w-5 h-5 fill-yellow-200" />
            </div>

            {/* Interactive Classroom Items Hotspots */}
            {CLASSROOM_ITEMS.map((item) => {
              const isTargeted = currentDialogue.targetItem === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  style={{ left: `${item.xPercent}%`, top: `${item.yPercent}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 focus:outline-none ${
                    isTargeted
                      ? 'scale-125 z-30 ring-4 ring-yellow-400 ring-offset-2 ring-offset-transparent animate-bounce'
                      : 'hover:scale-110 z-20'
                  }`}
                  aria-label={item.name}
                >
                  <div
                    className="p-1.5 sm:p-2.5 rounded-2xl shadow-xl flex items-center justify-center backdrop-blur-sm transition-all"
                    style={{
                      backgroundColor: `${item.colorHex}dd`,
                      boxShadow: `0 4px 14px ${item.colorHex}66`,
                    }}
                  >
                    <span className="text-lg sm:text-2xl drop-shadow select-none">
                      {item.id.includes('apple') ? '🍎' :
                       item.id.includes('train') ? '🚂' :
                       item.id.includes('star') ? '⭐' :
                       item.id.includes('dino') ? '🦖' :
                       item.id.includes('ball') ? '🏀' :
                       item.id.includes('crayon') ? '🖍️' :
                       item.id.includes('duck') ? '🦆' :
                       item.id.includes('flower') ? '🌸' : '🎈'}
                    </span>
                  </div>

                  {/* Gentle Item Label on Hover or Active Target */}
                  <span
                    className={`absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-md whitespace-nowrap bg-black/80 text-white shadow pointer-events-none transition-opacity ${
                      isTargeted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}

            {/* Central Animated Character Indicators & Waving Overlays */}
            {/* Mia Waving Anchor (Left Center) */}
            <div
              className={`absolute bottom-[16%] left-[34%] -translate-x-1/2 transition-transform duration-300 ${
                currentDialogue.speaker === 'mia' || currentDialogue.speaker === 'both'
                  ? 'scale-105'
                  : 'scale-95 opacity-90'
              }`}
            >
              {/* Animated hand wave indicator & expression halo */}
              {(currentDialogue.speaker === 'mia' || currentDialogue.speaker === 'both') && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-rose-500/90 text-white px-2.5 py-0.5 rounded-full text-xs font-bold font-['Fredoka'] shadow-lg flex items-center gap-1 animate-pulse">
                  <span>Mia is speaking!</span>
                  <span className="inline-block origin-bottom-right animate-[wiggle_1s_ease-in-out_infinite]">👋</span>
                </div>
              )}
            </div>

            {/* Leo Waving Anchor (Right Center) */}
            <div
              className={`absolute bottom-[16%] left-[64%] -translate-x-1/2 transition-transform duration-300 ${
                currentDialogue.speaker === 'leo' || currentDialogue.speaker === 'both'
                  ? 'scale-105'
                  : 'scale-95 opacity-90'
              }`}
            >
              {(currentDialogue.speaker === 'leo' || currentDialogue.speaker === 'both') && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600/90 text-white px-2.5 py-0.5 rounded-full text-xs font-bold font-['Fredoka'] shadow-lg flex items-center gap-1 animate-pulse">
                  <span>Leo is speaking!</span>
                  <span className="inline-block origin-bottom-right animate-[wiggle_1s_ease-in-out_infinite]">👋</span>
                </div>
              )}
            </div>

            {/* Sparkle Particles Layer */}
            {sparkles.map((sp) => (
              <div
                key={sp.id}
                style={{
                  left: `${sp.x}%`,
                  top: `${sp.y}%`,
                  color: sp.color,
                }}
                className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-ping"
              >
                <Sparkles className="w-7 h-7" />
              </div>
            ))}
          </div>

          {/* Subtitle / Dialogue Banner (Preschool Friendly High Contrast) */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 right-4 sm:left-12 sm:right-12 z-30">
            <div className="bg-slate-900/90 backdrop-blur-md border-2 border-amber-300/80 rounded-2xl p-3 sm:p-4 shadow-2xl flex items-center gap-3 sm:gap-4 transition-all">
              {/* Character Avatar Icon */}
              <div className="shrink-0 relative">
                <img
                  src={
                    currentDialogue.speaker === 'mia'
                      ? ASSET_IMAGES.mia
                      : currentDialogue.speaker === 'leo'
                      ? ASSET_IMAGES.leo
                      : ASSET_IMAGES.hero
                  }
                  alt={currentDialogue.speaker}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white object-cover shadow-md"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 font-bold text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full uppercase tracking-wider font-['Fredoka']">
                  {currentDialogue.speaker === 'both' ? 'Mia & Leo' : currentDialogue.speaker}
                </span>
              </div>

              {/* Dialogue Text */}
              <div className="flex-1 min-w-0">
                <div className="text-amber-200 text-xs sm:text-sm font-bold uppercase tracking-wider font-['Fredoka'] flex items-center gap-2">
                  <span>{currentDialogue.speaker === 'mia' ? 'Mia' : currentDialogue.speaker === 'leo' ? 'Leo' : 'Mia & Leo'}</span>
                  {currentDialogue.targetColor && (
                    <span
                      className="px-2 py-0.5 rounded text-white text-[11px] font-semibold"
                      style={{
                        backgroundColor:
                          COLORS.find((c) => c.id === currentDialogue.targetColor)?.hex || '#3B82F6',
                      }}
                    >
                      {currentDialogue.targetColor.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-white text-base sm:text-2xl font-bold font-['Fredoka'] tracking-wide drop-shadow-md line-clamp-2 mt-0.5">
                  “{currentDialogue.text}”
                </p>
              </div>

              {/* Replay Line Button */}
              <button
                type="button"
                onClick={handleReplay}
                title="Hear it again"
                className="shrink-0 p-2 sm:p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold transition-transform active:scale-95 shadow-md flex items-center justify-center"
              >
                <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Player Control Bar */}
        <div className="bg-amber-950/90 text-amber-100 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 border-t border-amber-900/50 select-none">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentLineIndex === 0}
              className="p-2 rounded-lg bg-amber-900/60 hover:bg-amber-900 disabled:opacity-40 transition-colors"
              title="Previous Line"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold transition-all shadow flex items-center gap-1.5"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span className="text-xs sm:text-sm">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-lg bg-amber-900/60 hover:bg-amber-900 transition-colors"
              title="Next Line"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentLineIndex(0);
                setIsPlaying(true);
                sound.playSparkle();
              }}
              className="p-2 rounded-lg bg-amber-900/60 hover:bg-amber-900 transition-colors text-xs flex items-center gap-1"
              title="Start Over"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Restart</span>
            </button>
          </div>

          {/* Episode Dialogue Progress Bar */}
          <div className="flex-1 max-w-xs hidden sm:flex items-center gap-1.5">
            {EPISODE_DIALOGUE.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  sound.playPop();
                  setCurrentLineIndex(idx);
                }}
                className={`h-2 flex-1 rounded-full transition-all ${
                  idx === currentLineIndex
                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] scale-y-125'
                    : idx < currentLineIndex
                    ? 'bg-amber-600'
                    : 'bg-amber-900/80'
                }`}
                title={`Scene ${idx + 1}`}
              />
            ))}
          </div>

          {/* Camera Angles & Speed Controls */}
          <div className="flex items-center gap-2">
            {/* Camera angle toggle */}
            <div className="flex items-center bg-amber-900/60 rounded-lg p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { sound.playPop(); setCameraMode('wide'); }}
                className={`px-2 py-1 rounded transition-colors ${cameraMode === 'wide' ? 'bg-amber-400 text-amber-950 font-bold' : 'text-amber-200 hover:text-white'}`}
                title="Widescreen Classroom View"
              >
                Room
              </button>
              <button
                type="button"
                onClick={() => { sound.playPop(); setCameraMode('mia'); }}
                className={`px-2 py-1 rounded transition-colors ${cameraMode === 'mia' ? 'bg-amber-400 text-amber-950 font-bold' : 'text-amber-200 hover:text-white'}`}
                title="Mia Close-up"
              >
                Mia
              </button>
              <button
                type="button"
                onClick={() => { sound.playPop(); setCameraMode('leo'); }}
                className={`px-2 py-1 rounded transition-colors ${cameraMode === 'leo' ? 'bg-amber-400 text-amber-950 font-bold' : 'text-amber-200 hover:text-white'}`}
                title="Leo Close-up"
              >
                Leo
              </button>
              <button
                type="button"
                onClick={() => { sound.playPop(); setCameraMode('rainbow'); }}
                className={`px-2 py-1 rounded transition-colors ${cameraMode === 'rainbow' ? 'bg-amber-400 text-amber-950 font-bold' : 'text-amber-200 hover:text-white'}`}
                title="Rainbow View"
              >
                Rainbow
              </button>
            </div>

            {/* Sparkle Confetti button */}
            <button
              type="button"
              onClick={() => triggerSparkleBurst()}
              className="p-2 rounded-lg bg-amber-500/30 hover:bg-amber-500/50 text-amber-300 transition-colors"
              title="Celebrate with Sparkles!"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Theater Mode toggle */}
            <button
              type="button"
              onClick={() => setIsTheater(!isTheater)}
              className="p-2 rounded-lg bg-amber-900/60 hover:bg-amber-900 transition-colors"
              title={isTheater ? 'Exit Full Screen' : 'Theater Mode'}
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Item Detail Callout (Interactive Classroom Learning) */}
      {selectedItem && (
        <div className="max-w-5xl mx-auto mt-4 p-4 rounded-2xl bg-white border border-amber-200 shadow-md flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow"
              style={{ backgroundColor: `${selectedItem.colorHex}22` }}
            >
              {selectedItem.id.includes('apple') ? '🍎' :
               selectedItem.id.includes('train') ? '🚂' :
               selectedItem.id.includes('star') ? '⭐' :
               selectedItem.id.includes('dino') ? '🦖' :
               selectedItem.id.includes('ball') ? '🏀' :
               selectedItem.id.includes('crayon') ? '🖍️' :
               selectedItem.id.includes('duck') ? '🦆' :
               selectedItem.id.includes('flower') ? '🌸' : '🎈'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 font-['Fredoka'] text-lg">{selectedItem.name}</h4>
                <span
                  className="px-2 py-0.5 rounded text-white text-xs font-bold"
                  style={{ backgroundColor: selectedItem.colorHex }}
                >
                  {selectedItem.colorName}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">{selectedItem.funFact}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playSparkle();
              if (voiceEnabled) {
                speakDialogue(
                  `${selectedItem.name}! It is colored ${selectedItem.colorName}! ${selectedItem.funFact}`,
                  'mia'
                );
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs flex items-center gap-1 whitespace-nowrap"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Hear Mia Say It</span>
          </button>
        </div>
      )}
    </div>
  );
};
