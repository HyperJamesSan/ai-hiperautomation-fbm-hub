import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import ValidationFlowDiagram from "./ValidationFlowDiagram";

const layers = [
  { id: 1, name: "Legal Format", method: "Deterministic", stage: 1, desc: "Mandatory fields per VAT legislation: invoice number, VAT ID, taxable base, applied rate.", type: "rule", stageKey: "rules" },
  { id: 2, name: "VIES Validation", method: "API Call", stage: 1, desc: "For EU suppliers, VAT ID is validated against the VIES database in real time.", type: "rule", stageKey: "rules" },
  { id: 3, name: "Vendor Verification", method: "DBC API", stage: 1, desc: "Vendor cross-checked against Business Central vendor cards. Hierarchy: VAT ID → Reg. → Name.", type: "rule", stageKey: "rules" },
  { id: 4, name: "Contract Validation", method: "Deterministic", stage: 1, desc: "Amount and service type verified against contract reference table.", type: "rule", stageKey: "rules" },
  { id: 5, name: "Duplicate Detection", method: "Deterministic", stage: 1, desc: "Invoice number, vendor and amount validated against processing log and DBC entries.", type: "rule", stageKey: "rules" },
  { id: 6, name: "VAT Compliance", method: "AI + Rules", stage: 2, desc: "Evaluates whether the supplier's tax treatment is correct. Covers reverse charge and exemptions.", type: "ai", stageKey: "ai" },
  { id: 7, name: "GL Classification", method: "AI Reasoning", stage: 2, desc: "Suggests the appropriate GL account and VAT posting group based on invoice content.", type: "ai", stageKey: "ai" },
  { id: 8, name: "Final Decision", method: "Scoring", stage: 3, desc: "Weighted confidence score: Auto-draft (≥90%), Assisted review (70-89%), or Blocked (<70%).", type: "scoring", stageKey: "decision" },
];

const stageToIds: Record<string, number[]> = {
  rules: [1, 2, 3, 4, 5],
  ai: [6, 7],
  decision: [8],
};

export default function ValidationLayers() {
  const ref = useRef(null);
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [activeLayerId, setActiveLayerId] = useState<number | null>(null);
  const [focusMode, setFocusMode] = useState(false);

  const getBadgeClass = (type: string) => {
    switch (type) {
      case "ai": return "fbm-badge-ai";
      case "scoring": return "fbm-badge-warning";
      default: return "fbm-badge-success";
    }
  };

  const isLayerHighlighted = (layer: typeof layers[0]) => {
    if (activeLayerId !== null) return layer.id === activeLayerId;
    if (activeStage !== null) return stageToIds[activeStage]?.includes(layer.id);
    return false;
  };

  const hasSelection = activeStage !== null || activeLayerId !== null;

  const handleStageClick = (stage: string | null) => {
    setActiveStage(stage);
    if (stage !== null) setFocusMode(true);
  };

  const handleLayerClick = (id: number | null) => {
    setActiveLayerId(id);
    if (id !== null) setFocusMode(true);
  };

  const handleExitFocus = () => {
    setFocusMode(false);
    setActiveStage(null);
    setActiveLayerId(null);
  };

  return (
    <section ref={ref} className="relative h-screen flex flex-col justify-center px-8 bg-card overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {!focusMode ? (
            /* === DEFAULT VIEW: Header + Flow Diagram === */
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-8">
                <span className="fbm-badge-primary mb-4 block w-fit">The Synthesis</span>
                <div className="fbm-section-divider mb-6" />
                <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter mb-4 text-foreground">
                  8 validation layers.
                  <br />
                  <span className="text-primary">Hybrid intelligence.</span>
                </h2>
                <p className="text-muted-foreground text-lg font-roboto max-w-2xl">
                  Deterministic rules for binary checks. AI only where human judgment is needed.
                  Every AI decision includes written justification.
                </p>
              </div>

              <ValidationFlowDiagram
                activeStage={activeStage}
                activeLayerId={activeLayerId}
                onStageClick={handleStageClick}
                onLayerClick={handleLayerClick}
              />
            </motion.div>
          ) : (
            /* === FOCUS VIEW: Flow Diagram + 8 Layer Cards === */
            <motion.div
              key="focus"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ValidationFlowDiagram
                activeStage={activeStage}
                activeLayerId={activeLayerId}
                onStageClick={handleStageClick}
                onLayerClick={handleLayerClick}
              />

              {/* 8 Layer Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                {layers.map((layer, i) => {
                  const highlighted = isLayerHighlighted(layer);
                  const dimmed = hasSelection && !highlighted;
                  return (
                    <motion.div
                      key={layer.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      className={`fbm-card p-4 cursor-default transition-all duration-300 ${
                        highlighted
                          ? "border-primary/40 shadow-lg ring-2 ring-primary/20 scale-[1.02] -translate-y-1"
                          : dimmed
                          ? "opacity-40"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={getBadgeClass(layer.type)}>L{layer.id}</span>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">{layer.method}</span>
                      </div>
                      <h3 className="text-sm font-montserrat font-bold text-foreground mb-1">{layer.name}</h3>
                      <p className="text-xs font-roboto text-muted-foreground leading-relaxed line-clamp-3">{layer.desc}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Exit focus button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={handleExitFocus}
                className="mt-4 mx-auto block text-xs font-mono text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 rounded-lg px-4 py-2 transition-all"
              >
                ← Back to overview
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
