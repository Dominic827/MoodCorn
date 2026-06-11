import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import About from './pages/About';
import LogoIntro from './components/animations/LogoIntro';

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('moodcorn_intro_seen');
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem('moodcorn_intro_seen', 'true');
    setShowIntro(false);
  };

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {showIntro ? (
          <LogoIntro key="intro" onComplete={handleIntroComplete} />
        ) : (
          <div key="app" className="min-h-screen bg-bg-primary flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            <Footer />
          </div>
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
