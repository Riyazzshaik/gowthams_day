"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/context/AudioContext";
import { Mail, ArrowRight, Heart } from "lucide-react";

export default function SecretLetter() {
  const { playPaper, playTypewriter, transitionToBgm } = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const chunks = [
    "Wish you many more happy returns of the day, Gowthammm 💗\n\n2024 June lo ninnu first time chusinappudu, naku teliyakunda naa heart lo edo special feeling vachindhi 🫠.\nAppudu matladaledhu kani, ninnu chusthe chalu ani anipinchedhi.",
    "September 29 na nuvvu Snapchat lo first message chesina roju…\naa small “Hi” 💞 naa life lo inta happiness teesukosthundhi ani appudu asalu teliyaledhu.\n\nMana random conversations nundi start ayi…\nlate night chats, calls, fights, patchups, caring, understanding ila mana bond roju-rojuki chaala special ayyindhi 🤪",
    "Naa day entha bad ga unna kuda, nee goodnight message lekunda complete ayye feeling raadhu 😋\nNuvvu naa comfort, naa peace, and naa favourite person ayyav.",
    "Happy Birthday once again, naa Gowthammm 🤍\nStay healthy, keep smiling everywhere, adhe naa happiness.\n\nJune 6 — Your day, my happiness 😻.\n\nI love you so, so much, Gowthammm 💖😘."
  ];

  const handleOpenEnvelope = () => {
    playPaper();
    setIsOpen(true);
    // Smoothly transition background music to caring-bgm
    transitionToBgm("caring");
  };

  useEffect(() => {
    if (!isOpen) return;

    setIsTyping(true);
    setDisplayedText("");
    let charIndex = 0;
    const activeText = chunks[currentChunk];

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      // Capture character synchronously to avoid async variable mutation capture in state updater
      const nextChar = activeText[charIndex];
      if (nextChar !== undefined) {
        setDisplayedText((prev) => prev + nextChar);
      }
      
      // Play a soft typewriter key click every 3-4 letters
      if (charIndex % 3 === 0) {
        playTypewriter();
      }

      charIndex++;
      if (charIndex >= activeText.length) {
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
        setIsTyping(false);
      }
    }, 45); // Typing speed in milliseconds

    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [isOpen, currentChunk]);

  const handleNextChunk = () => {
    playPaper();
    if (currentChunk < chunks.length - 1) {
      setCurrentChunk((prev) => prev + 1);
    }
  };

  return (
    <section
      id="letter"
      className="relative min-h-screen py-24 px-6 md:px-12 flex flex-col items-center justify-center bg-[#FFFDF9] paper-texture overflow-hidden"
    >
      {/* Background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-100/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-16 relative z-10 max-w-xl mx-auto">
        <span className="text-xs tracking-widest text-[#E0A899] uppercase block mb-2 font-medium">
          The Climax
        </span>
        <h2 className="font-caveat text-4xl md:text-5xl text-slate-800">
          A Secret Letter For You
        </h2>
        <p className="text-xs text-slate-500 font-sans mt-3">
          Open when you are ready to read my heart out.
        </p>
      </div>

      {/* Envelope Container */}
      <div className="relative w-full max-w-lg min-h-[400px] flex items-center justify-center z-10">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Envelope Closed State */
            <motion.div
              key="closed"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.6 }}
              onClick={handleOpenEnvelope}
              className="w-80 h-52 bg-[#FCF6F0] border border-pink-200/50 shadow-lg rounded-sm cursor-pointer flex flex-col items-center justify-center gap-4 hover:scale-[1.03] transition-transform duration-300 relative group"
            >
              {/* Paper Washi tape stamp */}
              <div className="absolute -top-3.5 left-12 w-14 h-4.5 washi-tape-pink rotate-2" />
              
              {/* Closed Envelope Flaps */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(224,168,153,0.1)_1px,transparent_0)] bg-[size:10px_10px] rounded-sm pointer-events-none" />
              
              {/* Wax Seal heart button */}
              <div className="w-14 h-14 rounded-full bg-pink-100/80 border border-pink-200 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6 text-[#E0A899] fill-[#E0A899]/15 animate-pulse" />
              </div>
              <span className="font-caveat text-xl text-slate-600 font-light">
                Tap to open 💌
              </span>
            </motion.div>
          ) : (
            /* Envelope Open / Letter Display State */
            <motion.div
              key="open"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full bg-[#FFFDF9] border border-slate-200/60 p-8 md:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.03)] rounded-sm flex flex-col justify-between min-h-[400px] relative"
            >
              {/* Paper texture overlay */}
              <div className="absolute -top-3.5 right-12 w-16 h-5 washi-tape -rotate-1 z-20" />

              {/* Letter content */}
              <div className="flex-grow flex flex-col justify-center">
                {/* Custom lines to look like notepad */}
                <div className="absolute inset-y-8 inset-x-6 border-l border-red-200/25 pointer-events-none" />

                <div className="font-caveat text-[21px] sm:text-2xl md:text-3xl text-slate-950 leading-loose font-medium whitespace-pre-wrap pl-6 relative z-10 select-text handwritten-readable">
                  {displayedText}
                  {isTyping && (
                    <span className="inline-block w-1.5 h-6 bg-[#E0A899]/70 animate-pulse ml-0.5" />
                  )}
                </div>
              </div>

              {/* Letter Pagination Button */}
              <div className="mt-8 flex justify-end h-12 items-center relative z-10">
                {!isTyping && currentChunk < chunks.length - 1 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={handleNextChunk}
                    className="flex items-center gap-2 font-caveat text-xl text-[#E0A899] hover:text-[#c48f82] font-semibold cursor-pointer py-1 px-3 border border-pink-100/60 rounded-full hover:bg-pink-50/30 transition-colors"
                  >
                    Continue reading 💌
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
                {!isTyping && currentChunk === chunks.length - 1 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    className="text-[10px] tracking-wider text-slate-400 font-sans uppercase font-medium"
                  >
                    Scroll down for the final ending 💖
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
