"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/context/AudioContext";
import { Play, Pause, Music, Sparkles } from "lucide-react";

export default function VoiceMemories() {
  const {
    isPlayingVoiceNote,
    playVoiceNote,
    pauseVoiceNote,
    voiceNoteProgress,
    voiceNoteCurrentTime,
    voiceNoteDuration,
    playPaper,
  } = useAudio();

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handlePlayToggle = () => {
    playPaper();
    if (isPlayingVoiceNote) {
      pauseVoiceNote();
    } else {
      playVoiceNote();
    }
  };

  // Generate 16 bars for the custom visualizer
  const bars = [...Array(16)];

  return (
    <section
      id="voicenote"
      className="relative min-h-screen py-24 px-6 md:px-12 flex flex-col items-center justify-center bg-[#FFFDF9] paper-texture overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-100/30 rounded-full filter blur-3xl pointer-events-none" />

      {/* Cinematic dimming focus overlay */}
      <AnimatePresence>
        {isPlayingVoiceNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-[#0d0a0a]/90 backdrop-blur-md z-20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Title Header */}
      <div
        className={`text-center mb-16 relative z-30 max-w-xl mx-auto transition-colors duration-1000 ${
          isPlayingVoiceNote ? "text-pink-100" : "text-slate-800"
        }`}
      >
        <span className="text-xs tracking-widest text-[#E0A899] uppercase block mb-2 font-medium">
          Audio Archive
        </span>
        <h2 className="font-caveat text-4xl md:text-5xl">Voice Memories</h2>
        <p
          className={`text-xs font-sans mt-3 transition-colors duration-1000 ${
            isPlayingVoiceNote ? "text-pink-200/50" : "text-slate-500"
          }`}
        >
          Tap the memory card to hear the sound of her voice 💗.
        </p>
      </div>

      {/* Interactive Music Player Card */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`relative z-30 w-full max-w-sm border p-8 flex flex-col items-center gap-8 shadow-xl transition-all duration-1000 ${
          isPlayingVoiceNote
            ? "bg-[#1b1717]/90 border-pink-900/40 text-pink-100 scale-105 shadow-[0_0_35px_rgba(236,72,153,0.15)]"
            : "bg-[#FFFDF9] border-slate-200/60 text-slate-800"
        } rounded-sm`}
      >
        {/* Paper tape overlay */}
        <div className="absolute -top-3.5 left-12 w-16 h-5 washi-tape z-20" />

        {/* Vintage record / glowing circle container */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={
              isPlayingVoiceNote
                ? { rotate: 360 }
                : { rotate: 0 }
            }
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className={`w-36 h-36 rounded-full border-2 flex items-center justify-center transition-colors duration-1000 ${
              isPlayingVoiceNote
                ? "border-pink-500/20 bg-pink-500/5 shadow-[0_0_20px_rgba(236,72,153,0.05)]"
                : "border-slate-200/80 bg-slate-50"
            }`}
          >
            {/* inner circle */}
            <div
              className={`w-28 h-28 rounded-full border border-dashed flex items-center justify-center transition-colors duration-1000 ${
                isPlayingVoiceNote
                  ? "border-pink-400/20 bg-[#161212]"
                  : "border-slate-300/40 bg-white"
              }`}
            >
              <Music
                className={`w-10 h-10 transition-colors duration-1000 ${
                  isPlayingVoiceNote ? "text-pink-300" : "text-slate-400"
                }`}
              />
            </div>
          </motion.div>

          {/* Floating note sparks */}
          {isPlayingVoiceNote && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: [0, (i - 1) * 35, (i - 1) * 55],
                    y: [0, -35, -70],
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: i * 0.6,
                  }}
                  className="absolute left-[45%] top-[40%] text-pink-300"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Waveform Custom Visualizer */}
        <div className="flex justify-center items-end gap-1.5 h-12 w-full px-4">
          {bars.map((_, i) => {
            // Create random height animations for active state
            const targetHeights = isPlayingVoiceNote
              ? [12, Math.random() * 35 + 15, 12]
              : [8, 8, 8];

            return (
              <motion.div
                key={i}
                animate={{ height: targetHeights }}
                transition={{
                  repeat: Infinity,
                  duration: Math.random() * 0.6 + 0.8,
                  ease: "easeInOut",
                }}
                className={`w-1.5 rounded-full transition-colors duration-1000 ${
                  isPlayingVoiceNote ? "bg-[#E0A899]" : "bg-slate-300/50"
                }`}
              />
            );
          })}
        </div>

        {/* Progress & Timing */}
        <div className="w-full flex flex-col gap-2">
          {/* Slider */}
          <div
            className={`w-full h-1 rounded-full overflow-hidden transition-colors duration-1000 ${
              isPlayingVoiceNote ? "bg-[#251c1c]" : "bg-slate-200"
            }`}
          >
            <div
              className="h-full bg-[#E0A899]"
              style={{ width: `${voiceNoteProgress}%` }}
            />
          </div>
          {/* Time Labels */}
          <div className="flex justify-between text-[10px] font-sans text-slate-400">
            <span>{formatTime(voiceNoteCurrentTime)}</span>
            <span>{formatTime(voiceNoteDuration)}</span>
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={handlePlayToggle}
          className={`flex items-center justify-center w-14 h-14 rounded-full border transition-all duration-300 cursor-pointer ${
            isPlayingVoiceNote
              ? "bg-[#E0A899] border-[#E0A899] text-[#2d2626] hover:scale-105"
              : "bg-cream border-slate-300/80 text-slate-700 hover:border-[#E0A899] hover:text-[#E0A899]"
          }`}
        >
          {isPlayingVoiceNote ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-1" />
          )}
        </button>
      </motion.div>
    </section>
  );
}
