"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAudio } from "@/context/AudioContext";
import { Heart, Lock } from "lucide-react";

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  images: string[];
  align: "left" | "right";
  vibe: string;
}

export default function StoryTimeline() {
  const { playPaper } = useAudio();

  const events: TimelineEvent[] = [
    {
      id: 1,
      date: "29 September 2024",
      title: "One random message...",
      description: "Nuvvu Snapchat lo first message chesina roju 💞. Aa small 'Hi' naa life lo inta happiness teesukosthundhi ani appudu asalu teliyaledhu. Friendship started...",
      images: ["/photos/first-text.jpeg"],
      align: "left",
      vibe: "friendship",
    },
    {
      id: 2,
      date: "5 October 2024",
      title: "First Selfie Together",
      description: "The first picture of you that I never stopped smiling at. September chats nundi, ninnu chusthe chalu ani anipinche feeling modhalaindhi 🫠.",
      images: ["/photos/first-selfie.jpeg"],
      align: "right",
      vibe: "attachment",
    },
    {
      id: 3,
      date: "Late 2024",
      title: "Mana Conversations & Fights",
      description: "Mana chats calls nundi start ayi patchups, fights, care, understanding ila mana connection scale out ayyindhi. You became my habit, my comfort 🤪.",
      images: ["/photos/confession.jpeg", "/photos/confession-2.jpeg"],
      align: "left",
      vibe: "bonding",
    },
    {
      id: 4,
      date: "29 June 2025",
      title: "First Love You 🩷",
      description: "When words finally spoke what our hearts knew. 'I love you Riyazzz 🩷' - my heart skipped a beat, and everything fell into place.",
      images: ["/photos/first-loveyou.jpeg"],
      align: "right",
      vibe: "love",
    },
    {
      id: 5,
      date: "3 August 2025",
      title: "The Emotional Paragraphs",
      description: "Daily goodnight text mandatory, and those long paragraphs that remind me how much I mean to you. Nuvvu naa absolute peace, naa bangaram 😋.",
      images: ["/photos/emotional-message.jpeg", "/photos/emotional-2.jpeg"],
      align: "left",
      vibe: "forever",
    },
  ];

  return (
    <section
      id="timeline"
      className="relative min-h-screen py-28 px-6 md:px-12 bg-cream/30 paper-texture overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100/30 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-beige/30 rounded-full filter blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center mb-24 relative z-10 max-w-xl mx-auto">
        <span className="text-xs tracking-widest text-[#E0A899] uppercase block mb-2 font-medium">
          Our Journey
        </span>
        <h2 className="font-caveat text-4xl md:text-5xl text-slate-800">
          How It Started...
        </h2>
        <p className="text-sm font-light text-slate-500 font-sans mt-3">
          Scroll down to unlock and reveal our memories 🌸
        </p>
      </div>

      {/* Timeline Wrapper */}
      <div className="relative max-w-5xl mx-auto w-full z-10">
        {/* Growing Timeline Stem (SVG vine line) */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-pink-200/50 -translate-x-1/2 hidden md:block" />
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-pink-200/50 md:hidden" />

        {/* Timeline Events list */}
        <div className="space-y-20">
          {events.map((event, idx) => {
            const isLeft = event.align === "left";
            return (
              <div
                key={event.id}
                className={`relative flex flex-col md:flex-row items-stretch w-full ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline center node dot */}
                <div className="absolute left-4 md:left-1/2 top-6 w-8 h-8 rounded-full border border-[#E0A899]/30 bg-cream -translate-x-1/2 flex items-center justify-center z-20 shadow-sm">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Heart className="w-4 h-4 text-[#E0A899] fill-[#E0A899]/20" />
                  </motion.div>
                </div>

                {/* Left/Right Card column spacer for desktop */}
                <div className="w-full md:w-1/2 hidden md:block" />

                {/* Card Container Column */}
                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12 flex justify-start">
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? 50 : -50, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    onViewportEnter={playPaper}
                    className="relative w-full max-w-md bg-[#FFFDF9] border border-slate-200/60 p-5 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-4"
                  >
                    {/* Memory Unlocked Indicator */}
                    <div className="absolute -top-3 right-4 bg-pink-100/60 border border-pink-200/30 text-[10px] uppercase tracking-widest text-[#E0A899] px-2 py-0.5 rounded-full font-sans">
                      {event.vibe}
                    </div>

                    {/* Polaroid tape stamp effect */}
                    <div className="absolute -top-3 left-6 w-14 h-4.5 washi-tape rotate-1" />

                    {/* Event Date stamp */}
                    <span className="font-caveat text-xl text-[#E0A899] font-medium leading-none block pt-2">
                      {event.date}
                    </span>

                    {/* Event Title */}
                    <h3 className="font-sans text-lg font-medium text-slate-800">
                      {event.title}
                    </h3>

                    {/* Narrative Description */}
                    <p className="text-xs text-slate-600 font-sans leading-relaxed font-light">
                      {event.description}
                    </p>

                    {/* Event Image Box */}
                    <div
                      className={`grid gap-3 mt-2 ${
                        event.images.length > 1 ? "grid-cols-2" : "grid-cols-1"
                      }`}
                    >
                      {event.images.map((imgSrc, imgIdx) => (
                        <div
                          key={imgIdx}
                          className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 rounded-sm border border-slate-200/40"
                        >
                          {/* Locked overlay placeholder */}
                          <motion.div
                            initial={{ opacity: 1 }}
                            whileInView={{ opacity: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="absolute inset-0 bg-[#FFFDF9]/95 z-10 flex flex-col items-center justify-center gap-1.5 pointer-events-none"
                          >
                            <Lock className="w-5 h-5 text-[#E0A899]/50 animate-pulse" />
                            <span className="text-[9px] font-sans tracking-widest text-[#E0A899]/70 uppercase">
                              Unlocking...
                            </span>
                          </motion.div>

                          <Image
                            src={imgSrc}
                            alt={event.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            className="object-cover transition-transform duration-700 hover:scale-105"
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII="
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
