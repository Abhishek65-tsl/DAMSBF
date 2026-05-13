import React, { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({ value = 0, decimals = 1, duration = 600, prefix = "", suffix = "" }) {
  const targetValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const [displayValue, setDisplayValue] = useState(targetValue);
  const previousValueRef = useRef(targetValue);

  useEffect(() => {
    const startValue = previousValueRef.current;
    const startTime = performance.now();
    let rafId = null;

    const tick = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      const nextValue = startValue + (targetValue - startValue) * eased;
      setDisplayValue(nextValue);

      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        previousValueRef.current = targetValue;
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [duration, targetValue]);

  return `${prefix}${displayValue.toFixed(decimals)}${suffix}`;
}
