"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAudio } from "@/context/AudioContext";

interface PolaroidItem {
  id: number;
  src: string;
  caption: string;
  backNote: string;
  rotation: string; // Tailwind rotation class
}

export default function TheGirlScrapbook() {
  const { playPaper } = useAudio();
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const polaroids: PolaroidItem[] = [
    {
      id: 1,
      src: "/photos/her-1.jpeg",
      caption: "my favourite human",
      backNote: "My favourite human... how are you this pretty naturally? 😭💗",
      rotation: "-rotate-2 hover:rotate-1",
    },
    {
      id: 2,
      src: "/photos/her-2.jpeg",
      caption: "pure comfort",
      backNote: "Every picture of yours became my favourite lockscreen background 🫠.",
      rotation: "rotate-3 hover:rotate-0",
    },
    {
      id: 3,
      src: "/photos/her-3.jpeg",
      caption: "those eyes 💖",
      backNote: "Your eyes tell a beautiful story that I want to read forever.",
      rotation: "-rotate-1 hover:-rotate-3",
    },
    {
      id: 4,
      src: "/photos/her-4.jpeg",
      caption: "cutest smile",
      backNote: "That sweet smile that can instantly turn my worst days into pure comfort.",
      rotation: "rotate-2 hover:-rotate-1",
    },
    {
      id: 5,
      src: "/photos/her-5.jpeg",
      caption: "my peaceful view",
      backNote: "A simple picture of yours is enough to keep me smiling all day.",
      rotation: "-rotate-3 hover:rotate-2",
    },
    {
      id: 6,
      src: "/photos/her-6.jpeg",
      caption: "angelic 🌸",
      backNote: "In a room full of art, I would still stare at you.",
      rotation: "rotate-1 hover:rotate-3",
    },
    {
      id: 7,
      src: "/photos/her-7.jpeg",
      caption: "my pretty bangaram",
      backNote: "My bangaram, you look cute without even trying 🫠.",
      rotation: "-rotate-2 hover:rotate-0",
    },
  ];

  const handleFlip = (id: number) => {
    playPaper();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="scrapbook"
      className="relative min-h-screen py-24 px-6 md:px-12 flex flex-col items-center justify-center bg-[#0d0a0a] paper-texture-dark overflow-hidden border-t border-red-950/20"
    >
      {/* Decorative floating rose petals - restricted count for mobile stability */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" suppressHydrationWarning>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            suppressHydrationWarning
            className="absolute bg-rose-300/10 rounded-full blur-[0.5px]"
            style={{
              width: `${Math.random() * 12 + 6}px`,
              height: `${Math.random() * 12 + 6}px`,
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              animation: `sway ${Math.random() * 6 + 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Header title */}
      <div className="text-center mb-16 relative z-10 max-w-xl">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 0.6, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs tracking-widest text-[#E0A899] uppercase block mb-2 font-medium"
        >
          Gallery of Happiness
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-caveat text-4xl md:text-5xl text-pink-100"
        >
          The Girl I Never Forgot
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xs text-pink-200/50 mt-3 font-light leading-relaxed"
        >
          Tap on any photo to read a hidden note 💌
        </motion.p>
      </div>

      {/* Polaroid Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl relative z-10 w-full justify-items-center">
        {polaroids.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: idx * 0.08, ease: "easeOut" }}
            className={`w-64 h-80 perspective-1000 cursor-pointer ${item.rotation} transition-all duration-300`}
            onClick={() => handleFlip(item.id)}
          >
            <div
              className={`relative w-full h-full preserve-3d duration-700 transition-transform ${
                flippedCards[item.id] ? "rotate-y-180" : ""
              }`}
            >
              {/* Polaroid Front Side (White photo style against dark background - high contrast aesthetic) */}
              <div className="absolute inset-0 w-full h-full bg-[#FFFDF9] border border-slate-200/20 p-3 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.15)] backface-hidden rounded-sm">
                {/* Washi Tape Accent */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-5 washi-tape rotate-1 z-20" />

                {/* Polaroid Photo Frame */}
                <div className="relative w-full h-56 bg-slate-100/60 overflow-hidden flex items-center justify-center rounded-sm">
                  <Image
                    src={item.src}
                    alt={item.caption}
                    fill
                    sizes="(max-width: 768px) 100vw, 250px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority={idx < 4}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII="
                  />
                </div>

                {/* Polaroid Handwritten Caption */}
                <div className="py-2 text-center h-14 flex items-center justify-center">
                  <span className="font-caveat text-2xl text-slate-700 font-medium">
                    {item.caption}
                  </span>
                </div>
              </div>

              {/* Polaroid Back Side (Hidden note in black paper theme) */}
              <div className="absolute inset-0 w-full h-full bg-[#1b1717] border border-pink-900/20 p-6 flex flex-col justify-center items-center shadow-[0_4px_25px_rgba(0,0,0,0.1)] rotate-y-180 backface-hidden rounded-sm text-center">
                {/* Back side tape stamp */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-5 washi-tape-black -rotate-2 z-20" />

                {/* Notebook paper line overlays */}
                <div className="absolute inset-y-6 inset-x-4 border-t border-b border-dashed border-pink-950/20 flex flex-col justify-between pointer-events-none" />

                <p className="font-caveat text-2xl text-pink-100 leading-relaxed font-light px-2 relative z-10">
                  {item.backNote}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
