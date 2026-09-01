"use client";

import { useEffect, useRef, useState } from "react";

// Lightweight, dependency-free scroll reveal: fades + floats a section up
// into place the first time it crosses into the viewport. No animation
// library installed in this project, so this leans on IntersectionObserver
// + a CSS transition rather than pulling in framer-motion etc.
export default function RevealOnScroll({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
