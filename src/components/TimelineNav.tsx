"use client";

import React, { useEffect, useState } from "react";
import { useAudio } from "@/context/AudioContext";

interface Section {
  id: string;
  label: string;
  year?: string;
}

export default function TimelineNav() {
  const { playSparkle } = useAudio();
  const [activeSection, setActiveSection] = useState("");

  const sections: Section[] = [
    { id: "intro", label: "Intro", year: "Home" },
    { id: "scrapbook", label: "The Girl", year: "2024" },
    { id: "timeline", label: "Timeline", year: "Sep" },
    { id: "videos", label: "Moments", year: "Oct" },
    { id: "chats", label: "Chats", year: "Midn" },
    { id: "voicenote", label: "Voice", year: "2025" },
    { id: "letter", label: "Letter", year: "June" },
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px", // triggers when section occupies the center of the viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-6 select-none">
      {/* Central thin vine line connecting the dots */}
      <div className="absolute top-4 bottom-4 w-[1px] bg-pink-300/30" />

      {sections.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <div
            key={sec.id}
            onClick={() => handleScrollTo(sec.id)}
            onMouseEnter={playSparkle}
            className="group relative flex items-center justify-end cursor-pointer py-1"
          >
            {/* Year / Title Tooltip label */}
            <span
              className={`absolute right-8 text-xs tracking-wider transition-all duration-300 font-caveat opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 ${
                isActive ? "text-[#E0A899] font-medium" : "text-slate-400"
              }`}
            >
              {sec.label} ({sec.year})
            </span>

            {/* Vertical node dot indicator */}
            <div
              className={`relative z-10 w-3.5 h-3.5 rounded-full border transition-all duration-500 flex items-center justify-center ${
                isActive
                  ? "bg-[#E0A899] border-[#E0A899] scale-125 shadow-[0_0_10px_rgba(224,168,153,0.5)]"
                  : "bg-cream border-pink-300/60 scale-100 group-hover:border-[#E0A899]"
              }`}
            >
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-cream animate-ping" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
