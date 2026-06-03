"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Moon, Star } from "lucide-react";

interface ChatBubble {
  id: number;
  sender: "riyaz" | "gowthamm";
  text: string;
  time: string;
  delay: number;
}

export default function LateNightTalks() {
  const chats: ChatBubble[] = [
    {
      id: 1,
      sender: "riyaz",
      text: "Nee goodnight message lekunda complete ayye feeling raadhu bangaram... 😋",
      time: "11:58 PM",
      delay: 0.2,
    },
    {
      id: 2,
      sender: "gowthamm",
      text: "Aww nannaa 🫠, andhuke mandatory goodnight text petta kadaa 🩷",
      time: "11:59 PM",
      delay: 0.7,
    },
    {
      id: 3,
      sender: "riyaz",
      text: "Stay forever, please? Nuvve naa absolute comfort, naa peace. 💞",
      time: "12:01 AM",
      delay: 1.2,
    },
    {
      id: 4,
      sender: "gowthamm",
      text: "You stole my heart Riyazzz 💖. Forever is a promise! Goodnight my bangarammmm 😘",
      time: "12:02 AM",
      delay: 1.8,
    },
  ];

  return (
    <section
      id="chats"
      className="relative min-h-screen py-24 px-6 md:px-12 bg-[#09070f] text-[#FFF0F2] paper-texture-dark flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Moonlight blur background glow */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-purple-900/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-pink-900/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Starry details */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" suppressHydrationWarning>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            suppressHydrationWarning
            className="absolute text-pink-300/15"
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
            }}
            animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: Math.random() * 4 + 3 }}
          >
            <Star className="w-2.5 h-2.5 fill-current" />
          </motion.div>
        ))}
      </div>

      {/* Floating Moonlight Crescent */}
      <div className="absolute top-16 left-12 opacity-20 pointer-events-none">
        <Moon className="w-16 h-16 text-pink-200 fill-pink-100/10 rotate-12" />
      </div>

      {/* Header */}
      <div className="text-center mb-16 relative z-10 max-w-xl mx-auto">
        <span className="text-xs tracking-widest text-[#E0A899] uppercase block mb-2 font-medium">
          Midnight Logs
        </span>
        <h2 className="font-caveat text-4xl md:text-5xl text-pink-100">
          Late Night Talks
        </h2>
        <p className="text-xs text-pink-200/50 font-sans mt-3">
          When the world went quiet, we found our comfort place.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl w-full relative z-10 justify-items-center items-center">
        
        {/* Left Side: Polaroid Chat Screenshots */}
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-60 bg-[#120e16] border border-pink-900/20 p-3 rounded-sm shadow-xl flex flex-col gap-3 rotate-2 hover:rotate-0 transition-transform duration-300"
          >
            <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-slate-950">
              <Image
                src="/photos/late-night-talks.jpeg"
                alt="Late night talks screenshot"
                fill
                sizes="250px"
                className="object-cover transition-opacity duration-300 opacity-90"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII="
              />
            </div>
            <div className="text-center py-1">
              <span className="font-caveat text-lg text-pink-200/70 font-medium">
                "our comfort hours"
              </span>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="w-60 bg-[#120e16] border border-pink-900/20 p-3 rounded-sm shadow-xl flex flex-col gap-3 -rotate-1 hover:rotate-0 transition-transform duration-300"
          >
            <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-slate-950">
              <Image
                src="/photos/talks-2.jpeg"
                alt="Silly chats screenshot"
                fill
                sizes="250px"
                className="object-cover transition-opacity duration-300 opacity-90"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII="
              />
            </div>
            <div className="text-center py-1">
              <span className="font-caveat text-lg text-pink-200/70 font-medium">
                "sleep was secondary"
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Animated Floating Chat Bubbles */}
        <div className="w-full max-w-md flex flex-col gap-4 bg-[#120f18]/80 border border-pink-900/10 p-6 rounded-sm shadow-inner relative">
          <div className="absolute top-2 right-4 flex gap-1 items-center">
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-[10px] text-pink-300/40 uppercase tracking-widest font-sans">
              Online with you
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-4 h-96 overflow-y-auto no-scrollbar justify-end pb-2">
            {chats.map((bubble) => {
              const isRiyaz = bubble.sender === "riyaz";
              return (
                <motion.div
                  key={bubble.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: bubble.delay }}
                  className={`flex flex-col max-w-[80%] ${
                    isRiyaz ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed font-sans ${
                      isRiyaz
                        ? "bg-[#E0A899] text-[#2d2626] rounded-tr-none"
                        : "bg-[#1f1927] border border-pink-950/40 text-pink-100 rounded-tl-none"
                    }`}
                  >
                    {bubble.text}
                  </div>
                  <span className="text-[9px] text-pink-300/30 mt-1 font-sans">
                    {bubble.time}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
