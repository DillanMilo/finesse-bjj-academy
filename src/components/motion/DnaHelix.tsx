"use client";

import { useEffect, useRef } from "react";
import initialGeometry from "@/lib/dna-initial-geometry.json";

const samples = Array.from({ length: 97 }, (_, i) => i);

/** Decorative horizontal helix, projected around its long axis. */
export default function DnaHelix() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const strands = svg.querySelectorAll<SVGPathElement>("path");
    const rungs = svg.querySelectorAll<SVGLineElement>("line");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
    let phase = 0.5;
    let previous = 0;
    const draw = () => {
      const points = samples.map(i => {
        const angle = i / 96 * Math.PI * 5 + phase;
        return { x: 30 + i * 5.625, y: Math.cos(angle) * 78, depth: Math.sin(angle) };
      });
      strands.forEach((path, index) => {
        const sign = index === 0 ? 1 : -1;
        path.setAttribute("d", points.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${(140 + p.y * sign).toFixed(1)}`).join(" "));
      });
      rungs.forEach((line, i) => {
        const point = points[i * 4];
        line.setAttribute("y1", String(140 + point.y));
        line.setAttribute("y2", String(140 - point.y));
        line.setAttribute("opacity", String(0.25 + Math.abs(point.depth) * 0.4));
      });
    };
    const tick = (time: number) => {
      if (previous) phase += Math.min(time - previous, 50) * Math.PI * 2 / 20000;
      previous = time;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(svg);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    draw();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div className="w-full min-w-0 overflow-hidden" aria-hidden="true" style={{ background: "radial-gradient(ellipse at center, #CC112214, transparent 70%)" }}>
      <svg ref={svgRef} viewBox="0 0 600 280" className="block w-full h-auto" fill="none">
        {/* Identical serialized geometry in Node, Chromium and WebKit; animate only after hydration. */}
        {initialGeometry.rungs.map(point => <line key={point.x} x1={point.x} x2={point.x} y1={point.y1} y2={point.y2} stroke="#E6BDB9" strokeWidth="2" strokeLinecap="round" opacity="0.4" />)}
        {initialGeometry.paths.map((path, index) => <path key={index} d={path} stroke={index === 0 ? "#CC1122" : "#E6BDB9"} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />)}
      </svg>
    </div>
  );
}
