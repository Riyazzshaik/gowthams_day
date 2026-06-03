"use client";

import React from "react";
import { motion } from "framer-motion";

interface VideoMoment {
  id: number;
  src: string;
  caption: string;
  rotation: string;
}

export default function CuteMoments() {
  const videos: VideoMoment[] = [
    {
      id: 1,
      src: "/videos/cute-checkup-1.mp4",
      caption: "the way you look at the camera 😭",
      rotation: "rotate-1",
    },
    {
      id: 2,
      src: "/videos/cute-checkup-2.mp4",
      caption: "my favourite human",
      rotation: "-rotate-2",
    },
    {
      id: 3,
      src: "/videos/cute-checkup-3.mp4",
      caption: "cute without trying",
      rotation: "rotate-3",
    },
    {
      id: 4,
      src: "/videos/cute-checkup-4.mp4",
      caption: "pure comfort 💖",
      rotation: "-rotate-1",
    },
    {
      id: 5,
      src: "/videos/cute-checkup-5.mp4",
      caption: "never want this smile to fade",
      rotation: "rotate-2",
    },
  ];

  return (
    <section
      id="videos"
      className="relative min-h-screen py-24 px-6 md:px-12 flex flex-col items-center justify-center bg-cream paper-texture overflow-hidden"
    >
      {/* Visual background layers */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-pink-100/20 rounded-full filter blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-16 relative z-10 max-w-xl mx-auto">
        <span className="text-xs tracking-widest text-[#E0A899] uppercase block mb-2 font-medium">
          Mini Vlogs
        </span>
        <h2 className="font-caveat text-4xl md:text-5xl text-slate-800">
          Little Moments That Made Me Smile
        </h2>
        <p className="text-sm font-light text-slate-500 font-sans mt-3">
          Just some random aesthetic daily clips of you being adorable.
        </p>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl relative z-10 w-full justify-items-center">
        {videos.map((vid, idx) => (
          <motion.div
            key={vid.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
            className={`w-56 bg-[#FFFDF9] border border-slate-200/50 p-2.5 flex flex-col justify-between shadow-[0_4px_15px_rgba(0,0,0,0.03)] rounded-sm cursor-default hover:shadow-md transition-shadow duration-300 hover:scale-[1.02] ${vid.rotation}`}
          >
            {/* Washi Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 washi-tape -rotate-1 z-20" />

            {/* Video Frame */}
            <div className="relative w-full aspect-[3/4] bg-slate-50 rounded-sm overflow-hidden border border-slate-100 flex items-center justify-center">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              >
                <source src={vid.src} type="video/mp4" />
              </video>
            </div>

            {/* Polaroid handwritten description */}
            <div className="py-2.5 text-center min-h-12 flex items-center justify-center">
              <span className="font-caveat text-lg text-slate-700 leading-snug font-medium">
                {vid.caption}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
