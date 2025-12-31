import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import textConfig from "../textConfig";

import music1 from "../music/music1.mp3";
import music2 from "../music/music2.mp3";
import music3 from "../music/music3.mp3";

import cover1 from "../musiccover/music1.jpg"; 
import cover2 from "../musiccover/music2.jpg";
import cover3 from "../musiccover/music3.jpg";

type Track = {
  id: number;
  title: string;
  caption: string;
  src: string;
  cover: string;
};

let globalAudioContainer: HTMLDivElement | null = null;
const getGlobalAudioContainer = () => {
  if (typeof window === "undefined") return null;
  if (!globalAudioContainer) {
    globalAudioContainer = document.createElement('div');
    globalAudioContainer.id = 'persistent-audio-container';
    globalAudioContainer.style.display = 'none';
    document.body.appendChild(globalAudioContainer);
  }
  return globalAudioContainer;
};

export default function ChillZone({ onNext }: { onNext?: () => void }) {
  const tracks: Track[] = [
    { id: 1, title: textConfig.chillZone.tracks[0].title, caption: textConfig.chillZone.tracks[0].caption, src: music1, cover: cover1 },
    { id: 2, title: textConfig.chillZone.tracks[1].title, caption: textConfig.chillZone.tracks[1].caption, src: music2, cover: cover2 },
    { id: 3, title: textConfig.chillZone.tracks[2].title, caption: textConfig.chillZone.tracks[2].caption, src: music3, cover: cover3 },
  ];

  const audioRefs = useRef<Array<HTMLAudioElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const container = getGlobalAudioContainer();
    if (!container) return;
    
    audioRefs.current = tracks.map((track) => {
      let audio = container.querySelector(`audio[data-track-id="${track.id}"]`) as HTMLAudioElement;
      if (!audio) {
        audio = document.createElement('audio');
        audio.src = track.src;
        audio.preload = 'metadata';
        audio.setAttribute('data-track-id', track.id.toString());
        container.appendChild(audio);
      }
      return audio;
    });

    audioRefs.current.forEach((audio, index) => {
      if (audio && !audio.paused) {
        setActiveIndex(index);
        setIsPlaying(true);
        setDuration(audio.duration || 0);
      }
    });
  }, []);

  const togglePlay = async (index: number) => {
    const currentAudio = audioRefs.current[index];
    if (!currentAudio) return;

    if (activeIndex === index) {
      if (currentAudio.paused) {
        await currentAudio.play();
        setIsPlaying(true);
      } else {
        currentAudio.pause();
        setIsPlaying(false);
      }
      return;
    }

    audioRefs.current.forEach((a, i) => { if (a && i !== index) { a.pause(); a.currentTime = 0; } });
    setActiveIndex(index);
    setIsPlaying(true);
    try { await currentAudio.play(); } catch (err) { setIsPlaying(false); }
  };

  useEffect(() => {
    const idx = activeIndex;
    if (idx == null) return;
    const audio = audioRefs.current[idx];
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => { setIsPlaying(false); setActiveIndex(null); };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [activeIndex]);

  const formatTime = (s: number) => {
    if (isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const secs = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${secs}`;
  };

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center py-12 px-4 relative overflow-hidden"
      style={{ backgroundColor: '#FFF3E0' }}
    >
      <div aria-hidden className="animated-bg" />
      <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16 z-10">
        <span className="block font-handwriting text-[#D32F2F] text-3xl mb-1">{textConfig.chillZone.subheading}</span>
        <h1 className="text-5xl md:text-6xl font-display text-[#3d2b28] tracking-tight">{textConfig.chillZone.heading}</h1>
      </motion.div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-12 z-10">
        {tracks.map((track, index) => {
          const active = activeIndex === index;
          const isActuallyPlaying = active && isPlaying;

          return (
            <motion.div
              key={track.id}
              whileHover={{ y: -8 }}
              onClick={() => togglePlay(index)}
              className={`relative cursor-pointer transition-all duration-500 ${active ? 'z-20' : 'z-10'}`}
            >
              {/* CASSETTE SHELL */}
              <motion.div 
                animate={{ 
                  scale: isActuallyPlaying ? 1.08 : 1, // Zoom when playing
                  rotate: isActuallyPlaying ? [0, -0.2, 0.2, 0] : 0, // Mechanical vibration
                  boxShadow: isActuallyPlaying 
                    ? "0 30px 60px -12px rgba(0,0,0,0.4), 0 0 20px rgba(211,47,47,0.2)" 
                    : "0 10px 20px -5px rgba(0,0,0,0.3)"
                }}
                transition={{ 
                  scale: { type: "spring", stiffness: 300, damping: 20 },
                  rotate: { repeat: Infinity, duration: 0.2 }, // Vibration speed
                  boxShadow: { duration: 0.4 }
                }}
                className={`relative w-full aspect-[1.58/1] rounded-2xl overflow-hidden border-[7px] transition-colors duration-700
                ${active ? 'bg-[#c0392b] border-[#922b21]' : 'bg-[#2a2a2a] border-[#1a1a1a]'}`}
              >
                {/* Paper Label Area */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] h-[42%] bg-[#F5F5DC] rounded-sm flex overflow-hidden shadow-inner border-b-2 border-black/10">
                  <div className="w-1/3 h-full relative border-r-2 border-dashed border-black/10">
                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover grayscale-[0.2]" />
                    <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                  </div>

                  <div className="flex-grow p-3 flex flex-col justify-center bg-white/50 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[#D32F2F] font-bold text-[8px]">Type II / CrO2</span>
                      <span className="text-gray-400 font-bold text-[8px]">SIDE A</span>
                    </div>
                    <h2 className="font-handwriting text-xl md:text-2xl text-[#2c3e50] leading-none mb-1 truncate">
                      {track.title}
                    </h2>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-sans italic truncate">
                      {track.caption}
                    </p>
                  </div>
                </div>

                {/* Tape Window Visuals */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[60%] h-[28%] bg-[#0f0f0f] rounded-lg border-4 border-[#1a1a1a] shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] flex items-center justify-around overflow-hidden">
                   {/* Left Reel */}
                   <motion.div 
                    animate={{ rotate: isActuallyPlaying ? 360 : 0 }}
                    transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                    className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center"
                   >
                      <div className="w-6 h-6 rounded-full border border-white/5 relative">
                        <div className="w-[1px] h-full bg-white/10 absolute left-1/2 -translate-x-1/2" />
                        <div className="h-[1px] w-full bg-white/10 absolute top-1/2 -translate-y-1/2" />
                      </div>
                   </motion.div>

                   {/* Center Progress Line */}
                   <div className="w-16 h-[2px] bg-white/5 relative">
                      <motion.div 
                        className="absolute h-full bg-[#D32F2F] shadow-[0_0_8px_#D32F2F]"
                        initial={{ width: 0 }}
                        animate={{ width: active ? `${(currentTime / duration) * 100}%` : 0 }}
                      />
                   </div>

                   {/* Right Reel */}
                   <motion.div 
                    animate={{ rotate: isActuallyPlaying ? 360 : 0 }}
                    transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                    className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center"
                   >
                      <div className="w-6 h-6 rounded-full border border-white/5 relative">
                        <div className="w-[1px] h-full bg-white/10 absolute left-1/2 -translate-x-1/2" />
                        <div className="h-[1px] w-full bg-white/10 absolute top-1/2 -translate-y-1/2" />
                      </div>
                   </motion.div>
                </div>

                {/* Screw Heads */}
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-black/40" />
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-black/40" />
                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-black/40" />
                <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-black/40" />
              </motion.div>

              {/* Digital Time Indicator */}
              {active && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-[#00ff41] font-mono text-[10px] px-3 py-1 rounded border border-white/20 shadow-lg z-30 tracking-widest"
                >
                  <span className="animate-pulse mr-1">●</span> PLAYING {formatTime(currentTime)}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-24 z-10">
        <button
          onClick={onNext}
          className="group relative flex items-center gap-3 px-10 py-4 rounded-xl bg-[#2c2c2c] text-white font-bold transition-all hover:bg-[#D32F2F] active:scale-95 shadow-xl"
        >
          <span className="tracking-[0.2em] uppercase text-xs">{textConfig.chillZone.continueButton}</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 12h14" />
          </svg>
        </button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Mountains+of+Christmas:wght@700&family=JetBrains+Mono&display=swap');
        .font-handwriting { font-family: 'Dancing Script', cursive; }
        .font-display { font-family: 'Mountains of Christmas', cursive; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        main::after {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.05;
          pointer-events: none;
          z-index: 50;
        }
        .animated-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(closest-side at 10% 20%, rgba(211,157,86,0.08), transparent 10%),
                      radial-gradient(closest-side at 80% 80%, rgba(211,157,86,0.06), transparent 12%),
                      radial-gradient(closest-side at 50% 50%, rgba(211,157,86,0.04), transparent 18%);
          filter: blur(36px);
          opacity: 0.9;
          animation: bgFloat 18s linear infinite;
        }

        @keyframes bgFloat {
          0% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(-30px,-20px,0) scale(1.05); }
          100% { transform: translate3d(0,0,0) scale(1); }
        }
      `}</style>
    </main>
  );
}