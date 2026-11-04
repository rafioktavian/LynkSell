import { MotionSurface } from '@/components/presentation/MotionSurface';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import FeaturesSection from './FeaturesSection';
import Testimonials from './Testimonials';
import CTABanner from './CTABanner';
import Footer from './Footer';

export default function LynksellLandingClient() {
  return <MotionSurface className="marketing-page bg-surface-soft text-ink">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-3">Lewati navigasi</a>
    <Navbar />
    <main id="main-content"><HeroSection /><HowItWorks /><FeaturesSection /><Testimonials /><CTABanner /></main>
    <Footer />
  </MotionSurface>;
}
