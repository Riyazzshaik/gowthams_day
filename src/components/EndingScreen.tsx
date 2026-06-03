"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useAudio } from "@/context/AudioContext";

type ClimaxStage = "playing" | "fading" | "goodnight" | "ended";

export default function EndingScreen() {
  const {
    transitionToBgm,
    fadeAndStopAllAudio,
  } = useAudio();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Set threshold to 0.3 to trigger reliably
  const isInView = useInView(containerRef, {
    amount: 0.3,
  });

  const [climaxStage, setClimaxStage] = useState<ClimaxStage>("playing");
  const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null);
  const [visibleMemories, setVisibleMemories] = useState<string[]>([]);
  const [isFadedToBlack, setIsFadedToBlack] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Animation orchestration refs to ensure clean lifecycle tracking
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const timelineStartedRef = useRef(false);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [activeTimeline, setActiveTimeline] = useState(false);
  const bgmTriggeredRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Debounce scroll resets to prevent premature state destruction on scroll oscillations
  useEffect(() => {
    if (isInView) {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
      setActiveTimeline(true);
    } else {
      resetTimerRef.current = setTimeout(() => {
        setActiveTimeline(false);
        resetTimerRef.current = null;
      }, 800);
    }

    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, [isInView]);

  // Canvas particle rain system (Drifting rose petals & golden dust)
  useEffect(() => {
    if (
      !canvasRef.current ||
      !activeTimeline ||
      isFadedToBlack ||
      climaxStage === "goodnight" ||
      climaxStage === "ended"
    ) {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.width = window.innerWidth;
      height = canvasRef.current.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    interface Petal {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      angle: number;
      spin: number;
      opacity: number;
      color: string;
      wobble: number;
      wobbleSpeed: number;
    }

    interface Dust {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      pulseSpeed: number;
      pulseAngle: number;
    }

    const petals: Petal[] = [];
    const dusts: Dust[] = [];
    const petalColors = ["#FBC5C8", "#FFFDF9", "#FFE1E5", "#FFF0F2", "#E0A899"];

    // Initialize 12 petals (gentle, not overcrowded)
    for (let i = 0; i < 12; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * -height - 20,
        size: Math.random() * 6 + 5,
        speedY: Math.random() * 0.5 + 0.3,
        speedX: Math.random() * 0.3 + 0.2,
        angle: Math.random() * Math.PI * 2,
        spin: Math.random() * 0.01 - 0.005,
        opacity: Math.random() * 0.4 + 0.3,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        wobble: Math.random() * 2,
        wobbleSpeed: Math.random() * 0.015 + 0.005,
      });
    }

    // Initialize 25 dust particles
    for (let i = 0; i < 25; i++) {
      dusts.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.8,
        speedY: -(Math.random() * 0.2 + 0.05),
        speedX: Math.random() * 0.1 - 0.05,
        opacity: Math.random() * 0.3 + 0.1,
        pulseSpeed: Math.random() * 0.015 + 0.005,
        pulseAngle: Math.random() * Math.PI,
      });
    }

    const animate = () => {
      // Exit and clear canvas immediately when fading to black
      if (isFadedToBlack) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw dust
      dusts.forEach((d) => {
        d.y += d.speedY;
        d.x += d.speedX;
        d.pulseAngle += d.pulseSpeed;

        const currentOpacity = d.opacity * (0.6 + Math.sin(d.pulseAngle) * 0.4);

        if (d.y < -10) d.y = height + 10;
        if (d.x < -10) d.x = width + 10;
        if (d.x > width + 10) d.x = -10;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253, 244, 219, ${currentOpacity})`;
        ctx.shadowBlur = 3;
        ctx.shadowColor = "rgba(253, 244, 219, 0.6)";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw petals
      petals.forEach((p) => {
        p.y += p.speedY;
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.3;
        p.angle += p.spin;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTimeline, climaxStage, isFadedToBlack]);

  // Climax Timeline Manager
  useEffect(() => {
    if (!isMounted || !activeTimeline) {
      // RESET ALL TIMELINES
      setClimaxStage("playing");
      setActiveSubtitle(null);
      setVisibleMemories([]);
      setIsFadedToBlack(false);

      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      timelineStartedRef.current = false;
      bgmTriggeredRef.current = false;
      return;
    }

    if (timelineStartedRef.current) return;
    timelineStartedRef.current = true;

    // Start video playback
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = 1.0;
      videoRef.current.play().catch((e) => console.log("video play blocked", e));
    }

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    // FADE IN POLAROID MEMORIES ONE BY ONE (near corners and edges)
    timersRef.current.push(
      setTimeout(() => setVisibleMemories((prev) => [...prev, "selfie"]), 1000)
    );
    timersRef.current.push(
      setTimeout(() => setVisibleMemories((prev) => [...prev, "coupled"]), 2000)
    );
    timersRef.current.push(
      setTimeout(() => setVisibleMemories((prev) => [...prev, "talks"]), 3000)
    );
    timersRef.current.push(
      setTimeout(() => setVisibleMemories((prev) => [...prev, "loveyou"]), 4000)
    );
    timersRef.current.push(
      setTimeout(() => setVisibleMemories((prev) => [...prev, "universe"]), 5000)
    );

    // FADE OUT POLAROID MEMORIES ONE BY ONE (dissolve naturally by 13s)
    timersRef.current.push(
      setTimeout(
        () => setVisibleMemories((prev) => prev.filter((x) => x !== "selfie")),
        8000
      )
    );
    timersRef.current.push(
      setTimeout(
        () => setVisibleMemories((prev) => prev.filter((x) => x !== "coupled")),
        8800
      )
    );
    timersRef.current.push(
      setTimeout(
        () => setVisibleMemories((prev) => prev.filter((x) => x !== "talks")),
        9600
      )
    );
    timersRef.current.push(
      setTimeout(
        () => setVisibleMemories((prev) => prev.filter((x) => x !== "loveyou")),
        10400
      )
    );
    timersRef.current.push(
      setTimeout(
        () => setVisibleMemories((prev) => prev.filter((x) => x !== "universe")),
        11200
      )
    );

    // SUBTITLES TIMELINE (0s - 34s)
    // 0s - 5s: "From random conversations…"
    timersRef.current.push(
      setTimeout(
        () => setActiveSubtitle("From random conversations…"),
        100
      )
    );
    timersRef.current.push(setTimeout(() => setActiveSubtitle(null), 5000));

    // 6s - 11s: "To becoming my favorite person…"
    timersRef.current.push(
      setTimeout(() => setActiveSubtitle("To becoming my favorite person…"), 6000)
    );
    timersRef.current.push(setTimeout(() => setActiveSubtitle(null), 11000));

    // 12s - 18s: "And somehow… you became my favorite future."
    timersRef.current.push(
      setTimeout(
        () =>
          setActiveSubtitle(
            "And somehow…\nyou became my favorite future."
          ),
        12000
      )
    );
    timersRef.current.push(setTimeout(() => setActiveSubtitle(null), 18000));

    // 19s - 26s: "I don’t just dream about Paris anymore… I dream about Paris with you."
    timersRef.current.push(
      setTimeout(
        () =>
          setActiveSubtitle(
            "I don’t just dream about Paris anymore…\nI dream about Paris with you."
          ),
        19000
      )
    );
    timersRef.current.push(setTimeout(() => setActiveSubtitle(null), 26000));

    // 30s: Start slow BGM fade out and dim video
    timersRef.current.push(
      setTimeout(() => {
        setClimaxStage("fading");
        fadeAndStopAllAudio(4.0); // fade out "Until I Found You" over 4s
        if (videoRef.current) {
          videoRef.current.playbackRate = 0.55; // slow down movement
        }
      }, 30000)
    );

    // 34s - 39s: Full fade to black, pause video, show "Goodnight, love 💗" in silence
    timersRef.current.push(
      setTimeout(() => {
        setClimaxStage("goodnight");
        setActiveSubtitle("Goodnight, love 💗");
        setIsFadedToBlack(true);
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }, 34000)
    );

    // 39s: End of film sequence (remains solid black, NO UI)
    timersRef.current.push(
      setTimeout(() => {
        setClimaxStage("ended");
        setActiveSubtitle(null);
      }, 39000)
    );
  }, [isMounted, activeTimeline]);

  // Audio BGM transition when section enters view (with loop prevention)
  useEffect(() => {
    if (isMounted && activeTimeline && !isFadedToBlack && !bgmTriggeredRef.current) {
      bgmTriggeredRef.current = true;
      transitionToBgm("climax");
    } else if (!activeTimeline) {
      bgmTriggeredRef.current = false;
    }
  }, [isMounted, activeTimeline, transitionToBgm, isFadedToBlack]);

  // Memories coordinates located strictly near corners/edges, leaving the center clean
  const memories = [
    {
      id: "selfie",
      src: "/photos/first-selfie.jpeg",
      caption: "our first selfie 🤳",
      className: "left-[4%] md:left-[6%] top-[12%] md:top-[15%] -rotate-6",
    },
    {
      id: "coupled",
      src: "/photos/coupled.jpeg",
      caption: "the day we became 'us' 💗",
      className: "right-[4%] md:right-[6%] top-[10%] md:top-[12%] rotate-8",
    },
    {
      id: "talks",
      src: "/photos/late-night-talks.jpeg",
      caption: "midnight conversations 💬",
      className: "left-[3%] md:left-[5%] bottom-[12%] md:bottom-[15%] rotate-3 hidden sm:block",
    },
    {
      id: "loveyou",
      src: "/photos/first-loveyou.jpeg",
      caption: "that first 'i love you' 💌",
      className: "right-[3%] md:right-[5%] bottom-[12%] md:bottom-[15%] -rotate-5 hidden sm:block",
    },
    {
      id: "universe",
      src: "/photos/our-story.jpeg",
      caption: "in our little universe ✨",
      className: "right-[3%] md:right-[4%] top-[38%] md:top-[40%] -rotate-3 hidden md:block",
    },
  ];

  // Variants for vintage polaroids: opacity fade + blur transition + drift + scale (1.0 -> 1.02)
  const memoryVariants = {
    hidden: { opacity: 0, scale: 0.95, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      scale: [1.0, 1.02, 1.0],
      filter: "blur(0px)",
      y: [0, -8, 0],
      transition: {
        opacity: { duration: 1.8, ease: "easeInOut" as any },
        filter: { duration: 1.8, ease: "easeInOut" as any },
        scale: { duration: 6, repeat: Infinity, ease: "easeInOut" as any },
        y: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut" as any,
          delay: Math.random() * 2,
        },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: "blur(12px)",
      transition: { duration: 1.8, ease: "easeInOut" as any },
    },
  };

  return (
    <section
      ref={containerRef}
      id="ending"
      className="relative min-h-screen h-screen bg-[#040305] text-[#FFF0F2] flex flex-col items-center justify-center overflow-hidden z-30 select-none"
    >
      {/* 1. Canvas particle rain system */}
      {climaxStage !== "goodnight" && climaxStage !== "ended" && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        />
      )}

      {/* Film grain effect overlay */}
      <div className="film-grain-cinematic" />

      {/* Dark warm night solid backdrop */}
      <div className="absolute inset-0 bg-[#030204] pointer-events-none z-0" />

      {/* 2. Main video wrapper - cinematic slow zoom */}
      <motion.div
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden z-10"
        animate={{
          scale: climaxStage === "playing" ? 1.08 : 1.085,
        }}
        transition={{
          duration: climaxStage === "playing" ? 30 : 10,
          ease: "easeOut",
        }}
      >
        <video
          ref={videoRef}
          src="/videos/paris_couple.mp4"
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover filter brightness-[0.95] contrast-[1.02] saturate-[1.05]"
        />

        {/* Warm night color grading filter overlay */}
        <div className="absolute inset-0 bg-[#ffa500]/5 mix-blend-overlay pointer-events-none z-11" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030204]/25 to-[#030204]/85 pointer-events-none z-11" />

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(3,2,4,0.85)_100%)] pointer-events-none z-11" />
      </motion.div>

      {/* 3. Slow dimming overlay */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none z-15"
        animate={{
          opacity:
            climaxStage === "playing"
              ? 0.15
              : climaxStage === "fading"
              ? 0.6
              : 1.0,
        }}
        transition={{ duration: 4.0, ease: "easeInOut" }}
      />

      {/* 4. Memories Layer (Vintage polaroids softly drifting in corners/edges) */}
      <AnimatePresence>
        {isMounted &&
          climaxStage === "playing" &&
          memories.map((mem) => {
            const isVisible = visibleMemories.includes(mem.id);
            if (!isVisible) return null;
            return (
              <motion.div
                key={mem.id}
                variants={memoryVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`absolute w-36 h-48 md:w-44 md:h-56 polaroid-old z-30 select-none ${mem.className}`}
              >
                {/* Washi Tape */}
                <div className="tape-overlay" />

                {/* Photo container */}
                <div className="relative w-full h-[72%] bg-[#100e0e] overflow-hidden border border-black/10">
                  <img
                    src={mem.src}
                    alt={mem.caption}
                    className="w-full h-full object-cover filter sepia-[0.06] contrast-[1.02]"
                    loading="lazy"
                  />
                  <div className="film-grain" />
                </div>

                {/* Caption */}
                <div className="text-center pt-2.5 px-0.5">
                  <p className="font-caveat text-xs md:text-sm text-slate-800 font-semibold tracking-wide truncate">
                    {mem.caption}
                  </p>
                </div>
              </motion.div>
            );
          })}
      </AnimatePresence>

      {/* 5. Subtitles Overlay (Floating handwritten text with soft warm glow, no harsh boxes, z-60 to show over black cover) */}
      <div className="absolute bottom-[16%] left-1/2 -translate-x-1/2 z-60 w-full max-w-2xl px-6 flex justify-center pointer-events-none select-none text-center">
        <AnimatePresence mode="wait">
          {activeSubtitle && (climaxStage === "playing" || climaxStage === "fading" || climaxStage === "goodnight") && (
            <motion.div
              key={activeSubtitle}
              initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
              transition={{ duration: 1.6, ease: "easeInOut" as any }}
              className="max-w-full bg-black/15 backdrop-blur-[1.5px] px-8 py-3.5 rounded-xl border border-white/5 shadow-[0_0_15px_rgba(224,168,153,0.05)]"
            >
              <p className="font-caveat text-2xl sm:text-3xl md:text-4xl text-[#fff8f3] tracking-wide font-medium leading-loose whitespace-pre-line drop-shadow-[0_1.5px_3px_rgba(3,2,4,0.85)] drop-shadow-[0_0_8px_rgba(224,168,153,0.35)]">
                {activeSubtitle}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 6. Cinematic Black Cover Overlay */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-black z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFadedToBlack ? 1.0 : 0.0 }}
        transition={{ duration: 4.0, ease: "easeInOut" }}
      />
    </section>
  );
}
