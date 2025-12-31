import { useEffect, useState } from "react";
// @ts-ignore
import textConfig from "../textConfig";
import Intro1 from "../imgs/intro1.png";
import Intro2 from "../imgs/intro2.png";

const themeConfig = {
  colors: {
    primary: "#D32F2F",
    backgroundLight: "#FFF3E0",
    paperLight: "#F5F5DC",
    accentGold: "#FFD700",
    redMedium: "#991b1b",
    redBright: "#dc2626",
  },
  fonts: {
    display: "'Mountains of Christmas', cursive",
    body: "'Caveat', cursive",
    serif: "'Merriweather', serif",
  },
};

type AnimatedPageProps = {
  onEnter?: () => void;
};

const AnimatedPage = ({ onEnter }: AnimatedPageProps) => {
  const [snowflakes, setSnowflakes] = useState<any[]>([]);

  useEffect(() => {
    // Inject Material Icons Font as a backup
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    link.rel = "stylesheet";
    document.head.appendChild(link);

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

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center overflow-hidden relative px-4"
      style={{ backgroundColor: themeConfig.colors.backgroundLight, fontFamily: themeConfig.fonts.serif }}
    >
      <style>{`
        .font-display { font-family: ${themeConfig.fonts.display}; }
        .font-body { font-family: ${themeConfig.fonts.body}; }

        .envelope-flap-clip {
           clip-path: polygon(0 0, 50% 100%, 100% 0);
        }

        @keyframes openEnvelope {
            0% { transform: rotateX(0deg); z-index: 40; }
            100% { transform: rotateX(180deg); z-index: 1; }
        }
        .animate-open-envelope {
            animation: openEnvelope 1.8s forwards ease-in-out;
            transform-origin: top;
        }

        @keyframes slideUpCard {
            0% { transform: translate(-50%, 0) scale(0.9); opacity: 0; }
            100% { transform: translate(-50%, var(--slide-dist)) scale(1); opacity: 1; }
        }
        
        .card-animation {
            --slide-dist: -240px; 
            animation: slideUpCard 1.5s 0.8s forwards cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @media (min-width: 768px) {
            .card-animation { --slide-dist: -320px; }
        }

        @keyframes fadeInBtn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-btn {
            animation: fadeInBtn 0.8s 2.4s forwards;
            opacity: 0;
        }

        @keyframes snowFall {
            0% { transform: translateY(-10vh); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
        .snowflake {
            position: absolute;
            top: -20px;
            animation: snowFall linear infinite;
        }
      `}</style>

      {/* Snow Particles */}
      {snowflakes.map((f) => (
        <div key={f.id} className="snowflake" style={{ 
            left: f.left, fontSize: f.fontSize, 
            animationDuration: f.duration, animationDelay: f.delay,
            color: 'white', opacity: 0.7 
        }}>{f.char}</div>
      ))}

      {/* Main Container */}
      <div className="relative w-full max-w-[400px] mt-40">
        
        {/* --- THE CARD --- */}
        <div 
          className="card-animation absolute left-1/2 w-[92%] sm:w-[360px] h-[400px] sm:h-[480px] rounded-lg shadow-2xl z-20 flex flex-col items-center p-4 sm:p-8 text-center border-4 border-double opacity-0"
          style={{ backgroundColor: themeConfig.colors.paperLight, borderColor: themeConfig.colors.primary }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>
          
          <img 
            src={Intro1}
            alt="Decoration"
            className="absolute -top-6 -left-6 w-20 h-20 object-contain z-30 drop-shadow-md"
          />

          <div className="relative z-20 flex flex-col h-full justify-between items-center w-full">
            <div className="pt-2">
              <h1 className="font-display text-3xl sm:text-4xl font-bold" style={{ color: themeConfig.colors.primary }}>
                {textConfig.animated?.cardTitle ?? textConfig.landing?.title ?? textConfig.animated?.nyLabel ?? "Welcome"}
              </h1>
              <p className="font-body text-xl sm:text-2xl text-gray-600">{textConfig.animated?.cardSubtitle ?? textConfig.landing?.subtitle ?? textConfig.animated?.nySubtitle ?? ""}</p>
            </div>
            
            <div className="flex-grow flex items-center justify-center relative w-full my-2">
              <div className="relative w-36 h-36 sm:w-48 sm:h-48 bg-amber-100/40 rounded-full flex items-center justify-center border-2 border-dashed border-amber-300">
                <img
                  alt="Center Decor"
                  className="w-28 h-28 sm:w-36 sm:h-36 object-contain"
                  src="https://cdn-icons-png.flaticon.com/512/2378/2378030.png"
                />
              </div>
              
              <img 
                src={Intro2}
                className="absolute -bottom-2 -right-2 w-16 h-16 object-contain animate-bounce"
                alt="Gift"
              />
            </div>
            
            <div className="w-full border-t border-gray-300 pt-4 pb-2">
               <p className="font-body text-2xl sm:text-3xl text-gray-800 leading-tight">
                {textConfig.animated?.cardLastLine ?? textConfig.landing?.lastLine ?? textConfig.animated?.nyBottomStatus ?? ""}
              </p>
               <div className="flex items-center justify-center gap-2 mt-2 px-2">
               <span className="h-[1px] w-8 bg-gray-400 flex-shrink-0"></span>
               <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest max-w-[70%] whitespace-normal break-words text-center">
                 {textConfig.animated?.cardFooter ?? textConfig.landing?.footer ?? ""}
               </p>
               <span className="h-[1px] w-8 bg-gray-400 flex-shrink-0"></span>
              </div>
            </div>
          </div>
        </div>

        {/* --- ENVELOPE --- */}
        <div className="relative w-full aspect-[4/3] perspective-1000">
          <div className="absolute inset-0 rounded-lg z-10 shadow-inner" style={{ backgroundColor: themeConfig.colors.redMedium }}></div>

          <div className="absolute inset-0 z-30 rounded-b-lg shadow-xl overflow-hidden flex items-end justify-center border-b-2 border-x-2" 
               style={{ backgroundColor: themeConfig.colors.redBright, borderColor: themeConfig.colors.redMedium }}>
            <div className="absolute bottom-0 w-full h-0 border-l-[150px] sm:border-l-[200px] border-r-[150px] sm:border-r-[200px] border-b-[120px] sm:border-b-[160px] border-l-transparent border-r-transparent pointer-events-none" 
                 style={{ borderBottomColor: themeConfig.colors.redBright }}></div>
            <div className="z-40 mb-4 text-white/60 font-display text-lg tracking-widest uppercase">Greetings</div>
          </div>

          <div className="absolute top-0 w-full h-1/2 z-40 origin-top">
             <div className="w-full h-full rounded-t-lg envelope-flap-clip animate-open-envelope shadow-md border-t-2" 
                  style={{ backgroundColor: themeConfig.colors.redBright, borderColor: themeConfig.colors.redMedium }}></div>
          </div>
        </div>

        {/* --- CONTINUE BUTTON (SVG FIXED) --- */}
        <div className="absolute -bottom-28 left-0 w-full flex justify-center animate-fade-in-btn z-50">
          <button 
            onClick={() => onEnter?.()}
            className="group bg-[#D32F2F] text-white font-bold py-4 px-12 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-3 border-2 border-white/20"
          >
            <span className="tracking-[0.15em] text-sm">CONTINUE</span>
            {/* Replaced text with SVG for guaranteed visibility */}
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimatedPage;