import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "dams-caster-theme";

export default function useDamsCasterTheme() {
  const [mode, setMode] = useState(() => localStorage.getItem(STORAGE_KEY) || "dark");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((current) => (current === "dark" ? "light" : "dark"));
  };

  return useMemo(
    () => ({
      mode,
      isLight: mode === "light",
      toggleMode,
      pageStyle:
        mode === "light"
          ? {
              background:
                "radial-gradient(circle at top left, rgba(14, 165, 233, 0.08), transparent 30%), linear-gradient(180deg, #f4f8fd 0%, #e8eef6 100%)",
              color: "#0f172a",
            }
          : {},
      contentStyle:
        mode === "light"
          ? {
              filter: "invert(1) hue-rotate(180deg)",
            }
          : {},
    }),
    [mode]
  );
}
