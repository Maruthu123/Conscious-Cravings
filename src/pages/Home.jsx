import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import WhyUs from '../components/WhyUs';
import Menu from '../components/Menu';
import About from '../components/About';
import InstagramSection from '../components/InstagramSection';
import Contact from '../components/Contact';

export default function Home() {
  const location = useLocation();

  // Supports Header's cross-page "scroll to section" links.
  useEffect(() => {
    const id = location.state?.scrollTo;
    if (id) {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [location.state]);

  return (
    <main>
      <Hero />
      <WhyUs />
      <Menu />
      <About />
      <InstagramSection />
      <Contact />
    </main>
  );
}
