import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

export default function ParticleBackground() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
        width: '100%',
        height: '100%',
      }}
      options={{
        background: {
          color: { value: 'transparent' },
        },
        particles: {
          color: { value: '#0d1f6d' }, // 🌌 Neon Dark Blue
          move: {
            enable: true,
            speed: 1,
            direction: 'none',
            outModes: 'out',
          },
          number: { value: 60 },
          opacity: { value: 0.7 },
          size: { value: { min: 1, max: 3 } },
          shape: { type: 'circle' },
          links: {
            enable: false, // can be set to true if you want connecting lines
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'repulse' },
          },
          modes: {
            repulse: { distance: 80, duration: 0.4 },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
