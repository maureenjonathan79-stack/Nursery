/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { ClassroomPlayer } from './components/ClassroomPlayer';
import { ColorExplorer } from './components/ColorExplorer';
import { ColorQuiz } from './components/ColorQuiz';
import { RainbowMixer } from './components/RainbowMixer';
import { COLORS } from './data/episodeData';
import { sound } from './utils/audio';
import { Sparkles, Heart, BookOpen, Smile, Palette, Award, PlayCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'animation' | 'explorer' | 'quiz' | 'mixer'>('animation');
  const [selectedColorId, setSelectedColorId] = useState<string>('red');
  const [isMuted, setIsMuted] = useState(false);
  const [isBgmActive, setIsBgmActive] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    sound.setSoundEnabled(!nextMute);
    if (nextMute) {
      setIsBgmActive(false);
    }
  };

  const handleToggleBgm = () => {
    if (isMuted) {
      setIsMuted(false);
      sound.setSoundEnabled(true);
    }
    const state = sound.toggleBgm();
    setIsBgmActive(state);
  };

  const handleColorPicked = (colorId: string) => {
    setSelectedColorId(colorId);
    setActiveTab('explorer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-white to-orange-50/40 text-slate-800 flex flex-col">
      {/* Top Bar Navigation */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          sound.playPop();
          setActiveTab(tab);
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isBgmActive={isBgmActive}
        onToggleBgm={handleToggleBgm}
      />

      {/* Main Content Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Quick Activity Bar (Segmented Interactive Controls) */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white/90 backdrop-blur rounded-2xl border border-amber-200/70 shadow-sm">
          <div className="flex items-center gap-1.5 p-1 bg-amber-100/60 rounded-xl overflow-x-auto">
            <button
              type="button"
              onClick={() => { sound.playPop(); setActiveTab('animation'); }}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold font-['Fredoka'] rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'animation'
                  ? 'bg-amber-400 text-amber-950 shadow-sm'
                  : 'text-amber-900/80 hover:text-amber-950'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>1. Classroom Episode</span>
            </button>
            <button
              type="button"
              onClick={() => { sound.playPop(); setActiveTab('explorer'); }}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold font-['Fredoka'] rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'explorer'
                  ? 'bg-amber-400 text-amber-950 shadow-sm'
                  : 'text-amber-900/80 hover:text-amber-950'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>2. Color Explorer</span>
            </button>
            <button
              type="button"
              onClick={() => { sound.playPop(); setActiveTab('quiz'); }}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold font-['Fredoka'] rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-amber-400 text-amber-950 shadow-sm'
                  : 'text-amber-900/80 hover:text-amber-950'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>3. Find the Color</span>
            </button>
            <button
              type="button"
              onClick={() => { sound.playPop(); setActiveTab('mixer'); }}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold font-['Fredoka'] rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'mixer'
                  ? 'bg-amber-400 text-amber-950 shadow-sm'
                  : 'text-amber-900/80 hover:text-amber-950'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>4. Rainbow Mixer</span>
            </button>
          </div>

          {/* Voice Speech Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
                voiceEnabled
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-stone-50 text-stone-600 border-stone-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${voiceEnabled ? 'bg-emerald-500' : 'bg-stone-400'}`} />
              <span>{voiceEnabled ? 'Character Voices On' : 'Voices Muted'}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: 16:9 Classroom Animation Experience */}
        {activeTab === 'animation' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Stage Component */}
            <ClassroomPlayer
              voiceEnabled={voiceEnabled}
              onColorSelect={handleColorPicked}
            />

            {/* Quick Color Tray Below Stage */}
            <div className="p-4 bg-white rounded-3xl border border-amber-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-amber-950 font-['Fredoka']">
                  Jump to a Color Lesson:
                </span>
                <span className="text-xs text-amber-900/60">
                  Tap any color to inspect in Explorer
                </span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleColorPicked(c.id)}
                    className="p-2 rounded-2xl flex flex-col items-center justify-center gap-1 hover:scale-105 transition-all text-white font-['Fredoka'] shadow-sm"
                    style={{ backgroundColor: c.hex }}
                  >
                    <span className="text-base sm:text-lg">{c.emoji}</span>
                    <span className="text-[11px] sm:text-xs font-bold truncate max-w-full">
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Color Explorer */}
        {activeTab === 'explorer' && (
          <div className="animate-in fade-in">
            <ColorExplorer
              selectedColorId={selectedColorId}
              onSelectColor={(id) => setSelectedColorId(id)}
              voiceEnabled={voiceEnabled}
            />
          </div>
        )}

        {/* Tab 3: Find the Color Minigame */}
        {activeTab === 'quiz' && (
          <div className="animate-in fade-in">
            <ColorQuiz voiceEnabled={voiceEnabled} />
          </div>
        )}

        {/* Tab 4: Magical Rainbow Mixer */}
        {activeTab === 'mixer' && (
          <div className="animate-in fade-in">
            <RainbowMixer voiceEnabled={voiceEnabled} />
          </div>
        )}

        {/* Educational Framework Guide for Teachers & Parents */}
        <section className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-['Fredoka'] text-amber-950">
                Preschool Color Literacy & Early Learning Milestones
              </h3>
              <div className="flex items-center gap-2 text-xs text-amber-900/60 font-medium">
                <span>Ages 2–6</span>
                <span aria-hidden="true">·</span>
                <span>Visual Discrimination</span>
                <span aria-hidden="true">·</span>
                <span>Audio-Visual Association</span>
                <span aria-hidden="true">·</span>
                <span>Spatial Cognition</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1.5">
              <h4 className="font-bold text-amber-950 font-['Fredoka'] text-sm">
                Primary & Secondary Colors
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Children first recognize bold primary hues (Red, Blue, Yellow) before grasping secondary blends (Green, Orange, Purple) through natural play and mixing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1.5">
              <h4 className="font-bold text-amber-950 font-['Fredoka'] text-sm">
                Auditory Reinforcement
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mia and Leo speak each color with clear, expressive articulation and melodic rhymes to strengthen phonological awareness and vocabulary retention.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1.5">
              <h4 className="font-bold text-amber-950 font-['Fredoka'] text-sm">
                Tactile & Visual Exploration
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clicking classroom objects bridges real-world items (apples, trains, balloons, dinosaurs) with color concepts in an encouraging, low-stakes environment.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="w-full border-t border-amber-200/60 bg-white py-6 mt-12 text-center text-xs text-amber-900/70">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold font-['Fredoka'] text-amber-950">Colors Adventure</span>
            <span aria-hidden="true">·</span>
            <span>Featuring Mia & Leo</span>
          </div>
          <div className="flex items-center gap-4 text-amber-900/60">
            <span>Preschool Learning Animation</span>
            <span aria-hidden="true">·</span>
            <span>Web Audio Synthesizer</span>
            <span aria-hidden="true">·</span>
            <span>16:9 Production Format</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
