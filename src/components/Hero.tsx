"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";

const Hero = () => {
  const audioRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.play().catch(() => {});
      audio.muted = false;
    } else {
      audio.muted = true;
    }
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          src="/videos/video4.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Background Audio */}
      <audio
        ref={audioRef}
        src="/videos/ses1.mp3"
        loop
        muted
        autoPlay
        className="hidden"
      />

      {/* Audio Toggle */}
      <button
        onClick={toggleAudio}
        className="absolute top-20 right-4 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
        aria-label={isMuted ? "Sesi aç" : "Sesi kapat"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-white">
        <div className="max-w-2xl animate-fade-in border-l-4 border-white/60 pl-8">
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Namaste
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 font-light">
            &ldquo;
            Her an, kaynağında buluşacağız.&rdquo;
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-64">
            <Link href="/pricing">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto opacity-80">
                Yolculuğuna Başla
              </Button>
            </Link>
            <Link href="/classes">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              >
                Dersleri Keşfet
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
