"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useAudio } from "@/context/AudioContext";
import { Heart, Sparkles, Volume2, Play } from "lucide-react";

export default function CasualAndConfession() {
  const { transitionToBgm, playPaper } = useAudio();
  
  // Viewport refs to trigger BGM transitions
  const confessionRef = useRef<HTMLDivElement>(null);
  const isConfessionInView = useInView(confessionRef, {
    margin: "-30% 0px -30% 0px",
  });

  // Track BGM transition based on view state
  useEffect(() => {
    if (isConfessionInView) {
      transitionToBgm("caring");
    } else {
      transitionToBgm("main");
    }
  }, [isConfessionInView, transitionToBgm]);

  // Video play helper for non-looping videos
  const handleReplay = (e: React.MouseEvent<HTMLButtonElement>, videoId: string) => {
    e.stopPropagation();
    const video = document.getElementById(videoId) as HTMLVideoElement;
    if (video) {
      video.currentTime = 0;
      video.play().catch((err) => console.log("Play error:", err));
    }
  };

  return (
    <div className="relative">
      {/* 1. CASUAL MEMORIES SUB-SECTION */}
      <section className="relative min-h-screen py-24 px-6 md:px-12 bg-[#FFFDF9] paper-texture flex flex-col items-center justify-center overflow-hidden">
        <div className="text-center mb-16 relative z-10 max-w-xl mx-auto">
          <span className="text-xs tracking-widest text-[#E0A899] uppercase block mb-2 font-medium">
            Daily Joy
          </span>
          <h2 className="font-caveat text-4xl md:text-5xl text-slate-800">
            Normal Days Made Beautiful
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-3">
            Ordinary clips that became treasure pages because of you.
          </p>
        </div>

        {/* Casual Memory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl relative z-10 w-full justify-items-center">
          {/* Card 1: GRWM */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-72 bg-[#FFFDF9] border border-slate-200/50 p-4 shadow-[0_4px_15px_rgba(0,0,0,0.03)] rounded-sm flex flex-col gap-3 rotate-1 hover:rotate-0 transition-transform duration-300"
          >
            <div className="absolute -top-3.5 left-12 w-16 h-5 washi-tape" />
            <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-slate-50 border border-slate-100">
              <video autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover">
                <source src="/videos/her-grwm.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="text-center py-2 h-14 flex items-center justify-center">
              <span className="font-caveat text-xl text-slate-700 leading-snug font-medium">
                "normal days felt like magic with you"
              </span>
            </div>
          </motion.div>

          {/* Card 2: Cute Message updates */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="w-72 bg-[#FFFDF9] border border-slate-200/50 p-4 shadow-[0_4px_15px_rgba(0,0,0,0.03)] rounded-sm flex flex-col gap-3 -rotate-1 hover:rotate-0 transition-transform duration-300"
          >
            <div className="absolute -top-3.5 right-12 w-16 h-5 washi-tape-pink" />
            <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-slate-50 border border-slate-100">
              {/* This is a cute message update, non-looping emotional clip */}
              <video id="vid-cute-msg" autoPlay muted playsInline preload="metadata" className="w-full h-full object-cover">
                <source src="/videos/her-cute-message.mp4" type="video/mp4" />
              </video>
              <button
                onClick={(e) => handleReplay(e, "vid-cute-msg")}
                className="absolute bottom-3 right-3 p-1.5 rounded-full bg-cream/80 hover:bg-cream border border-[#E0A899]/30 text-[#E0A899] cursor-pointer"
                title="Replay Video"
              >
                <Play className="w-3.5 h-3.5 fill-[#E0A899]/10" />
              </button>
            </div>
            <div className="text-center py-2 h-14 flex items-center justify-center">
              <span className="font-caveat text-xl text-slate-700 leading-snug font-medium">
                "the updates that kept me going..."
              </span>
            </div>
          </motion.div>

          {/* Card 3: Jewellery Detail */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-72 bg-[#FFFDF9] border border-slate-200/50 p-4 shadow-[0_4px_15px_rgba(0,0,0,0.03)] rounded-sm flex flex-col gap-3 rotate-2 hover:rotate-0 transition-transform duration-300"
          >
            <div className="absolute -top-3.5 left-1/3 w-16 h-5 washi-tape" />
            <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-slate-50 border border-slate-100">
              <video autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover">
                <source src="/videos/ear-rings.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="text-center py-2 h-14 flex items-center justify-center">
              <span className="font-caveat text-xl text-slate-700 leading-snug font-medium">
                "I notice even the little details about you 💍"
              </span>
            </div>
          </motion.div>
        </div>

        {/* 2. CUTE ANGRY SUB-SECTION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-28 max-w-2xl bg-[#FCF7F2] border border-pink-100/50 p-6 md:p-8 rounded-sm shadow-sm text-center relative w-full flex flex-col items-center gap-6"
        >
          <div className="absolute -top-3.5 left-6 w-16 h-5 washi-tape-pink -rotate-1" />
          <h3 className="font-caveat text-3xl text-slate-800 flex items-center gap-2">
            When you act angry but look adorable... 😭
          </h3>
          <div className="relative w-64 aspect-[3/4] rounded-sm overflow-hidden bg-slate-50 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
            <video id="vid-cute-angry" autoPlay muted playsInline preload="metadata" className="w-full h-full object-cover hover:animate-shake">
              <source src="/videos/her-cute-angryness.mp4" type="video/mp4" />
            </video>
            <button
              onClick={(e) => handleReplay(e, "vid-cute-angry")}
              className="absolute bottom-3 right-3 p-1.5 rounded-full bg-cream/80 hover:bg-cream border border-[#E0A899]/30 text-[#E0A899] cursor-pointer"
              title="Replay Video"
            >
              <Play className="w-3.5 h-3.5 fill-[#E0A899]/10" />
            </button>
          </div>
          <p className="text-xs text-slate-500 font-sans italic max-w-sm">
            Hover over the card to see the tiny hearts shake 🤪
          </p>
        </motion.div>
      </section>

      {/* 3. CONFESSIONS SUB-SECTION (DARK ATMOSPHERE) */}
      <section
        ref={confessionRef}
        id="confessions"
        className="relative min-h-screen py-24 px-6 md:px-12 bg-[#120e0e] text-[#FFF0F2] paper-texture-dark flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#120e0e] via-[#0d0a0a] to-[#120e0e] pointer-events-none" />

        {/* Ambient star particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" suppressHydrationWarning>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              suppressHydrationWarning
              className="absolute rounded-full bg-pink-300/10 blur-[0.5px]"
              style={{
                width: `${Math.random() * 4 + 1.5}px`,
                height: `${Math.random() * 4 + 1.5}px`,
                top: `${Math.random() * 90}%`,
                left: `${Math.random() * 90}%`,
                animation: `float ${Math.random() * 12 + 10}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        {/* Spotlight overlay effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-900/5 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="text-center mb-16 relative z-10 max-w-xl mx-auto">
          <span className="text-xs tracking-widest text-[#E0A899] uppercase block mb-2 font-medium">
            Confessions
          </span>
          <h2 className="font-caveat text-4xl md:text-5xl text-pink-100">
            Speaking From The Heart
          </h2>
          <p className="text-xs text-pink-200/50 font-sans mt-3">
            Listen closely... these moments hold our truest emotions.
          </p>
        </div>

        {/* Confession Videos */}
        <div className="flex flex-col lg:flex-row gap-12 max-w-4xl w-full justify-center items-center relative z-10">
          {/* Confession Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-72 bg-[#1b1717]/90 border border-pink-950/40 p-4 shadow-xl rounded-sm flex flex-col gap-3"
          >
            <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-[#0a0808]">
              {/* Confessions DO NOT loop */}
              <video id="vid-conf-1" autoPlay muted playsInline preload="metadata" className="w-full h-full object-cover">
                <source src="/videos/her-confession.mp4" type="video/mp4" />
              </video>
              <button
                onClick={(e) => handleReplay(e, "vid-conf-1")}
                className="absolute bottom-3 right-3 p-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-pink-500/25 text-pink-300 cursor-pointer"
                title="Replay Video"
              >
                <Play className="w-3.5 h-3.5 fill-pink-300/10" />
              </button>
            </div>
            <div className="text-center py-2 h-14 flex items-center justify-center">
              <span className="font-caveat text-xl text-pink-200/80 leading-snug font-light">
                "the sweetest feelings..."
              </span>
            </div>
          </motion.div>

          {/* Confession Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-72 bg-[#1b1717]/90 border border-pink-950/40 p-4 shadow-xl rounded-sm flex flex-col gap-3"
          >
            <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-[#0a0808]">
              <video id="vid-conf-2" autoPlay muted playsInline preload="metadata" className="w-full h-full object-cover">
                <source src="/videos/her-confession-2.mp4" type="video/mp4" />
              </video>
              <button
                onClick={(e) => handleReplay(e, "vid-conf-2")}
                className="absolute bottom-3 right-3 p-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-pink-500/25 text-pink-300 cursor-pointer"
                title="Replay Video"
              >
                <Play className="w-3.5 h-3.5 fill-pink-300/10" />
              </button>
            </div>
            <div className="text-center py-2 h-14 flex items-center justify-center">
              <span className="font-caveat text-xl text-pink-200/80 leading-snug font-light">
                "forever captured in this moment"
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
