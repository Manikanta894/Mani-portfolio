"use client";
import { useRef, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";

export interface MRMonogramHandle {
  dominateM: () => gsap.core.Timeline;
  burstR: () => gsap.core.Timeline;
  lockMonogram: () => gsap.core.Timeline;
  reset: () => void;
}

interface Props {
  size?: number;
}

const MRMonogram = forwardRef<MRMonogramHandle, Props>(({ size = 500 }, ref) => {
  const mPathRef = useRef<SVGPathElement>(null);
  const rBowlRef = useRef<SVGPathElement>(null);
  const rLegRef = useRef<SVGLineElement>(null);
  const arrowRef = useRef<SVGPolylineElement>(null);
  const mGroupRef = useRef<SVGGElement>(null);
  const rGroupRef = useRef<SVGGElement>(null);
  const monoGroupRef = useRef<SVGGElement>(null);
  const mGlowRef = useRef<SVGCircleElement>(null);
  const rGlowRef = useRef<SVGCircleElement>(null);
  const centerGlowRef = useRef<SVGCircleElement>(null);

  useImperativeHandle(ref, () => ({
    dominateM() {
      const tl = gsap.timeline();
      if (!mGroupRef.current || !mPathRef.current || !arrowRef.current) return tl;

      const mLen = mPathRef.current.getTotalLength();

      gsap.set(mGroupRef.current, {
        opacity: 0,
        scale: 3,
        y: -300,
        x: 0,
      });
      gsap.set(mPathRef.current, {
        strokeDasharray: mLen,
        strokeDashoffset: mLen,
        opacity: 1,
      });
      gsap.set(arrowRef.current, {
        strokeDasharray: arrowRef.current.getTotalLength(),
        strokeDashoffset: arrowRef.current.getTotalLength(),
        opacity: 1,
      });
      if (mGlowRef.current) gsap.set(mGlowRef.current, { opacity: 0, scale: 0.3 });

      tl.to(mGroupRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0,
        duration: 0.6,
        ease: "power4.out",
      });

      tl.to(mPathRef.current, {
        strokeDashoffset: 0,
        duration: 0.4,
        ease: "power3.out",
      }, "-=0.5");

      tl.to(arrowRef.current, {
        strokeDashoffset: 0,
        duration: 0.3,
        ease: "power3.out",
      }, "-=0.25");

      if (mGlowRef.current) {
        tl.fromTo(mGlowRef.current, {
          opacity: 0, scale: 0.2,
        }, {
          opacity: 0.8, scale: 3,
          duration: 0.4, ease: "power2.out",
        }, "-=0.35");
        tl.to(mGlowRef.current, {
          opacity: 0, scale: 4,
          duration: 0.35, ease: "power2.in",
        }, "-=0.15");
      }

      return tl;
    },

    burstR() {
      const tl = gsap.timeline();
      if (!rGroupRef.current || !rBowlRef.current || !rLegRef.current) return tl;

      gsap.set(rGroupRef.current, {
        opacity: 0,
        scale: 2.5,
        x: 400,
        y: 0,
        rotation: 15,
      });
      gsap.set(rBowlRef.current, {
        strokeDasharray: rBowlRef.current.getTotalLength(),
        strokeDashoffset: rBowlRef.current.getTotalLength(),
        opacity: 1,
      });
      gsap.set(rLegRef.current, {
        strokeDasharray: rLegRef.current.getTotalLength(),
        strokeDashoffset: rLegRef.current.getTotalLength(),
        opacity: 1,
      });
      if (rGlowRef.current) gsap.set(rGlowRef.current, { opacity: 0, scale: 0.3 });

      tl.to(rGroupRef.current, {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.55,
        ease: "power4.out",
      });

      tl.to(rBowlRef.current, {
        strokeDashoffset: 0,
        duration: 0.35,
        ease: "power3.out",
      }, "-=0.45");

      tl.to(rLegRef.current, {
        strokeDashoffset: 0,
        duration: 0.25,
        ease: "power3.out",
      }, "-=0.2");

      if (rGlowRef.current) {
        tl.fromTo(rGlowRef.current, {
          opacity: 0, scale: 0.2,
        }, {
          opacity: 0.8, scale: 3,
          duration: 0.3, ease: "power2.out",
        }, "-=0.3");
        tl.to(rGlowRef.current, {
          opacity: 0, scale: 4,
          duration: 0.3, ease: "power2.in",
        }, "-=0.1");
      }

      return tl;
    },

    lockMonogram() {
      const tl = gsap.timeline();
      if (!mGroupRef.current || !rGroupRef.current || !monoGroupRef.current) return tl;

      if (centerGlowRef.current) {
        tl.fromTo(centerGlowRef.current, {
          opacity: 0, scale: 0.3,
        }, {
          opacity: 1, scale: 1.5,
          duration: 0.5, ease: "power2.out",
        }, "+=0.1");
        tl.to(centerGlowRef.current, {
          opacity: 0.6, scale: 1.2,
          duration: 0.3, ease: "power2.inOut",
        });
      }

      tl.to(mGroupRef.current, {
        x: 25,
        y: -3,
        scale: 0.6,
        duration: 0.45,
        ease: "back.out(1.7)",
      });
      tl.to(rGroupRef.current, {
        x: -18,
        y: 3,
        scale: 0.6,
        duration: 0.45,
        ease: "back.out(1.7)",
      }, "<");

      tl.to(monoGroupRef.current, {
        scale: 0.85,
        duration: 0.25,
        ease: "power2.out",
      }, "-=0.2");

      return tl;
    },

    reset() {
      if (mGroupRef.current) gsap.set(mGroupRef.current, { opacity: 0, scale: 1, y: 0, x: 0 });
      if (rGroupRef.current) gsap.set(rGroupRef.current, { opacity: 0, scale: 1, y: 0, x: 0, rotation: 0 });
      if (mPathRef.current) gsap.set(mPathRef.current, { strokeDashoffset: 0, opacity: 0 });
      if (arrowRef.current) gsap.set(arrowRef.current, { strokeDashoffset: 0, opacity: 0 });
      if (rBowlRef.current) gsap.set(rBowlRef.current, { strokeDashoffset: 0, opacity: 0 });
      if (rLegRef.current) gsap.set(rLegRef.current, { strokeDashoffset: 0, opacity: 0 });
      if (mGlowRef.current) gsap.set(mGlowRef.current, { opacity: 0, scale: 1 });
      if (rGlowRef.current) gsap.set(rGlowRef.current, { opacity: 0, scale: 1 });
      if (centerGlowRef.current) gsap.set(centerGlowRef.current, { opacity: 0, scale: 1 });
      if (monoGroupRef.current) gsap.set(monoGroupRef.current, { scale: 1 });
    },
  }));

  return (
    <svg
      width={size}
      height={size * 0.55}
      viewBox="0 0 600 330"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block mx-auto"
      style={{ maxWidth: "85vw", height: "auto" }}
    >
      <defs>
        <filter id="intense-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="soft-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="m-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D46A2E" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#D46A2E" />
        </linearGradient>

        <linearGradient id="r-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#D46A2E" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>

        <radialGradient id="flash-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D46A2E" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#D46A2E" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#D46A2E" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D46A2E" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#D46A2E" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#D46A2E" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g ref={monoGroupRef} style={{ filter: "url(#intense-glow)" }}>
        {/* M GROUP */}
        <g ref={mGroupRef}>
          <circle ref={mGlowRef} cx="170" cy="150" r="100" fill="url(#flash-grad)" opacity="0" />
          <path
            ref={mPathRef}
            d="M 100 290 L 100 60 L 180 170 L 260 45 L 260 290"
            stroke="url(#m-grad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0"
          />
          <polyline
            ref={arrowRef}
            points="205,8 260,45 278,15"
            stroke="#D46A2E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0"
          />
        </g>

        {/* R GROUP */}
        <g ref={rGroupRef}>
          <circle ref={rGlowRef} cx="400" cy="150" r="100" fill="url(#flash-grad)" opacity="0" />
          <line
            x1="330" y1="290" x2="330" y2="45"
            stroke="url(#r-grad)"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0"
          />
          <path
            ref={rBowlRef}
            d="M 330 45 Q 420 45 420 110 Q 420 175 330 175"
            stroke="url(#r-grad)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            opacity="0"
          />
          <line
            ref={rLegRef}
            x1="330" y1="175" x2="420" y2="290"
            stroke="#D46A2E"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0"
          />
        </g>
      </g>

      <circle ref={centerGlowRef} cx="300" cy="165" r="140" fill="url(#center-glow)" opacity="0" pointerEvents="none" />
    </svg>
  );
});

MRMonogram.displayName = "MRMonogram";
export default MRMonogram;
