import '../styles/landing.css';
import AnimatedBackground from '../components/landing/AnimatedBackground';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import StatsBar from '../components/landing/StatsBar';
import AboutSection from '../components/landing/AboutSection';
import HowItWorks from '../components/landing/HowItWorks';
import FeaturesSection from '../components/landing/FeaturesSection';
import DashboardShowcase from '../components/landing/DashboardShowcase';
import ImageSlider from '../components/landing/ImageSlider';
import SecuritySection from '../components/landing/SecuritySection';
import WhyChooseUs from '../components/landing/WhyChooseUs';
import BenefitsSection from '../components/landing/BenefitsSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTAFooter from '../components/landing/CTAFooter';

const LandingPage = () => (
  <div className="relative min-h-screen bg-surface-50 overflow-x-hidden">
    <AnimatedBackground />
    <Navbar />
    <HeroSection />
    <StatsBar />
    <AboutSection />
    <HowItWorks />
    <FeaturesSection />
    <DashboardShowcase />
    <ImageSlider />
    <SecuritySection />
    <WhyChooseUs />
    <BenefitsSection />
    <TestimonialsSection />
    <CTAFooter />
  </div>
);

export default LandingPage;
