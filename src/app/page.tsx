"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAudio } from "@/context/AudioContext";
import IntroLoader from "@/components/IntroLoader";
import TimelineNav from "@/components/TimelineNav";
import TheGirlScrapbook from "@/components/TheGirlScrapbook";
import StoryTimeline from "@/components/StoryTimeline";
import CuteMoments from "@/components/CuteMoments";
import CasualAndConfession from "@/components/CasualAndConfession";
import LateNightTalks from "@/components/LateNightTalks";
import ThingsILove from "@/components/ThingsILove";
import VoiceMemories from "@/components/VoiceMemories";
import SecretLetter from "@/components/SecretLetter";
import EndingScreen from "@/components/EndingScreen";
import { Heart } from "lucide-react";

export default function Home() {
  const { transitionToBgm } = useAudio();
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleIntroComplete = () => {
    setIsIntroComplete(true);
    // Transition from intro BGM theme to the main soft bgm
    transitionToBgm("main");
  };

  return (
    <main className="min-h-screen bg-cream select-none relative">
      <AnimatePresence mode="wait">
        {!isIntroComplete ? (
          <IntroLoader key="loader" onComplete={handleIntroComplete} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full flex flex-col items-stretch"
          >
            {/* Floating Navigation sidebar for sections */}
            <TimelineNav />

            {/* Main Header / Greeting Frame */}
            <div
              id="intro"
              className="relative min-h-screen py-24 px-6 md:px-12 flex flex-col items-center justify-center paper-texture overflow-hidden"
            >
              <div className="absolute top-12 left-12 w-64 h-64 bg-pink-100/30 rounded-full filter blur-3xl pointer-events-none" />
              <div className="absolute bottom-12 right-12 w-64 h-64 bg-lavender/30 rounded-full filter blur-3xl pointer-events-none" />

              {/* Floating petals restricted to intro */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                {isMounted && [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-rose-200/35 rounded-full blur-[0.5px]"
                    style={{
                      width: `${Math.random() * 10 + 5}px`,
                      height: `${Math.random() * 10 + 5}px`,
                      top: `${Math.random() * 80}%`,
                      left: `${Math.random() * 80}%`,
                      animation: `float ${Math.random() * 5 + 7}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>

              {/* Main Greeting Block */}
              <div className="text-center relative z-10 max-w-2xl px-6 flex flex-col items-center justify-center gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5 }}
                  className="w-12 h-12 rounded-full border border-pink-200 bg-pink-50 flex items-center justify-center shadow-sm animate-pulse-slow"
                >
                  <Heart className="w-5.5 h-5.5 text-[#E0A899] fill-[#E0A899]/10" />
                </motion.div>
                
                <div className="space-y-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 1.2 }}
                    className="font-caveat text-5xl md:text-7xl text-slate-800 leading-tight"
                  >
                    Our Little Universe 🌸
                  </motion.h1>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 1.2 }}
                    className="font-sans text-xs tracking-[0.2em] font-semibold text-[#E0A899] uppercase"
                  >
                    Handcrafted for Gowthammm
                  </motion.h2>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.9, duration: 1.5 }}
                  className="text-xs text-slate-500 font-sans leading-relaxed max-w-md font-light mt-4"
                >
                  Scroll down to navigate through our timeline, polaroid scrapbooks, chat logs, vlogs, and a special letter at the end.
                </motion.p>
              </div>
            </div>

            {/* Section 1: The Girl I Never Forgot */}
            <TheGirlScrapbook />

            {/* Section 2: How It Started Timeline */}
            <StoryTimeline />

            {/* Section 3: Cute Daily Moments Grid */}
            <CuteMoments />

            {/* Section 4: Angry But Cute & Confessions */}
            <CasualAndConfession />

            {/* Section 5: Late Night Talks (Midnight Theme) */}
            <LateNightTalks />

            {/* Section 6: Things I Love */}
            <ThingsILove />

            {/* Section 7: Voice Memories (Focus Audio Player) */}
            <VoiceMemories />

            {/* Section 8: Secret Letter */}
            <SecretLetter />

            {/* Section 9: Final Ending Screen */}
            <EndingScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
