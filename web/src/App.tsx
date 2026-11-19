import React, { useEffect, useState } from 'react';
import { DemosLabView } from './components/DemosLabView';
import { LearningResourcesHub } from './components/LearningResourcesHub';
import { Navbar } from './components/Navbar';
import { PrintPdfDeckView } from './components/PrintPdfDeckView';
import { SlideDeckView } from './components/SlideDeckView';
import { DemoExecutionMode, NavView } from './types/presentation';
import { soundEngine } from './utils/soundEngine';

export const App: React.FC = () => {
  const defaultMode =
    (import.meta.env.VITE_DEFAULT_DEMO_MODE as DemoExecutionMode | undefined) === 'live'
      ? 'live'
      : 'prerecorded';

  const [activeView, setActiveView] = useState<NavView>('deck');
  const [demoMode, setDemoMode] = useState<DemoExecutionMode>(defaultMode);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [cinemaMode, setCinemaMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundEngine.enabled = next;
      if (next) {
        soundEngine.playSlideTransition('next');
      } else {
        soundEngine.stopSlide1Overture();
      }
      return next;
    });
  };

  const toggleDemoMode = () => {
    setDemoMode((m) => (m === 'prerecorded' ? 'live' : 'prerecorded'));
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (e.key.toLowerCase() === 'm') {
        toggleSound();
      } else if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setActiveView((v) => (v === 'pdf' ? 'deck' : 'pdf'));
      } else if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setCinemaMode((c) => !c);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const hideTopNav = activeView === 'deck' && (cinemaMode || isFullscreen);

  return (
    <div className="min-h-screen w-full flex flex-col">
      {!hideTopNav && (
        <Navbar
          activeView={activeView}
          onSelectView={setActiveView}
          demoMode={demoMode}
          onToggleDemoMode={toggleDemoMode}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          cinemaMode={cinemaMode}
          onToggleCinemaMode={() => setCinemaMode((c) => !c)}
        />
      )}

      <main className="flex-1 w-full flex flex-col">
        {activeView === 'deck' && (
          <SlideDeckView
            demoMode={demoMode}
            onToggleDemoMode={toggleDemoMode}
            onOpenPdfView={() => setActiveView('pdf')}
            onSelectView={setActiveView}
            cinemaMode={cinemaMode || isFullscreen}
            onToggleCinemaMode={() => setCinemaMode((c) => !c)}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
          />
        )}
        {activeView === 'demos' && (
          <DemosLabView demoMode={demoMode} onToggleDemoMode={toggleDemoMode} />
        )}
        {activeView === 'resources' && <LearningResourcesHub />}
        {activeView === 'pdf' && (
          <PrintPdfDeckView
            demoMode={demoMode}
            onBackToDeck={() => setActiveView('deck')}
          />
        )}
      </main>
    </div>
  );
};

export default App;
