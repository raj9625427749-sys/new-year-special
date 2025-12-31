import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import textConfig from "../textConfig";
import pic1 from '../imgs/pic1.jpg';
import lastImg from '../imgs/last.jpg';
import Loadinggif from '../imgs/loading.gif';

interface FinalLetterProps {
  onRestart: () => void;
}

export default function FinalLetter({ onRestart }: FinalLetterProps) {
  // 'locked' | 'igniting' | 'letter' | 'sealed'
  const [stage, setStage] = useState<'locked' | 'igniting' | 'letter' | 'sealed'>('locked');
  const [progress, setProgress] = useState(0); // Track fake loading
  const [typedText, setTypedText] = useState("");
  const typingTimerRef = useRef<number | null>(null);

  // Fake Loading Logic
  useEffect(() => {
    if (stage === 'igniting') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStage('letter'), 500); // Small pause at 100%
            return 100;
          }
          return prev + 1; // Adjust speed here
        });
      }, 30); // ~3 seconds total loading time
      return () => clearInterval(interval);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'sealed') {
      const str = textConfig.finalLetter && textConfig.finalLetter.typedFullMessage ? textConfig.finalLetter.typedFullMessage : "Happy New Year!";
      let i = 0;
      setTypedText("");
      typingTimerRef.current = window.setInterval(() => {
        i += 1;
        setTypedText(str.slice(0, i));
        if (i >= str.length && typingTimerRef.current) {
          window.clearInterval(typingTimerRef.current);
        }
      }, 50);
    }
    return () => {
      if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);
    };
  }, [stage]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-8 px-4 relative overflow-auto" style={{ backgroundColor: '#FFF3E0' }}>
          <div className="relative w-full max-w-full overflow-hidden pointer-events-none">
            <div aria-hidden className="animated-bg" />
            {/* --- BACKGROUND DECORATIONS (clipped to wrapper) --- */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] z-50 bg-[url('https://res.cloudinary.com/dyd911y6h/image/upload/v1637050504/noise_o9vvp7.png')]" />
              <motion.div 
                animate={{ x: [0, 30, 0], y: [0, -18, 0], scale: [1, 1.06, 1] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-12 -left-12 w-[48%] h-[48%] bg-orange-50/40 blur-[80px] rounded-full" 
              />
              <motion.div 
                animate={{ x: [0, -30, 0], y: [0, 18, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-12 -right-12 w-[48%] h-[48%] bg-blue-50/30 blur-[80px] rounded-full" 
              />
            </div>
          </div>

      <AnimatePresence mode="wait">
        {stage === 'locked' && (
          <motion.div
            key="locked"
            exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
            className="z-20 text-center flex flex-col items-center"
          >
            <div className="relative mb-12">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-48 h-48 rounded-full border border-dashed border-[#D4AF37]/40 flex items-center justify-center"
              >
                <div className="w-40 h-40 rounded-full border border-[#D4AF37]/10" />
              </motion.div>

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-44 h-44 sm:w-56 sm:h-56 rounded-2xl overflow-hidden drop-shadow-2xl bg-white/40 flex items-center justify-center"
                >
                  <img src={lastImg} alt="final" className="w-full h-full object-cover" />
                </motion.div>

                {/* sparkle GIF removed from locked screen - moved to loading screen */}
              </div>
            </div>

            <h1 className="text-[#4A4341] font-display text-3xl md:text-4xl mb-2 tracking-tight">Ready for 2026?</h1>
            <p className="font-hand text-xl text-gray-400 mb-10 italic">A new chapter is waiting to be written...</p>

            <button
              onClick={() => setStage('igniting')}
              className="group relative px-10 py-4 bg-white border-2 border-[#D4AF37] text-[#D4AF37] font-bold rounded-full transition-all hover:bg-[#D4AF37] hover:text-white shadow-[0_10px_20px_rgba(212,175,55,0.1)] active:scale-95"
            >
              <span className="relative z-10 tracking-[0.2em] uppercase text-xs flex items-center gap-2">
                Ignite the Spark <span className="material-icons-round text-sm">flare</span>
              </span>
            </button>
          </motion.div>
        )}

        {stage === 'igniting' && (
          /* --- UPDATED STAGE 2: LOADING PROGRESS --- */
          <motion.div 
            key="igniting" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-50 flex flex-col items-center justify-center text-center"
          >
            <div className="mb-6">
              <div className="w-12 h-12">
                <img src={Loadinggif} alt="loading" className="w-full h-full object-contain" />
              </div>
            </div>
            
            <p className="text-[#4A4341] font-hand text-2xl mb-4 italic">
              {textConfig.finalLetter && textConfig.finalLetter.loadingText ? textConfig.finalLetter.loadingText : 'closing 2025 with good note...'}
            </p>
            
            {/* Progress Bar Container */}
            <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden mb-4">
                <motion.div 
                    className="h-full bg-[#D4AF37]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                />
            </div>
            
            <p className="text-[#D4AF37] font-bold text-[10px] tracking-[0.3em] uppercase">
                preparing something for 2026: {progress}%
            </p>
          </motion.div>
        )}

        {stage === 'letter' && (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl bg-[#FFFDF9] rounded-[2rem] shadow-[0_16px_40px_rgba(0,0,0,0.03)] border border-white overflow-hidden relative group/letter"
          >
             <div className="absolute inset-0 group-hover/letter:center-glow transition-all duration-700 pointer-events-none" />

            <div className="w-full h-48 md:h-64 overflow-hidden relative">
              <img src={pic1} alt="Memories" className="w-full h-full object-cover saturate-[0.8] contrast-[1.05]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF9] via-transparent to-transparent" />
            </div>

            <div className="p-6 md:p-10 relative">
              <div className="relative z-10">
                <div className="text-center mb-12">
                  <span className="font-hand text-2xl text-[#D4AF37] block mb-1">{textConfig.finalLetter.letterGreeting}</span>
                  <h2 className="text-3xl md:text-4xl font-display text-[#4A4341]">{textConfig.finalLetter.title}</h2>
                </div>

                <div className="font-hand text-xl md:text-2xl text-[#5A5250] leading-relaxed space-y-6">
                  {textConfig.finalLetter.letterParagraphs.map((para: string, idx: number) => (
                    <p key={idx} className="relative group/text cursor-default">
                      {para}
                    </p>
                  ))}
                </div>

                <div className="mt-14 pt-6 border-t border-[#F0E6D6] flex flex-col sm:flex-row gap-6 items-center justify-between">
                   <button
                        onClick={() => setStage('sealed')}
                        className="px-10 py-4 bg-[#4A4341] text-white font-bold rounded-full shadow-xl hover:bg-[#D4AF37] transition-all flex items-center gap-2 text-xs tracking-widest uppercase"
                      >
                        {textConfig.finalLetter.sealButton} <span className="material-icons-round text-sm">lock_open</span>
                      </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'sealed' && (
          <motion.div
            key="sealed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center z-20 max-w-md"
          >
            <h2 className="text-4xl md:text-5xl font-display text-[#4A4341] mb-8">{textConfig.finalLetter.sealedTitle}</h2>
            <div className="bg-white/90 backdrop-blur-md p-10 rounded-[2rem] shadow-[0_10px_30px_rgba(212,175,55,0.1)] border border-white mb-12">
               <div className="font-hand text-3xl md:text-4xl text-[#D4AF37]">
                 {typedText}
               </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-12 py-5 bg-transparent border-2 border-[#4A4341] text-[#4A4341] font-bold rounded-full hover:bg-[#4A4341] hover:text-white transition-all tracking-[0.3em] uppercase text-[10px]"
            >
              Restart the Journey
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Mountains+of+Christmas:wght@700&display=swap');
        .font-hand { font-family: 'Caveat', cursive; }
        .font-display { font-family: 'Mountains of Christmas', cursive; }
        .animated-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(closest-side at 25% 35%, rgba(255,222,179,0.08), transparent 10%),
                      radial-gradient(closest-side at 75% 65%, rgba(255,240,200,0.06), transparent 14%);
          filter: blur(44px);
          animation: bgSway 22s ease-in-out infinite;
        }
        @keyframes bgSway {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(-28px,18px,0) scale(1.04); }
        }
      `}</style>
    </div>
  );
}