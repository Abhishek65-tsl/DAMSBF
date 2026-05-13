import React from "react";
import { Box } from "@mui/material";

const particles = [
  { top: "8%", left: "18%", size: 10, delay: "0s", duration: "4.8s" },
  { top: "20%", left: "70%", size: 8, delay: "0.9s", duration: "5.6s" },
  { top: "34%", left: "42%", size: 12, delay: "1.4s", duration: "4.2s" },
  { top: "48%", left: "80%", size: 9, delay: "0.4s", duration: "5.1s" },
  { top: "62%", left: "28%", size: 11, delay: "1.1s", duration: "4.5s" },
  { top: "76%", left: "58%", size: 7, delay: "1.8s", duration: "5.3s" },
];

function ParticleAnimation() {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {particles.map((particle, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0, 174, 255, 0.75) 0%, rgba(0, 174, 255, 0.12) 70%, transparent 100%)",
            boxShadow: "0 0 12px rgba(0, 174, 255, 0.45)",
            animation: `particleFloat ${particle.duration} ease-in-out ${particle.delay} infinite`,
          }}
        />
      ))}

      <style>
        {`
          @keyframes particleFloat {
            0% {
              transform: translate3d(0, 0, 0) scale(0.9);
              opacity: 0.45;
            }
            50% {
              transform: translate3d(10px, -16px, 0) scale(1.1);
              opacity: 0.9;
            }
            100% {
              transform: translate3d(-8px, -32px, 0) scale(0.95);
              opacity: 0.2;
            }
          }
        `}
      </style>
    </Box>
  );
}

export default ParticleAnimation;
