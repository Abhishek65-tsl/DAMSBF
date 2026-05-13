import React from "react";

export default function DamsCasterThemeSwitch({ mode, onToggle }) {
  const isDark = mode === "dark";

  return (
    <div style={switchStyles.wrap}>
      <button
        type="button"
        onClick={onToggle}
        title={isDark ? "Switch to normal mode" : "Switch to dark mode"}
        style={switchStyles.button}
      >
        <span style={switchStyles.icon}>{isDark ? "☾" : "☼"}</span>
        <span style={switchStyles.label}>{isDark ? "Dark" : "Normal"}</span>
        <span style={switchStyles.track}>
          <span
            style={{
              ...switchStyles.thumb,
              transform: isDark ? "translateX(26px)" : "translateX(0)",
            }}
          />
        </span>
      </button>
    </div>
  );
}

const switchStyles = {
  wrap: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    border: "1px solid rgba(125, 211, 252, 0.18)",
    background: "linear-gradient(135deg, #155aa8, #154f8f)",
    color: "#f8fafc",
    padding: "8px 12px",
    borderRadius: 999,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(2, 6, 23, 0.16)",
  },
  icon: {
    fontSize: 15,
    lineHeight: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: 700,
  },
  track: {
    width: 50,
    height: 26,
    borderRadius: 999,
    background: "rgba(15, 23, 42, 0.28)",
    padding: 3,
    display: "flex",
    alignItems: "center",
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#ffffff",
    transition: "transform 180ms ease",
    boxShadow: "0 2px 8px rgba(2, 6, 23, 0.25)",
  },
};
