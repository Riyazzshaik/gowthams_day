"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface AudioContextType {
  initialized: boolean;
  initializeAudio: () => Promise<boolean>;
  activeBgm: "intro" | "main" | "caring" | "climax" | "none";
  transitionToBgm: (bgm: "intro" | "main" | "caring" | "climax" | "none") => void;
  isPlayingVoiceNote: boolean;
  voiceNoteProgress: number; // 0 to 100
  voiceNoteCurrentTime: number;
  voiceNoteDuration: number;
  playVoiceNote: () => void;
  pauseVoiceNote: () => void;
  playSparkle: () => void;
  playPaper: () => void;
  playTypewriter: () => void;
  playHeartbeat: (volume?: number) => void;
  audioError: string | null;
  clearAudioError: () => void;
  audioCtx: AudioContext | null;
  blendHiNannaPads: () => void;
  duckBgmForProposalVoice: (ducked: boolean) => void;
  fadeAndStopAllAudio: (duration?: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

// Global audio instances to persist across Next.js re-renders and StrictMode double mounts
let introAudio: HTMLAudioElement | null = null;
let mainAudio: HTMLAudioElement | null = null;
let caringAudio: HTMLAudioElement | null = null;
let voiceNoteAudio: HTMLAudioElement | null = null;

let audioCtx: AudioContext | null = null;
let introGain: GainNode | null = null;
let mainGain: GainNode | null = null;
let caringGain: GainNode | null = null;

// Warm EQ and Reverb Nodes for lock screen
let introFilter: BiquadFilterNode | null = null;
let introDelay: DelayNode | null = null;
let introFeedback: GainNode | null = null;
let introDelayFilter: BiquadFilterNode | null = null;

let sourcesCreated = false;
let currentActiveBgm: "intro" | "main" | "caring" | "none" | "climax" = "intro";
let transitionTimeoutId: NodeJS.Timeout | null = null;
let isInitializingOrInitialized = false;

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [initialized, setInitialized] = useState(false);
  const [activeBgm, setActiveBgm] = useState<"intro" | "main" | "caring" | "climax" | "none">("intro");
  const [isPlayingVoiceNote, setIsPlayingVoiceNote] = useState(false);
  const [voiceNoteProgress, setVoiceNoteProgress] = useState(0);
  const [voiceNoteCurrentTime, setVoiceNoteCurrentTime] = useState(0);
  const [voiceNoteDuration, setVoiceNoteDuration] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);

  const TARGET_VOLUMES = {
    intro: 0.18,  // Dreamy lock screen target volume
    main: 0.16,
    caring: 0.14,
    climaxIntro: 0.14, // Until I Found You climax volume (within 0.12 - 0.15)
    climaxCaring: 0,   // Disable Hi Nanna pads completely
    none: 0,
  };

  useEffect(() => {
    // Instantiate audio elements globally once on client
    if (typeof window !== "undefined") {
      if (!introAudio) {
        // Try until-i-found-you.mp3, fallback to intro-theme.mp3 if missing
        introAudio = new Audio("/audios/until-i-found-you.mp3");
        introAudio.loop = true;
        introAudio.preload = "auto";
        introAudio.volume = 1.0;
        
        introAudio.addEventListener("error", () => {
          console.warn("until-i-found-you.mp3 not found, falling back to intro-theme.mp3");
          if (introAudio) {
            introAudio.src = "/audios/intro-theme.mp3";
            introAudio.load();
          }
        });
      }
      if (!mainAudio) {
        mainAudio = new Audio("/audios/main-bgm.mp3");
        mainAudio.loop = true;
        mainAudio.preload = "none";
        mainAudio.volume = 1.0;
      }
      if (!caringAudio) {
        caringAudio = new Audio("/audios/caring-bgm.mp3");
        caringAudio.loop = true;
        caringAudio.preload = "none";
        caringAudio.volume = 1.0;
      }
      if (!voiceNoteAudio) {
        voiceNoteAudio = new Audio("/audios/voice-note.mp3");
        voiceNoteAudio.preload = "none";
        voiceNoteAudio.volume = 1.0;
      }

      // Voice Note listeners
      const onTimeUpdate = () => {
        if (voiceNoteAudio && voiceNoteAudio.duration) {
          setVoiceNoteCurrentTime(voiceNoteAudio.currentTime);
          setVoiceNoteProgress((voiceNoteAudio.currentTime / voiceNoteAudio.duration) * 100);
        }
      };

      const onLoadedMetadata = () => {
        if (voiceNoteAudio) setVoiceNoteDuration(voiceNoteAudio.duration);
      };

      const onEnded = () => {
        setIsPlayingVoiceNote(false);
        setVoiceNoteProgress(0);
        setVoiceNoteCurrentTime(0);
        restoreBgmVolume();
      };

      voiceNoteAudio.addEventListener("timeupdate", onTimeUpdate);
      voiceNoteAudio.addEventListener("loadedmetadata", onLoadedMetadata);
      voiceNoteAudio.addEventListener("ended", onEnded);

      return () => {
        voiceNoteAudio?.removeEventListener("timeupdate", onTimeUpdate);
        voiceNoteAudio?.removeEventListener("loadedmetadata", onLoadedMetadata);
        voiceNoteAudio?.removeEventListener("ended", onEnded);
      };
    }
  }, []);

  const initializeAudio = useCallback(async (): Promise<boolean> => {
    if (isInitializingOrInitialized || initialized) return true;
    isInitializingOrInitialized = true;

    try {
      if (typeof window !== "undefined") {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) throw new Error("Web Audio API not supported");
        
        if (!audioCtx) {
          audioCtx = new AudioContextClass();
        }

        if (audioCtx.state === "suspended") {
          await audioCtx.resume();
        }

        // Initialize audio routing graph only once
        if (!sourcesCreated && audioCtx) {
          if (introAudio) {
            const introSrc = audioCtx.createMediaElementSource(introAudio);
            introGain = audioCtx.createGain();
            introGain.gain.setValueAtTime(0, audioCtx.currentTime);

            // Create warm EQ biquad filter
            introFilter = audioCtx.createBiquadFilter();
            introFilter.type = "lowpass";
            // Initially warm and dreamy (muffled) for lock screen
            introFilter.frequency.setValueAtTime(1400, audioCtx.currentTime);

            // Directly connect in a safe, noise-free linear path
            introSrc.connect(introFilter);
            introFilter.connect(introGain);
            introGain.connect(audioCtx.destination);
          }

          if (mainAudio) {
            const mainSrc = audioCtx.createMediaElementSource(mainAudio);
            mainGain = audioCtx.createGain();
            mainGain.gain.setValueAtTime(0, audioCtx.currentTime);
            mainSrc.connect(mainGain);
            mainGain.connect(audioCtx.destination);
          }

          if (caringAudio) {
            const caringSrc = audioCtx.createMediaElementSource(caringAudio);
            caringGain = audioCtx.createGain();
            caringGain.gain.setValueAtTime(0, audioCtx.currentTime);
            caringSrc.connect(caringGain);
            caringGain.connect(audioCtx.destination);
          }

          sourcesCreated = true;
        }

        // Start preloading secondary audio files
        if (mainAudio) mainAudio.preload = "auto";
        if (caringAudio) caringAudio.preload = "auto";
        if (voiceNoteAudio) voiceNoteAudio.preload = "auto";

        // Play intro track immediately
        if (introAudio && introGain) {
          await introAudio.play();
          fadeNode(introGain, TARGET_VOLUMES.intro, 2.5);
        }

        setInitialized(true);
        setAudioError(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Audio initialization blocked or failed:", err);
      isInitializingOrInitialized = false;
      setAudioError("Tap again to continue the memories 💗");
      return false;
    }
  }, [initialized]);

  // Hardware-accelerated GainNode volume transition curve (pop-free)
  const fadeNode = (gainNode: GainNode | null, target: number, duration = 2.0) => {
    if (!gainNode || !audioCtx) return;
    const now = audioCtx.currentTime;
    
    // Clear scheduled timelines to prevent clicks and conflicts
    gainNode.gain.cancelScheduledValues(now);
    
    // Use exponential decay setTargetAtTime for click-free fading
    const timeConstant = duration * 0.33;
    gainNode.gain.setTargetAtTime(target, now, timeConstant);
  };

  const transitionToBgm = useCallback((bgm: "intro" | "main" | "caring" | "climax" | "none") => {
    if (!initialized || !audioCtx) return;
    if (bgm === activeBgm) return;

    // PREVENT SONG MIXING / OVERLAPPING
    const now = audioCtx.currentTime;
    if (bgm === "main") {
      // Instantly stop intro/climax music when transitioning to main BGM
      if (introAudio) {
        introAudio.pause();
        introAudio.currentTime = 0;
      }
      if (introGain) {
        introGain.gain.cancelScheduledValues(now);
        introGain.gain.setValueAtTime(0, now);
      }
    } else if (bgm === "climax" || bgm === "intro") {
      // Instantly stop main and caring BGM when transitioning to climax/intro
      if (mainAudio) {
        mainAudio.pause();
        mainAudio.currentTime = 0;
      }
      if (caringAudio) {
        caringAudio.pause();
        caringAudio.currentTime = 0;
      }
      if (mainGain) {
        mainGain.gain.cancelScheduledValues(now);
        mainGain.gain.setValueAtTime(0, now);
      }
      if (caringGain) {
        caringGain.gain.cancelScheduledValues(now);
        caringGain.gain.setValueAtTime(0, now);
      }
    }

    setActiveBgm(bgm);
    currentActiveBgm = bgm;

    // Adjust warm EQ filter on the intro track dynamically
    if (bgm === "intro") {
      if (introFilter) {
        introFilter.frequency.setValueAtTime(1400, audioCtx.currentTime);
      }
    } else if (bgm === "climax") {
      if (introFilter) {
        introFilter.frequency.setValueAtTime(20000, audioCtx.currentTime); // open up EQ for climax instrumental
      }
    }

    // Clear any active transition timeout to prevent overlapping pauses
    if (transitionTimeoutId) {
      clearTimeout(transitionTimeoutId);
      transitionTimeoutId = null;
    }

    const isDucked = isPlayingVoiceNote;

    // Blend: climax maps both tracks simultaneously at balanced targets
    const targetIntro = bgm === "intro" ? TARGET_VOLUMES.intro : (bgm === "climax" ? TARGET_VOLUMES.climaxIntro : 0);
    const targetMain = bgm === "main" ? (isDucked ? 0.02 : TARGET_VOLUMES.main) : 0;
    // Note: climax starts with 0 Hi Nanna pads, which are blended in dynamically later
    const targetCaring = bgm === "caring" ? (isDucked ? 0.02 : TARGET_VOLUMES.caring) : 0;

    // Start playback on targets if paused
    if (targetIntro > 0 && introAudio?.paused) {
      introAudio.play().catch((e) => console.log("intro play block", e));
    }
    if (targetMain > 0 && mainAudio?.paused) {
      mainAudio.play().catch((e) => console.log("main play block", e));
    }
    if (targetCaring > 0 && caringAudio?.paused) {
      caringAudio.play().catch((e) => console.log("caring play block", e));
    }

    // Trigger Web Audio fading curves
    if (introGain) {
      const duration = bgm === "climax" ? 2.5 : 3.0; // Fade in climax over 2.5s
      fadeNode(introGain, targetIntro, duration);
    }
    if (mainGain) fadeNode(mainGain, targetMain, 3.0);
    if (caringGain) fadeNode(caringGain, targetCaring, 3.0);

    // Securely pause faded-out audio nodes to conserve resources
    transitionTimeoutId = setTimeout(() => {
      // Check currentActiveBgm in real-time instead of static bgm parameter to prevent race conditions
      if (currentActiveBgm !== "intro" && currentActiveBgm !== "climax") introAudio?.pause();
      if (currentActiveBgm !== "main") mainAudio?.pause();
      if (currentActiveBgm !== "caring") caringAudio?.pause(); // Fully pause Hi Nanna pads in climax
      transitionTimeoutId = null;
    }, 3200);
  }, [initialized, activeBgm, isPlayingVoiceNote]);

  const duckBgmVolume = useCallback(() => {
    if (!initialized) return;
    // Duck BGM to exactly 5% of target volume for the voice note section
    if (activeBgm === "main" && mainGain) {
      fadeNode(mainGain, TARGET_VOLUMES.main * 0.05, 1.5);
    } else if (activeBgm === "caring" && caringGain) {
      fadeNode(caringGain, TARGET_VOLUMES.caring * 0.05, 1.5);
    } else if (activeBgm === "intro" && introGain) {
      fadeNode(introGain, TARGET_VOLUMES.intro * 0.05, 1.5);
    } else if (activeBgm === "climax") {
      if (introGain) fadeNode(introGain, TARGET_VOLUMES.climaxIntro * 0.05, 1.5);
      if (caringGain) fadeNode(caringGain, TARGET_VOLUMES.climaxCaring * 0.05, 1.5);
    }
  }, [initialized, activeBgm]);

  const restoreBgmVolume = useCallback(() => {
    if (!initialized) return;
    // Restore BGM gradually after voice note ends (smooth 1.5s fade)
    if (activeBgm === "main" && mainGain) {
      fadeNode(mainGain, TARGET_VOLUMES.main, 1.5);
    } else if (activeBgm === "caring" && caringGain) {
      fadeNode(caringGain, TARGET_VOLUMES.caring, 1.5);
    } else if (activeBgm === "intro" && introGain) {
      fadeNode(introGain, TARGET_VOLUMES.intro, 1.5);
    } else if (activeBgm === "climax") {
      if (introGain) fadeNode(introGain, TARGET_VOLUMES.climaxIntro, 1.5);
      if (caringGain) fadeNode(caringGain, TARGET_VOLUMES.climaxCaring, 1.5);
    }
  }, [initialized, activeBgm]);

  const playVoiceNote = useCallback(() => {
    if (!initialized || !voiceNoteAudio) return;
    if (isPlayingVoiceNote) return; // Prevent multiple overlapping play calls
    duckBgmVolume();
    voiceNoteAudio.play()
      .then(() => {
        setIsPlayingVoiceNote(true);
      })
      .catch((e) => {
        console.error("Voice note play error:", e);
        restoreBgmVolume();
      });
  }, [initialized, isPlayingVoiceNote, duckBgmVolume, restoreBgmVolume]);

  const pauseVoiceNote = useCallback(() => {
    if (!initialized || !voiceNoteAudio) return;
    voiceNoteAudio.pause();
    setIsPlayingVoiceNote(false);
    restoreBgmVolume();
  }, [initialized, restoreBgmVolume]);

  const playSparkle = useCallback(() => {
    const ctx = audioCtx;
    if (!ctx || ctx.state === "suspended") return;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(1600, now);
    osc.frequency.exponentialRampToValueAtTime(3200, now + 0.12);
    
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.13);
  }, []);

  const playPaper = useCallback(() => {
    const ctx = audioCtx;
    if (!ctx || ctx.state === "suspended") return;
    const now = ctx.currentTime;
    const duration = 0.22;
    
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + duration);
    filter.Q.value = 1.8;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    source.start(now);
    source.stop(now + duration);
  }, []);

  const playTypewriter = useCallback(() => {
    const ctx = audioCtx;
    if (!ctx || ctx.state === "suspended") return;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.04);
    
    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.05);
  }, []);

  const playHeartbeat = useCallback((volume = 0.4) => {
    const ctx = audioCtx;
    if (!ctx || ctx.state === "suspended") return;
    const now = ctx.currentTime;
    
    const playThump = (time: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(55, time);
      osc.frequency.exponentialRampToValueAtTime(10, time + 0.15);
      
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.2);
    };

    playThump(now, volume);
    playThump(now + 0.15, volume * 0.6);
  }, []);

  const clearAudioError = useCallback(() => {
    setAudioError(null);
  }, []);

  const blendHiNannaPads = useCallback(() => {
    if (!initialized || !audioCtx || currentActiveBgm !== "climax") return;
    if (caringAudio?.paused) {
      caringAudio.play().catch((e) => console.log("caring play block", e));
    }
    if (caringGain) {
      fadeNode(caringGain, TARGET_VOLUMES.climaxCaring, 3.0); // smooth 3s blend
    }
  }, [initialized]);

  const duckBgmForProposalVoice = useCallback((ducked: boolean) => {
    if (!initialized || !audioCtx || currentActiveBgm !== "climax") return;
    if (ducked) {
      // Fade BGM up to 10% of climax targets for background ambience
      if (introGain) fadeNode(introGain, TARGET_VOLUMES.climaxIntro * 0.10, 1.5);
      if (caringGain) fadeNode(caringGain, TARGET_VOLUMES.climaxCaring * 0.10, 1.5);
    } else {
      // Fade BGM completely to 0 (near silence)
      if (introGain) fadeNode(introGain, 0, 1.5);
      if (caringGain) fadeNode(caringGain, 0, 1.5);
    }
  }, [initialized]);

  const fadeAndStopAllAudio = useCallback((duration = 4.0) => {
    if (!initialized || !audioCtx) return;
    if (introGain) fadeNode(introGain, 0, duration);
    if (mainGain) fadeNode(mainGain, 0, duration);
    if (caringGain) fadeNode(caringGain, 0, duration);

    setTimeout(() => {
      if (currentActiveBgm !== "intro" && currentActiveBgm !== "climax") introAudio?.pause();
      if (currentActiveBgm !== "main") mainAudio?.pause();
      if (currentActiveBgm !== "caring" && currentActiveBgm !== "climax") caringAudio?.pause();
      setActiveBgm("none");
      currentActiveBgm = "none";
    }, duration * 1000 + 200);
  }, [initialized]);

  return (
    <AudioContext.Provider
      value={{
        initialized,
        initializeAudio,
        activeBgm,
        transitionToBgm,
        isPlayingVoiceNote,
        voiceNoteProgress,
        voiceNoteCurrentTime,
        voiceNoteDuration,
        playVoiceNote,
        pauseVoiceNote,
        playSparkle,
        playPaper,
        playTypewriter,
        playHeartbeat,
        audioError,
        clearAudioError,
        audioCtx,
        blendHiNannaPads,
        duckBgmForProposalVoice,
        fadeAndStopAllAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
