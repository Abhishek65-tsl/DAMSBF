// src/Components/Particles/ParticleAnimation.jsx
import React from "react";
import { motion as Motion } from "framer-motion";

// A single particle with L-shape motion
const Particle = ({ delay }) => (
  <Motion.div
    style={{
      position: "absolute",
      top: "30%", // Center vertically
      left: "63%", // Center horizontally
      width: 9,
      height: 9,
      borderRadius: "50%",
      backgroundColor: "yellow",
      zIndex: 3,
    }}
    initial={{ x: 0, y: 0, opacity: 1 }}
    animate={{
      x: [25,25, 55],   // L-shape: go down, then right
      y: [0,126,180],
      opacity: [1, 0.5, 0],
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    }}
  />
);

const ParticleAnimation = () => {
  const particles = Array.from({ length: 8 }, (_, i) => (
    <Particle key={i} delay={i * 0.25} />
  ));

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // So image is clickable/interactable
        overflow: "hidden",
      }}
    >
      {particles}
    </div>
  );
};

export default ParticleAnimation;