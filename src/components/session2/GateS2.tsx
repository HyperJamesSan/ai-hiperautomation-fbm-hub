import { motion } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";

const steps = [
  { label: "DBC Sandbox", sub: "Today · pending", status: "gate" },
  { label: "Integration", sub: "~ 2 weeks", status: "next" },
  { label: "Shadow Mode", sub: "1 week in PROD", status: "next" },
  { label: "Auto-route ON", sub: "Q2 2026", status: "target" },
];

export default function GateS2({ isActive }: { isActive: boolean }) {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-16 py-20 bg-background">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="fbm-badge-warning mb-4 inline-block">Act 3 · One gate left</span>
          <div className="fbm-section-divider mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter text-foreground">
            One blocker.
            <br />
            <span className="text-warning">Then we ship.</span>
          </h2>
          <p className="text-lg font-roboto text-muted-foreground mt-4 max-w-2xl">
            The pipeline is production-ready. We need the Business Central Sandbox to validate the OData v4 integration before touching the live ERP.
          </p>
        </motion.div>

        {/* Path to PROD */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-7 gap-3 items-center">
          {steps.map((s, i) => (
            <div key={s.label} className="contents">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.15 }}
                className={`col-span-2 md:col-span-1 ${i > 0 ? "md:col-start-auto" : ""} fbm-card p-5 text-center ${
                  s.status === "gate" ? "border-2 border-warning bg-warning/5" :
                  s.status === "target" ? "border-2 border-primary/40 bg-primary/5" : ""
                }`}
              >
                {s.status === "gate" && (
                  <Lock className="w-5 h-5 text-warning mx-auto mb-2" />
                )}
                <div className={`text-sm font-montserrat font-bold ${
                  s.status === "gate" ? "text-warning" :
                  s.status === "target" ? "text-primary" : "text-foreground"
                }`}>
                  {s.label}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground mt-1">{s.sub}</div>
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isActive ? { opacity: 1 } : {}}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  className="hidden md:flex justify-center"
                >
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="mt-10 fbm-card-dark p-6"
        >
          <div className="text-[10px] font-mono uppercase tracking-widest text-warning mb-2">From Sandbox to go-live</div>
          <p className="text-base md:text-lg font-roboto text-white">
            <span className="font-semibold text-white">~ 3 weeks</span> · Sandbox available → 2 weeks integration → 1 week Shadow Mode (parallel run, AP Executive reviews everything) → CFO sign-off → Auto-route ON.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
