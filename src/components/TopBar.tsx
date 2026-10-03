import React from 'react';
import { Volume2, VolumeX, Music, Maximize2, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface TopBarProps {
  activeTab: 'animation' | 'explorer' | 'quiz' | 'mixer';
  onSelectTab: (tab: 'animation' | 'explorer' | 'quiz' | 'mixer') => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isBgmActive: boolean;
  onToggleBgm: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  isMuted,
  onToggleMute,
  isBgmActive,
  onToggleBgm,
}) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-amber-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('animation');
            }}
            className="text-xl sm:text-2xl font-bold tracking-tight text-amber-900 font-['Fredoka'] hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <span>Colors Adventure with Mia & Leo</span>
          </a>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-amber-950/70">
          <button
            onClick={() => onSelectTab('animation')}
            className={`transition-colors hover:text-amber-900 ${
              activeTab === 'animation'
                ? 'text-amber-900 underline underline-offset-8 decoration-2 decoration-amber-500 font-bold'
                : ''
            }`}
          >
            Classroom Episode
          </button>
          <button
            onClick={() => onSelectTab('explorer')}
            className={`transition-colors hover:text-amber-900 ${
              activeTab === 'explorer'
                ? 'text-amber-900 underline underline-offset-8 decoration-2 decoration-amber-500 font-bold'
                : ''
            }`}
          >
            Color Explorer
          </button>
          <button
            onClick={() => onSelectTab('quiz')}
            className={`transition-colors hover:text-amber-900 ${
              activeTab === 'quiz'
                ? 'text-amber-900 underline underline-offset-8 decoration-2 decoration-amber-500 font-bold'
                : ''
            }`}
          >
            Find the Color
          </button>
          <button
            onClick={() => onSelectTab('mixer')}
            className={`transition-colors hover:text-amber-900 ${
              activeTab === 'mixer'
                ? 'text-amber-900 underline underline-offset-8 decoration-2 decoration-amber-500 font-bold'
                : ''
            }`}
          >
            Rainbow Mixer
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleBgm}
            title={isBgmActive ? 'Stop Playful Music' : 'Play Playful Music'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              isBgmActive
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isBgmActive ? 'Music On' : 'Music Off'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile subnavigation */}
      <div className="flex md:hidden items-center justify-around border-t border-amber-100 py-2 px-2 bg-amber-50/50 text-xs font-medium">
        <button
          onClick={() => onSelectTab('animation')}
          className={`px-2 py-1 rounded ${activeTab === 'animation' ? 'bg-amber-200 text-amber-950 font-bold' : 'text-amber-900/80'}`}
        >
          Episode
        </button>
        <button
          onClick={() => onSelectTab('explorer')}
          className={`px-2 py-1 rounded ${activeTab === 'explorer' ? 'bg-amber-200 text-amber-950 font-bold' : 'text-amber-900/80'}`}
        >
          Colors
        </button>
        <button
          onClick={() => onSelectTab('quiz')}
          className={`px-2 py-1 rounded ${activeTab === 'quiz' ? 'bg-amber-200 text-amber-950 font-bold' : 'text-amber-900/80'}`}
        >
          Find Game
        </button>
        <button
          onClick={() => onSelectTab('mixer')}
          className={`px-2 py-1 rounded ${activeTab === 'mixer' ? 'bg-amber-200 text-amber-950 font-bold' : 'text-amber-900/80'}`}
        >
          Mixer
        </button>
      </div>
    </header>
  );
};
