import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { GameCanvasSimple } from './components/GameCanvasSimple';
import { LeaderboardSection } from './components/LeaderboardSection';
import { StatsSection } from './components/StatsSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <GameCanvasSimple />
        <LeaderboardSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
