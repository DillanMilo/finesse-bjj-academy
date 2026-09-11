"use client";

import { useEffect, useId, useRef } from "react";

/** A logo-inspired serpent travels in document space; content masks provide occlusion. */
export default function ScrollSnake() {
  const id = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const maskRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const route = routeRef.current;
    const body = bodyRef.current;
    const head = headRef.current;
    const mask = maskRef.current;
    const main = document.querySelector("main");
    if (!svg || !route || !body || !head || !mask || !main) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ns = "http://www.w3.org/2000/svg";
    let frame = 0;
    let measureFrame = 0;
    let settleTimer = 0;
    let length = 0;
    let start = 0;
    let end = 0;
    let small = false;
    const silhouette = document.createElementNS(ns, "path");
    silhouette.setAttribute("fill", "#000000");
    silhouette.setAttribute("stroke", "#ff0000");
    silhouette.setAttribute("stroke-linejoin", "round");
    body.appendChild(silhouette);


    function draw() {
      frame = 0;
      if (!svg || !route || !body || !head || !mask) return;
      const targetY = window.scrollY + window.innerHeight * 0.6;
      if (motion.matches || !length || targetY < start || targetY > end) {
        svg.style.opacity = "0";
        return;
      }
      svg.style.opacity = String(Math.min(1, (targetY - start) / 160, (end - targetY) / 160));
      // Monotonic route Y allows a cheap binary search for a scroll-aligned head.
      let low = 0, high = length;
      for (let i = 0; i < 14; i++) {
        const mid = (low + high) / 2;
        if (route.getPointAtLength(mid).y < targetY) low = mid;
        else high = mid;
      }
      const at = (low + high) / 2;
      // Start above the viewport: the body continues offscreen without a tail.
      let bodyLow = 0, bodyHigh = at;
      for (let i = 0; i < 14; i++) {
        const mid = (bodyLow + bodyHigh) / 2;
        if (route.getPointAtLength(mid).y < window.scrollY - 150) bodyLow = mid;
        else bodyHigh = mid;
      }
      const bodyStart = (bodyLow + bodyHigh) / 2;
      const steps = Math.max(80, Math.min(500, Math.ceil((at - bodyStart) / 8)));
      const thickness = small ? 9 : 23;
      const curvePoint = (distance: number) => {
        const point = route.getPointAtLength(distance);
        return { x: point.x + Math.sin(point.y / (small ? 65 : 110)) * (small ? 5 : 24), y: point.y };
      };
      const left: string[] = [];
      const right: string[] = [];
      for (let i = 0; i <= steps; i++) {
        const distance = bodyStart + (at - bodyStart) * i / steps;
        const a = curvePoint(distance);
        const b = curvePoint(Math.min(length, distance + 1));
        const magnitude = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        const nx = -(b.y - a.y) / magnitude;
        const ny = (b.x - a.x) / magnitude;
        const radius = thickness * 0.5;
        left.push(`${a.x + nx * radius},${a.y - window.scrollY + ny * radius}`);
        right.push(`${a.x - nx * radius},${a.y - window.scrollY - ny * radius}`);
      }
      silhouette.setAttribute("d", `M${left.join(" L")} L${right.reverse().join(" L")} Z`);
      silhouette.setAttribute("stroke-width", small ? "1.1" : "1.8");
      const point = curvePoint(at);
      const next = curvePoint(Math.min(length, at + 3));
      const angle = Math.atan2(next.y - point.y, next.x - point.x) * 180 / Math.PI - 90;
      head.setAttribute("transform", `translate(${point.x} ${point.y - window.scrollY}) rotate(${angle}) scale(${small ? 0.42 : 0.85})`);
      mask.setAttribute("transform", `translate(0 ${-window.scrollY})`);
    }

    function scheduleDraw() {
      if (!frame) frame = requestAnimationFrame(draw);
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(scheduleMeasure, 800);
    }
    function measure() {
      measureFrame = 0;
      if (!svg || !route || !mask || !main) return;
      const width = document.documentElement.clientWidth;
      small = width < 768;
      svg.setAttribute("viewBox", `0 0 ${width} ${window.innerHeight}`);
      const sections = Array.from(main.querySelectorAll(":scope > section"));
      if (sections.length < 2) return;
      start = sections[0].getBoundingClientRect().bottom + window.scrollY - 100;
      end = main.getBoundingClientRect().bottom + window.scrollY - 100;
      const edge = small ? 9 : Math.max(28, (width - 1280) / 2 - 16);
      let previousY = start;
      let previousX = width - edge;
      let d = `M ${previousX} ${-window.innerHeight} L ${previousX} ${start}`;
      sections.slice(1).forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const top = Math.max(previousY, rect.top + window.scrollY);
        const bottom = rect.bottom + window.scrollY;
        const x = index % 2 === 0 ? width - edge : edge;
        // Cross between sections, then curl into the card edge and back out.
        d += ` C ${previousX} ${top + 35}, ${x} ${top + 55}, ${x} ${top + 130}`;
        const middle = Math.max(top + 150, (top + bottom) / 2);
        const inward = x > width / 2 ? x - (small ? 32 : 135) : x + (small ? 32 : 135);
        d += ` C ${x} ${middle - 100}, ${inward} ${middle - 60}, ${inward} ${middle}`;
        d += ` C ${inward} ${middle + 90}, ${x} ${bottom - 130}, ${x} ${bottom - 45}`;
        previousY = bottom - 45;
        previousX = x;
      });
      route.setAttribute("d", d);
      length = route.getTotalLength();
      mask.replaceChildren();
      // Every readable or interactive surface stays in front of the snake.
      main.querySelectorAll(".clip-corner, h1, h2, h3, p, a, button, img, input, label").forEach(element => {
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const cover = document.createElementNS(ns, "rect");
        cover.setAttribute("x", String(rect.left - 7));
        cover.setAttribute("y", String(rect.top + window.scrollY - 7));
        cover.setAttribute("width", String(rect.width + 14));
        cover.setAttribute("height", String(rect.height + 14));
        cover.setAttribute("rx", "6");
        cover.setAttribute("fill", "black");
        mask.appendChild(cover);
      });
      draw();
    }
    function scheduleMeasure() { if (!measureFrame) measureFrame = requestAnimationFrame(measure); }
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(main);
    const mutation = new MutationObserver(records => {
      if (records.some(record => !svg.contains(record.target))) scheduleMeasure();
    });
    mutation.observe(main, { childList: true, subtree: true });
    window.addEventListener("scroll", scheduleDraw, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    motion.addEventListener("change", scheduleMeasure);
    measure();
    return () => {
      window.clearTimeout(settleTimer);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(measureFrame);
      observer.disconnect();
      mutation.disconnect();
      window.removeEventListener("scroll", scheduleDraw);
      window.removeEventListener("resize", scheduleMeasure);
      motion.removeEventListener("change", scheduleMeasure);
      body.replaceChildren();
    };
  }, []);

  return (
    <svg ref={svgRef} className="scroll-snake" aria-hidden="true" focusable="false">
      <defs>
        <path ref={routeRef} />
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          <rect width="100%" height="100%" fill="white" />
          <g ref={maskRef} />
        </mask>
      </defs>
      <g mask={`url(#${id}-mask)`}>
        <g ref={bodyRef} />
        <g ref={headRef}>
          {/* Vector contour follows the broad, asymmetric head and eyes in logo.png. */}
          <g transform="scale(0.22) translate(-794 -550)">
            <path d="M761 381 C817 390 841 415 857 453 C865 474 870 485 882 495 C920 536 902 596 874 652 C861 678 864 715 846 731 C835 741 819 740 804 740 C760 741 747 723 736 689 C731 675 730 662 722 647 C708 614 696 595 689 574 C680 551 683 523 691 502 C712 484 739 419 761 381 Z" fill="#000000" stroke="#ff0000" strokeWidth="8" strokeLinejoin="round" />
            <path d="M735 600 C744 615 756 621 766 628 C775 640 759 641 750 632 C743 625 739 614 735 600 Z M870 612 C861 620 847 625 840 633 C830 645 854 641 860 630 C865 623 868 617 870 612 Z" fill="#ffffff" />
          </g>
        </g>
      </g>
    </svg>
  );
}
