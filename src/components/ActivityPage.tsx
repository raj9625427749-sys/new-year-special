import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Theme & Configuration ---
const theme = {
  primary: "#D32F2F",    // Festive Red
  secondary: "#1976D2",  // Winter Blue
  paper: "#F5F5DC",      // Beige Paper
  background: "#FFF3E0", // Match AnimatedPage backgroundLight
  gold: "#FFD700",
};

// Bucket list will be provided by textConfig
// @ts-ignore
import textConfig from "../textConfig";
const bucketListItems = textConfig.activity && textConfig.activity.bucketList ? textConfig.activity.bucketList : [];

type ActivityPageProps = {
  onNext?: () => void;
};

const ActivityPage = ({ onNext }: ActivityPageProps) => {
  const [snowflakes, setSnowflakes] = useState<any[]>([]);

  // --- Snow Effect ---
  useEffect(() => {
    const flakes = ["❄", "❅", "❆"];
    const initialSnow = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      char: flakes[Math.floor(Math.random() * flakes.length)],
      left: Math.random() * 100 + "%",
      fontSize: Math.random() * 10 + 12 + "px",
      duration: Math.random() * 5 + 7 + "s",
      delay: Math.random() * 5 + "s",
    }));
    setSnowflakes(initialSnow);
  }, []);

  const handleStartCard = () => {
    onNext?.();
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col items-center justify-center p-4 relative overflow-hidden" 
         style={{ backgroundColor: theme.background }}>
      
      {/* Visual Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />

      {/* Snowfall */}
      {snowflakes.map((f) => (
        <div key={f.id} className="snowflake" style={{ 
            left: f.left, fontSize: f.fontSize, 
            animationDuration: f.duration, animationDelay: f.delay,
            color: 'white', opacity: 0.6 
        }}>{f.char}</div>
      ))}

      <AnimatePresence mode="wait">
        {/* BUCKET LIST */}
        (
          <motion.div
            key="bucket"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            className="w-full max-w-md bg-[#FDFCF0] p-8 md:p-10 rounded-sm shadow-2xl border-[12px] border-white relative"
          >
            {/* Vintage Header */}
            <div className="text-center mb-8">
              <h2 className="font-display text-4xl text-[#5a433f]">{textConfig.activity.bucketHeading}</h2>
              <h3 className="font-handwriting text-3xl text-[#D32F2F] -mt-2">Bucket List</h3>
            </div>

            {/* List Items */}
            <ul className="space-y-5 mb-10">
              {bucketListItems.map((item, i) => (
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex items-center gap-4 font-handwriting text-2xl text-[#4a433f] border-b border-[#eee6d8] pb-2"
                >
                  <span className="w-6 h-6 border-2 border-[#D32F2F] rounded-sm flex-shrink-0"></span>
                  {item}
                </motion.li>
              ))}
            </ul>

            {/* Are You Ready Section */}
            <div className="text-center border-t-2 border-dashed border-[#d1c7b7] pt-8">
              <p className="font-serif italic text-[#5a433f] mb-6">{textConfig.activity.readyPrompt}</p>
              <button
                onClick={handleStartCard}
                className="group bg-[#D32F2F] text-white px-12 py-3 rounded-full shadow-lg hover:scale-105 transition-all font-bold tracking-[0.2em] flex items-center gap-2 mx-auto"
              >
                {textConfig.activity.continueButton}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 12h14"></path>
                </svg>
              </button>
            </div>

            {/* Decorative Corner */}
            <div className="absolute -top-4 -right-4 w-16 h-16 opacity-20 border-t-4 border-r-4 border-[#D32F2F]"></div>
          </motion.div>

      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;700&family=Mountains+of+Christmas:wght@400;700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');

        .font-handwriting { font-family: 'Dancing Script', cursive; }
        .font-display { font-family: 'Mountains of Christmas', cursive; }
        .font-serif { font-family: 'Playfair Display', serif; }

        .perspective-1000 { perspective: 1000px; }
        .rotate-x-180 { transform: rotateX(180deg); }
        .envelope-flap-clip { clip-path: polygon(0 0, 50% 100%, 100% 0); }

        @keyframes slideUp {
          0% { transform: translate(-50%, 0) scale(0.9); opacity: 0; }
          100% { transform: translate(-50%, -240px) scale(1); opacity: 1; }
        }
        .card-animation {
          animation: slideUp 1.5s 2s forwards cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes snowFall {
          0% { transform: translateY(-10vh); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .snowflake { position: absolute; top: -20px; animation: snowFall linear infinite; pointer-events: none; }

        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-sway { animation: sway 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default ActivityPage;