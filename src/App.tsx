import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { configureSpeech } from './audio/speech';
import { setMuted } from './audio/sfx';
import { latestWorldIndex } from './state/progress';
import { useGame } from './state/store';
import { AlbumScreen } from './screens/AlbumScreen';
import { BossScreen } from './screens/BossScreen';
import { LessonPlay } from './screens/LessonPlay';
import { MapScreen } from './screens/MapScreen';
import { Onboarding } from './screens/Onboarding';
import { ParentScreen } from './screens/ParentScreen';
import { ReviewPlay } from './screens/ReviewPlay';
import { RewardScreen } from './screens/RewardScreen';
import { HomeScreen } from './screens/HomeScreen';
import { type ShopTab, ShopScreen } from './screens/ShopScreen';

export type Route =
  | { name: 'onboarding' }
  | { name: 'map'; worldIndex?: number; justCompleted?: string }
  | { name: 'lesson'; lessonId: string }
  | { name: 'boss'; worldId: string }
  | { name: 'review' }
  | { name: 'reward'; title: string; stars?: number; coins: number; bonus?: number; streak?: number; message?: string; then: Route; retry?: Route }
  | { name: 'shop'; tab?: ShopTab }
  | { name: 'home' }
  | { name: 'album' }
  | { name: 'parent' };

export type Nav = (route: Route) => void;

export function App() {
  const hasProfile = useGame((s) => !!s.profile);
  const settings = useGame((s) => s.settings);
  const [route, setRoute] = useState<Route>(hasProfile ? { name: 'map' } : { name: 'onboarding' });
  // счётчик, чтобы «Ещё раз» пересоздавал экран урока
  const [visit, setVisit] = useState(0);

  useEffect(() => {
    configureSpeech({ rate: settings.rate, voiceName: settings.voiceName });
    setMuted(settings.muted);
  }, [settings]);

  const nav: Nav = (r) => {
    setVisit((v) => v + 1);
    setRoute(r);
  };

  const screen = (() => {
    switch (route.name) {
      case 'onboarding':
        return <Onboarding nav={nav} />;
      case 'map':
        return <MapScreen nav={nav} worldIndex={route.worldIndex ?? latestWorldIndex(useGame.getState())} justCompleted={route.justCompleted} />;
      case 'lesson':
        return <LessonPlay lessonId={route.lessonId} nav={nav} />;
      case 'boss':
        return <BossScreen worldId={route.worldId} nav={nav} />;
      case 'review':
        return <ReviewPlay nav={nav} />;
      case 'reward':
        return (
          <RewardScreen
            title={route.title}
            stars={route.stars}
            coins={route.coins}
            bonus={route.bonus}
            streak={route.streak}
            message={route.message}
            onMap={() => nav(route.then)}
            onRetry={route.retry ? () => nav(route.retry!) : undefined}
          />
        );
      case 'shop':
        return <ShopScreen nav={nav} initialTab={route.tab} />;
      case 'home':
        return <HomeScreen nav={nav} />;
      case 'album':
        return <AlbumScreen nav={nav} />;
      case 'parent':
        return <ParentScreen nav={nav} />;
    }
  })();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${route.name}-${visit}`}
        style={{ height: '100%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {screen}
      </motion.div>
    </AnimatePresence>
  );
}
