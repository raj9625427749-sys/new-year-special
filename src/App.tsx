import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/AnimatedPage';
import textConfig from './textConfig';
import celebrationGif from './imgs/loading.gif';
import ActivityPage from './components/ActivityPage';
import ChillZone from './components/ChillZone';
import CardsSection from './components/CardsSection';
import FinalLetter from './components/FinalLetter';
import SparkleOverlay from './components/SnowFall'; 
import './App.css';

// --- YOUR ORIGINAL PARTICLE LOGIC ---
const Particle = ({ color, delay, index }) => {
  const angle = (index * 12) * (Math.PI / 180);
  const velocity = 150 + Math.random() * 150;
  const targetX = Math.cos(angle) * velocity;
  const targetY = Math.sin(angle) * velocity;

  return (
    <motion.div
      className="realistic-particle"
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ 
        x: [0, targetX, targetX * 1.2], 
        y: [0, targetY, targetY + 80], // Gravity pull at the end
        opacity: [1, 1, 0],
        scale: [1, 1.5, 0] 
      }}
      transition={{ 
        duration: 2.5, 
        delay: 2.2 + delay, 
        ease: [0.1, 0.7, 0.3, 1] 
      }}
      style={{ backgroundColor: color }}
    />
  );
};

function App() {
  // Stages: 'intro' -> 'main'
  const [stage, setStage] = useState('intro');
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Show the original Intro for ~6.5 seconds, then go to main
    const introTimer = setTimeout(() => {
      setStage('main');
    }, 6500);

    return () => {
      clearTimeout(introTimer);
    };
  }, []);

  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`app ${stage === 'main' ? 'main-light' : 'stage-dark'}`}>
      <AnimatePresence mode="wait">
        
        {/* TV prologue removed — app now starts at the firecracker intro */}

        {/* 2. YOUR ORIGINAL INTRO ANIMATION */}
        {stage === 'intro' && (
          <motion.div 
            key="original-intro"
            className="ny-master-overlay"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1.2 }}
          >
            <div className="sky-gradient" />
            <div className="stars-field">
              {[...Array(80)].map((_, i) => (
                <div key={i} className="star-blink" style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`
                }} />
              ))}
            </div>

            <motion.div 
              className="realistic-rocket"
              initial={{ bottom: "-10%", left: "45%", opacity: 1 }}
              animate={{ bottom: "55%", left: "50%", opacity: [1, 1, 0] }}
              transition={{ duration: 2.2, ease: "easeOut" }}
            >
              <div className="rocket-spark-tail" />
              <div className="rocket-glow-head" />
            </motion.div>

            <motion.div 
              className="explosion-flash"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0, 2, 2.5] }}
              transition={{ delay: 2.1, duration: 0.8 }}
            />

            <div className="explosion-container">
              {[...Array(45)].map((_, i) => (
                <Particle 
                  key={i} 
                  index={i} 
                  color={i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#FFF" : "#C0C0C0"} 
                  delay={Math.random() * 0.2}
                />
              ))}
            </div>

            <div className="ny-text-reveal">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.6, duration: 1 }}
              >
                <span className="ny-label">{textConfig.animated.nyLabel}</span>
                <h1 className="ny-main-year">{textConfig.animated.nyMainYear}</h1>
                <img src={celebrationGif} alt="celebrate" className="ny-gif" />
                
                <div className="ny-divider">
                   <div className="line" />
                   <div className="diamond" />
                   <div className="line" />
                </div>

                <motion.p 
                  className="ny-subtitle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.2, duration: 1 }}
                >
                  {textConfig.animated.nySubtitle}
                </motion.p>
              </motion.div>

              <motion.div 
                className="ny-bottom-status"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 4.5 }}
              >
                <div className="pulse-dot" />
                <span>{textConfig.animated.nyBottomStatus}</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MAIN CONTENT */}
      {stage === 'main' && (
        <motion.div 
          className="app-main-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <SparkleOverlay />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="page-container"
            >
              {currentPage === 0 && <LandingPage onEnter={() => goToPage(1)} />}
              {currentPage === 1 && <ActivityPage onNext={() => goToPage(2)} />}
              {currentPage === 2 && <ChillZone onNext={() => goToPage(3)} />}
              {currentPage === 3 && <CardsSection onNext={() => goToPage(4)} />}
              {currentPage === 4 && <FinalLetter onRestart={() => setStage('tv')} />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Montserrat:wght@300;600&display=swap');

        /* --- TV STYLES --- */
        .tv-stage {
          position: fixed;
          inset: 0;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
        }
        .tv-frame {
          width: 90%;
          max-width: 900px;
          background: #1a1a1a;
          padding: 15px;
          border-radius: 20px;
          box-shadow: 0 0 50px rgba(0,0,0,1);
        }
        .tv-inner-screen {
          position: relative;
          aspect-ratio: 16/9;
          background: #000;
          overflow: hidden;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tv-gif {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.5;
          filter: contrast(1.2);
        }
        .tv-noise {
          position: absolute;
          inset: 0;
          background: url('https://media.giphy.com/media/oEI9uWUqWMrBK/giphy.gif');
          opacity: 0.05;
          z-index: 2;
          pointer-events: none;
        }
        .tv-text-container {
          position: relative;
          z-index: 3;
          text-align: center;
          color: white;
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(1rem, 4vw, 1.8rem);
          line-height: 1.8;
          text-shadow: 0 0 20px rgba(0,0,0,1);
        }
        .tv-bold-text {
          font-weight: 600;
          color: #FFD700;
        }

        /* --- YOUR ORIGINAL OVERLAY STYLES --- */
        .ny-master-overlay {
          position: fixed;
          inset: 0;
          z-index: 100000;
          background: #020617;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .sky-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%);
        }

        .star-blink {
          position: absolute;
          width: 1px;
          height: 1px;
          background: white;
          border-radius: 50%;
          animation: starPulse 3s infinite ease-in-out;
        }

        .realistic-rocket {
          position: absolute;
          width: 2px;
          height: 60px;
          z-index: 5;
        }
        .rocket-spark-tail {
          height: 100%;
          width: 100%;
          background: linear-gradient(to top, transparent, #fbbf24);
          filter: blur(1px);
        }
        .rocket-glow-head {
          position: absolute;
          top: 0;
          width: 6px;
          height: 6px;
          background: #fff;
          border-radius: 50%;
          transform: translateX(-30%);
          box-shadow: 0 0 15px 4px #fbbf24;
        }

        .explosion-container { position: absolute; z-index: 6; }
        .realistic-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          filter: blur(0.5px);
          box-shadow: 0 0 8px currentColor;
        }
        .explosion-flash {
          position: absolute;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(20px);
          z-index: 4;
        }

        .ny-text-reveal {
          text-align: center;
          z-index: 10;
          color: white;
        }
        .ny-label {
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 6px;
          font-size: 0.75rem;
          color: #94a3b8;
          display: block;
          margin-bottom: 10px;
        }
        .ny-main-year {
          font-family: 'Playfair Display', serif;
          display: inline-block;
          font-size: 8rem;
          line-height: 1;
          margin: 0;
          background: linear-gradient(to bottom, #FFFFFF 40%, #D4AF37 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));
        }
        .ny-gif { display: inline-block; width: 72px; height: 72px; margin-left: 12px; vertical-align: middle; animation: nyGifFloat 1.6s ease-in-out infinite; }
        @keyframes nyGifFloat { 0% { transform: translateY(0); } 50% { transform: translateY(-8px) scale(1.02); } 100% { transform: translateY(0); } }
        .ny-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin: 15px 0;
        }
        .ny-divider .line { width: 50px; height: 1px; background: rgba(212, 175, 55, 0.4); }
        .ny-divider .diamond { width: 6px; height: 6px; background: #D4AF37; transform: rotate(45deg); }

        .ny-subtitle {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.4rem;
          color: #e2e8f0;
        }

        .ny-bottom-status {
          margin-top: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #D4AF37;
        }
        .pulse-dot {
          width: 6px;
          height: 6px;
          background: #D4AF37;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes starPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }

        @media (max-width: 768px) {
          .ny-main-year { font-size: 5rem; }
          .ny-subtitle { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
}

export default App;