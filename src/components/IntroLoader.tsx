"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/context/AudioContext";

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const { initializeAudio, audioError, clearAudioError } = useAudio();
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [teaserTextIndex, setTeaserTextIndex] = useState(0);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Password States
  const [pin, setPin] = useState(["", "", "", ""]);
  const [isWrong, setIsWrong] = useState(false);
  const [warningText, setWarningText] = useState("");
  const [showHint, setShowHint] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const teaserTexts = [
    "One random message...",
    "changed my entire life.",
    "Welcome to our little universe."
  ];

  // Preload progress simulation
  useEffect(() => {
    if (phase !== 1) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [phase]);

  // Teaser text timing (Phase 1)
  useEffect(() => {
    if (phase !== 1) return;
    if (progress < 100) return;

    if (teaserTextIndex < teaserTexts.length) {
      const timer = setTimeout(() => {
        setTeaserTextIndex((prev) => prev + 1);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setPhase(2);
    }
  }, [teaserTextIndex, progress, phase]);

  // Focus the first PIN box when entering Phase 2
  useEffect(() => {
    if (phase === 2) {
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 1000);
    }
  }, [phase]);

  // Check pin when all boxes are full
  useEffect(() => {
    const fullPin = pin.join("");
    if (fullPin.length === 4) {
      verifyPassword(fullPin);
    }
  }, [pin]);

  const verifyPassword = async (enteredPin: string) => {
    if (enteredPin === "0507") {
      setIsUnlocking(true);
      clearAudioError();
      const success = await initializeAudio();
      if (success) {
        setTimeout(() => {
          onComplete();
        }, 1200);
      } else {
        setIsUnlocking(false);
      }
    } else {
      // Trigger CSS shake keyframes
      setIsWrong(true);
      
      // Polish wrong warning text to the exact emotional line
      setWarningText("Hmmmm... That doesn’t feel like us 🥺");

      // Audio click fail
      setTimeout(() => {
        setIsWrong(false);
        setPin(["", "", "", ""]);
        inputRefs[0].current?.focus();
      }, 800);
    }
  };

  const handleInputChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return; // only allow numbers

    const newPin = [...pin];
    newPin[index] = value.substring(value.length - 1); // take only last digit
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      // If box is empty, focus previous and delete it
      if (!pin[index] && index > 0) {
        const newPin = [...pin];
        newPin[index - 1] = "";
        setPin(newPin);
        inputRefs[index - 1].current?.focus();
      } else {
        const newPin = [...pin];
        newPin[index] = "";
        setPin(newPin);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070505] text-[#FFF0F2] overflow-hidden select-none">
      {/* Black Paper Scrapbook Texture Layer */}
      <div className="absolute inset-0 paper-texture-dark opacity-35 pointer-events-none" />

      {/* Cinematic teaser video background - muted loop in Phase 1 */}
      {progress === 100 && phase === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover filter blur-[4px] scale-105"
          >
            <source src="/videos/funny-intro.mp4" type="video/mp4" />
          </video>
        </motion.div>
      )}

      {/* Floating Rose Petals Backdrop (restricted count for mobile stability) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isMounted && [...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-rose-300/10 blur-[0.5px]"
            style={{
              width: `${Math.random() * 8 + 3}px`,
              height: `${Math.random() * 8 + 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 8 + 8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content Card container */}
      <div className="relative z-10 w-full max-w-md px-6 text-center flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {/* Phase 0: Cover Gate to start audio on interaction */}
          {phase === 0 && (
            <motion.div
              key="phase0"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="flex flex-col items-center gap-8 w-full max-w-xs"
            >
              <div className="space-y-4">
                <h1 className="font-caveat text-4xl md:text-5xl text-pink-100/90 font-semibold leading-relaxed handwritten-readable-dark">
                  Some memories are meant only for us 💗
                </h1>
                <p className="font-sans text-xs tracking-widest text-slate-400/80 font-light uppercase">
                  A cinematic scrapbook of our little universe
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={async () => {
                  clearAudioError();
                  await initializeAudio();
                  setPhase(1);
                }}
                className="mt-4 px-8 py-3.5 rounded-full border border-pink-300/30 bg-[#1a1414] hover:bg-[#261c1c] text-[#FFF0F2] font-caveat text-2xl tracking-wide shadow-[0_0_15px_rgba(251,197,200,0.15)] hover:shadow-[0_0_20px_rgba(251,197,200,0.25)] transition-all duration-300 cursor-pointer"
              >
                Open our little universe ✨
              </motion.button>
            </motion.div>
          )}

          {/* Phase 1: Progress Preloader */}
          {phase === 1 && progress < 100 && (
            <motion.div
              key="preloader"
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 w-full max-w-xs"
            >
              <h2 className="font-caveat text-3xl text-[#E0A899] font-medium handwritten-readable-dark">Loading our memories...</h2>
              <div className="w-full h-1 bg-[#1e1717] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#E0A899]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>
          )}

          {/* Phase 1: Teaser text block */}
          {progress === 100 && phase === 1 && (
            <motion.div key="phase1" className="h-28 flex items-center justify-center">
              {teaserTexts.map((text, idx) =>
                idx === teaserTextIndex ? (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                    transition={{ duration: 1.0, ease: "easeInOut" }}
                    className="font-caveat text-3xl md:text-4xl text-[#E0A899] font-semibold leading-relaxed absolute px-6 handwritten-readable-dark"
                  >
                    {text}
                  </motion.p>
                ) : null
              )}
            </motion.div>
          )}

          {/* Phase 2: Password Screen */}
          {phase === 2 && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="flex flex-col items-center gap-8 w-full max-w-xs"
            >
              <div className="space-y-3">
                <motion.h1
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 1.0 }}
                  className="font-caveat text-3xl md:text-4xl text-pink-200/95 font-semibold tracking-wide handwritten-readable-dark"
                >
                  Unlock Our Memories 🔑
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.4 }}
                  className="font-sans text-xs tracking-wider text-slate-400 font-light"
                >
                  Enter the key to open our little universe...
                </motion.p>
              </div>

              {/* Password DIGIT boxes with soft rose gold typing glow and custom shake */}
              <div
                className={`flex justify-center gap-4 py-2 ${
                  isWrong ? "animate-shake" : ""
                }`}
              >
                {pin.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    disabled={isUnlocking}
                    className="w-12 h-16 text-center font-sans text-2xl font-light border border-pink-900/20 bg-[#161212]/80 text-[#FFF0F2] rounded-md focus:outline-none focus:border-[#E0A899] focus:shadow-[0_0_15px_rgba(224,168,153,0.3)] transition-all duration-300"
                    autoComplete="off"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                ))}
              </div>

              {/* Warnings & Hint triggers */}
              <div className="min-h-16 flex flex-col items-center justify-start gap-3 w-full">
                {warningText && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 0.8 }}
                    className="text-[#E0A899] text-xs font-sans font-light"
                  >
                    {warningText}
                  </motion.p>
                )}

                {audioError && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1 }}
                    className="text-pink-300 text-xs font-sans font-medium"
                  >
                    {audioError}
                  </motion.p>
                )}

                {!isUnlocking && (
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                    >
                      {showHint ? "Hide Hint 🌸" : "Need Hint? 💌"}
                    </button>
                    
                    <AnimatePresence>
                      {showHint && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 0.6, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-[10px] text-pink-200/60 font-sans tracking-wide leading-relaxed max-w-[220px] whitespace-pre-wrap"
                        >
                          {"Hint 💌 :\nTwo hearts.\nTwo special dates.\nOne little universe."}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
