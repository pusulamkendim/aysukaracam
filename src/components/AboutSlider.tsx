"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/images/instructor.jpg",
  "/images/1.jpg",
  "/images/4.jpg",
  "/images/3.jpg",
];

const AboutSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative animate-fade-in w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt="Yoga eğitmeni"
          fill
          className={`object-cover transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
};

export default AboutSlider;
