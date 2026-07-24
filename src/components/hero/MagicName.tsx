"use client";
import { useEffect, useMemo, useState } from "react";

const MIDDLE = "anikanta".split("");

export function MagicName() {
  const [phase, setPhase] = useState<"hidden" | "burst" | "settled">("hidden");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("burst"), 80);
    const t2 = setTimeout(() => setPhase("settled"), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const visible = phase !== "hidden";
  const settled = phase === "settled";

  // same orbit / glint geometry as the intro for material continuity
  const glints = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        angle: (i / 14) * 360,
        delay: i * 0.07,
      })),
    []
  );

  return (
    <div className="relative select-none">
      {/* burst sparkles — vermilion glow ring, same as intro impact */}
      {!settled && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          {Array.from({ length: 28 }).map((_, i) => {
            const angle = (i / 28) * Math.PI * 2;
            const dist = 140 + (i % 5) * 36;
            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full"
                style={{
                  background: "rgba(232,93,58,1)",
                  transform: visible
                    ? `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`
                    : "translate(0,0) scale(1)",
                  opacity: visible ? 0 : 1,
                  transition: `transform 1.3s cubic-bezier(.2,.9,.3,1) ${(i % 6) * 0.035}s, opacity 1.3s ease-out`,
                  boxShadow: "0 0 14px rgba(232,93,58,0.95), 0 0 28px rgba(255,150,100,0.6)",
                }}
              />
            );
          })}
        </div>
      )}

      <h1
        className="relative flex items-baseline leading-[0.82] tracking-tight"
        style={{
          fontFamily: `"Fraunces Variable", "Instrument Serif", serif`,
          fontStyle: "italic",
          letterSpacing: "-0.045em",
          fontSize: "clamp(4.5rem, 14vw, 16rem)",
        }}
        aria-label="Manikanta R"
      >
        {/* DOMINANT M — identical material to intro, tuned for light bg */}
        <span
          className="relative inline-block"
          style={{
            fontSize: "1.85em",
            lineHeight: 0.82,
            fontVariationSettings: `"opsz" 144, "wght" 900, "SOFT" 0`,
            marginRight: "-0.04em",
            transform: visible
              ? settled
                ? "translateY(0) scale(1)"
                : "translateY(-4%) scale(1.04)"
              : "translateY(40%) scale(0.6)",
            opacity: visible ? 1 : 0,
            transition:
              "transform 1.4s cubic-bezier(.18,1.2,.25,1), opacity .6s, filter .8s",
            background:
              "linear-gradient(160deg, #1a0f0c 0%, #e85d3a 45%, #4a1208 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
            transformOrigin: "bottom center",
            filter: settled
              ? "drop-shadow(0 6px 24px rgba(232,93,58,0.28))"
              : "drop-shadow(0 10px 40px rgba(232,93,58,0.55)) drop-shadow(0 0 70px rgba(255,150,100,0.35))",
          }}
        >
          M
          {/* glint sweep — same as intro M */}
          {visible && !settled && (
            <span
              className="absolute pointer-events-none"
              style={{
                top: "10%",
                left: "12%",
                width: "60%",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
                animation: "intro-glint 1.4s ease-out .35s forwards",
                opacity: 0,
                transform: "skewX(-20deg)",
              }}
            />
          )}
        </span>

        {/* middle letters — soft book-italic, same axes as intro */}
        <span className="relative inline-flex items-baseline" style={{ marginLeft: "-0.02em" }}>
          {MIDDLE.map((ch, i) => (
            <span
              key={i}
              className="relative inline-block"
              style={{
                fontSize: "0.82em",
                fontVariationSettings: `"opsz" 72, "wght" 400, "SOFT" 100`,
                color: "var(--ink)",
                opacity: visible ? 0.95 : 0,
                transform: visible
                  ? "translateY(0) rotate(0) scale(1)"
                  : "translateY(-40%) rotate(-6deg) scale(0.6)",
                transition: `transform 0.7s cubic-bezier(.2,1.5,.3,1) ${0.22 + i * 0.07}s, opacity .45s ${0.22 + i * 0.07}s`,
                textShadow: settled
                  ? "none"
                  : "0 0 24px rgba(232,93,58,0.4)",
              }}
            >
              {ch}
            </span>
          ))}
        </span>

        <span style={{ width: "0.28em", display: "inline-block" }} />

        {/* DOMINANT R — same gradient, orbit dot + glints persist (gentler when settled) */}
        <span
          className="relative inline-block"
          style={{
            fontSize: "1.7em",
            lineHeight: 0.82,
            fontVariationSettings: `"opsz" 144, "wght" 700, "SOFT" 50`,
            marginLeft: "-0.02em",
            transform: visible
              ? settled
                ? "translateY(0) rotate(0) scale(1)"
                : "translateY(-3%) rotate(-3deg) scale(1.05)"
              : "translateY(60%) rotate(-25deg) scale(0.4)",
            opacity: visible ? 1 : 0,
            transition:
              "transform 1.5s cubic-bezier(.18,1.2,.25,1) 0.18s, opacity .6s 0.18s, filter .8s",
            background:
              "linear-gradient(220deg, #4a1208 0%, #e85d3a 35%, #1a0f0c 65%, #e85d3a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
            transformOrigin: "bottom left",
            filter: settled
              ? "drop-shadow(0 6px 28px rgba(232,93,58,0.32))"
              : "drop-shadow(0 8px 50px rgba(232,93,58,0.65))",
          }}
        >
          R
          {/* Orbiting dot — same as intro */}
          {visible && (
            <span
              className="absolute pointer-events-none"
              style={{
                top: "50%",
                left: "50%",
                width: "1em",
                height: "1em",
                marginLeft: "-0.5em",
                marginTop: "-0.5em",
                animation: "intro-orbit 4.5s linear infinite",
              }}
            >
              <span
                className="absolute rounded-full"
                style={{
                  top: "-0.06em",
                  left: "50%",
                  width: "0.085em",
                  height: "0.085em",
                  marginLeft: "-0.042em",
                  background: "#fff",
                  boxShadow:
                    "0 0 14px rgba(255,200,160,1), 0 0 28px rgba(232,93,58,0.85)",
                }}
              />
            </span>
          )}
          {/* Glints — only during reveal */}
          {visible && !settled && (
            <span className="absolute inset-0 pointer-events-none">
              {glints.map((g, i) => (
                <span
                  key={i}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    width: "0.04em",
                    height: "0.18em",
                    background:
                      "linear-gradient(to bottom, rgba(232,93,58,1), transparent)",
                    transform: `rotate(${g.angle}deg) translateY(-0.7em)`,
                    transformOrigin: "center bottom",
                    opacity: 0,
                    animation: `intro-twinkle 1.4s ease-out ${g.delay}s 2`,
                  }}
                />
              ))}
            </span>
          )}
        </span>
      </h1>

      {/* same vermilion underline as intro caption divider */}
      <div
        className="mt-4 h-px origin-center mx-auto"
        style={{
          width: visible ? "180px" : "0px",
          background:
            "linear-gradient(to right, transparent, rgba(232,93,58,0.85), transparent)",
          transition: "width 1.3s cubic-bezier(.2,1,.3,1) 0.7s",
        }}
      />
    </div>
  );
}
