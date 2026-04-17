import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Maximize, Minimize, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  HeroS2, BeforeS2, BuildTimelineS2, UATResultsS2, LivePipelineS2,
  StackGridS2, EntitiesGridS2, GateS2, DecisionsS2, RoadmapS2, ClosingS2
} from "@/components/session2";

const slides = [
  { id: "hero", label: "Module 1" },
  { id: "before", label: "Before" },
  { id: "build", label: "Build" },
  { id: "uat", label: "UAT" },
  { id: "pipeline", label: "Pipeline" },
  { id: "stack", label: "Stack" },
  { id: "entities", label: "Entities" },
  { id: "gate", label: "Gate" },
  { id: "decisions", label: "Decisions" },
  { id: "roadmap", label: "Roadmap" },
  { id: "closing", label: "Closing" },
];

export default function Session2() {
  const [active, setActive] = useState("hero");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isNavigating = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id);
            isNavigating.current = false;
          }
        });
      },
      { threshold: 0.4 }
    );
    slides.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const idx = slides.findIndex((s) => s.id === active);

  const goTo = useCallback((dir: "prev" | "next") => {
    if (isNavigating.current) return;
    const i = slides.findIndex((s) => s.id === active);
    const t = dir === "prev" ? i - 1 : i + 1;
    if (t >= 0 && t < slides.length) {
      isNavigating.current = true;
      document.getElementById(slides[t].id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [active]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goTo("next"); }
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); goTo("prev"); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goTo]);

  return (
    <div id="presentation-container" className="bg-background min-h-screen overflow-x-hidden snap-y snap-mandatory">
      {/* Mini back-to-hub link, hidden in fullscreen */}
      {!isFullscreen && (
        <Link
          to="/"
          className="fixed top-4 left-4 z-50 px-3 py-1.5 rounded-md bg-card/80 backdrop-blur-sm border border-border text-[10px] font-montserrat font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary hover:border-primary/40 transition-all flex items-center gap-1.5"
        >
          <LinkIcon className="w-3 h-3" /> Hub
        </Link>
      )}

      {/* Side dots */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
        {slides.map((s) => (
          <button
            key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="group flex items-center gap-3 justify-end"
          >
            <span className={`text-[10px] font-montserrat font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all ${
              active === s.id ? "text-primary" : "text-muted-foreground"
            }`}>
              {s.label}
            </span>
            <div className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${
              active === s.id
                ? "bg-primary border-primary scale-110"
                : "bg-transparent border-border group-hover:border-primary/50"
            }`} />
          </button>
        ))}
      </nav>

      <div id="hero" className="min-h-screen snap-start snap-always"><HeroS2 /></div>
      <div id="before" className="min-h-screen snap-start snap-always"><BeforeS2 isActive={active === "before"} /></div>
      <div id="build" className="min-h-screen snap-start snap-always"><BuildTimelineS2 isActive={active === "build"} /></div>
      <div id="uat" className="min-h-screen snap-start snap-always"><UATResultsS2 isActive={active === "uat"} /></div>
      <div id="pipeline" className="min-h-screen snap-start snap-always"><LivePipelineS2 isActive={active === "pipeline"} /></div>
      <div id="stack" className="min-h-screen snap-start snap-always"><StackGridS2 isActive={active === "stack"} /></div>
      <div id="entities" className="min-h-screen snap-start snap-always"><EntitiesGridS2 isActive={active === "entities"} /></div>
      <div id="gate" className="min-h-screen snap-start snap-always"><GateS2 isActive={active === "gate"} /></div>
      <div id="decisions" className="min-h-screen snap-start snap-always"><DecisionsS2 isActive={active === "decisions"} /></div>
      <div id="roadmap" className="min-h-screen snap-start snap-always"><RoadmapS2 isActive={active === "roadmap"} /></div>
      <div id="closing" className="min-h-screen snap-start snap-always"><ClosingS2 /></div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={active}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mr-1 hidden sm:inline"
          >
            {idx + 1}/{slides.length} · {slides[idx]?.label}
          </motion.span>
        </AnimatePresence>
        <button onClick={() => goTo("prev")} disabled={idx === 0} className="w-9 h-9 rounded-lg bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-30">
          <ChevronUp className="w-4 h-4" />
        </button>
        <button onClick={() => goTo("next")} disabled={idx === slides.length - 1} className="w-9 h-9 rounded-lg bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-30">
          <ChevronDown className="w-4 h-4" />
        </button>
        <button onClick={toggleFullscreen} className="w-9 h-9 rounded-lg bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </motion.div>
    </div>
  );
}
