"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/context/AudioContext";
import { Heart, Sparkles, X } from "lucide-react";

interface OpenWhenLetter {
  key: string;
  trigger: string;
  letter: string;
  color: string;
}

export default function ThingsILove() {
  const { playPaper, playSparkle } = useAudio();
  const [activeLetter, setActiveLetter] = useState<OpenWhenLetter | null>(null);

  const things = [
    { text: "The way you say nannaa 🫠", sub: "" },
    { text: "Your daily goodnight texts mandatory", sub: "" },
    { text: "Your cute little angry face", sub: "" },
    { text: "Your incredibly caring nature", sub: "" },
    { text: "Future plan: One chicken biryani. Two spoons. Zero sharing 😼", sub: "One biryani date = instant happiness 😭" },
    { text: "Emergency solution for your mood: ice cream + attention 😭🍦", sub: "Ice cream fixes 90% of her mood swings 🍦" },
    { text: "You made my real life feel better than romantic movies 💗", sub: "Her smile > every romantic movie ever made." },
    { text: "My pretty bangarammmm 💗", sub: "" },
  ];

  const letters: OpenWhenLetter[] = [
    {
      key: "miss",
      trigger: "Open when you miss me",
      letter: "Nannaa, close your eyes, take a deep breath, and remember that I am thinking of you at this exact second. No distance or time can change how much you mean to me. I love you! 💖",
      color: "bg-[#181414] border-pink-900/30 text-pink-100",
    },
    {
      key: "sad",
      trigger: "Open when you're sad",
      letter: "Your smile is my absolute happiness. Whatever is bothering you, we will get through it together. I'm always right here, ready to listen and hold your hand. 🤍",
      color: "bg-[#141816] border-emerald-950/40 text-emerald-100",
    },
    {
      key: "fight",
      trigger: "Open when we fight",
      letter: "Fights are just silly temporary blocks, but my love for you is eternal. I'm sorry if I made you sad or angry. Let's talk it out and patch up, please? 🥺💞",
      color: "bg-[#161418] border-purple-950/40 text-purple-100",
    },
    {
      key: "sleep",
      trigger: "Open when you can't sleep",
      letter: "Take a deep breath, relax, and listen to my voice note in the player above. Feel my arms hugging you tight to sleep. Goodnight, my sweet bangaram. 😴💗",
      color: "bg-[#141518] border-indigo-950/40 text-indigo-100",
    },
    {
      key: "love",
      trigger: "Open when you need love",
      letter: "Here is a infinite supply of virtual hugs and kisses! You are the most precious, beautiful, and important person in my life. Riyaz loves you more than anything. 😘💖",
      color: "bg-[#181416] border-pink-950/40 text-pink-100",
    },
  ];

  const handleOpenLetter = (letter: OpenWhenLetter) => {
    playPaper();
    setActiveLetter(letter);
  };

  const handleCloseLetter = () => {
    playPaper();
    setActiveLetter(null);
  };

  return (
    <section
      id="things-i-love"
      className="relative min-h-screen py-24 px-6 md:px-12 flex flex-col items-center justify-center bg-[#0d0a0a] text-[#FFF0F2] paper-texture-dark overflow-hidden border-t border-red-950/20"
    >
      {/* Soft Rose Gold Spotlight background glow (no repainting backdrop-blurs) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-900/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Starry details */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" suppressHydrationWarning>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            suppressHydrationWarning
            className="absolute rounded-full bg-pink-300/10 blur-[0.5px]"
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              top: `${Math.random() * 95}%`,
              left: `${Math.random() * 95}%`,
              animation: `float ${Math.random() * 8 + 8}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="text-center mb-16 relative z-10 max-w-xl mx-auto">
        <span className="text-xs tracking-widest text-[#E0A899] uppercase block mb-2 font-medium">
          Our Little Details
        </span>
        <h2 className="font-caveat text-4xl md:text-5xl text-pink-100">
          Little Things I Love About You
        </h2>
        <p className="text-xs text-pink-200/50 font-sans mt-3">
          It's the small, unnoticed moments that hold the biggest place in my heart.
        </p>
      </div>

      {/* Cute Things Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl w-full relative z-10 justify-items-center mb-24">
        {things.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: idx * 0.08 }}
            onMouseEnter={playSparkle}
            className="w-full max-w-[280px] bg-[#161212]/95 border border-pink-900/15 p-5 rounded-sm shadow-[0_4px_15px_rgba(0,0,0,0.1)] flex flex-col gap-2 justify-between hover:scale-[1.03] transition-transform duration-200"
          >
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-[#E0A899] fill-[#E0A899]/15 flex-shrink-0 mt-1" />
              <span className="font-caveat text-2xl text-pink-100 leading-snug">
                {item.text}
              </span>
            </div>
            {item.sub && (
              <span className="text-[10px] text-[#E0A899]/60 font-sans tracking-wide block border-t border-pink-900/10 pt-2 mt-2 leading-relaxed">
                {item.sub}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* "Open When" Envelopes Section */}
      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center">
        <h3 className="font-caveat text-3xl text-pink-100 mb-8 text-center flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#E0A899]" />
          Special \"Open When...\" Letters
        </h3>
        
        <div className="flex flex-wrap justify-center gap-4 w-full">
          {letters.map((letObj) => (
            <motion.button
              key={letObj.key}
              onClick={() => handleOpenLetter(letObj)}
              className="px-5 py-3 border border-pink-900/15 bg-[#161212]/95 text-pink-200/90 text-xs tracking-wider uppercase font-medium rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:bg-pink-950/20 hover:border-[#E0A899] hover:text-[#E0A899] active:scale-95 transition-all duration-200 cursor-pointer"
            >
              {letObj.trigger}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Interactive Letter Modal Popup */}
      <AnimatePresence>
        {activeLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseLetter}
              className="absolute inset-0 bg-[#070505]/60 backdrop-blur-sm"
            />

            {/* Modal notepad content (black scrapbook style) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`relative w-full max-w-md border p-8 rounded-sm shadow-2xl z-10 flex flex-col gap-6 text-center select-text ${activeLetter.color}`}
            >
              {/* Paper Washi tape stamp */}
              <div className="absolute -top-3.5 left-12 w-16 h-5 washi-tape-black rotate-1" />

              {/* Close Button */}
              <button
                onClick={handleCloseLetter}
                className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-[#251c1c]/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h4 className="font-sans text-xs tracking-widest text-[#E0A899] uppercase font-semibold">
                {activeLetter.trigger}
              </h4>

              {/* Notepad lines decoration */}
              <div className="absolute inset-y-16 inset-x-6 border-l border-red-500/10 pointer-events-none" />

              <p className="font-caveat text-2xl md:text-3xl leading-relaxed font-light pl-4">
                {activeLetter.letter}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
