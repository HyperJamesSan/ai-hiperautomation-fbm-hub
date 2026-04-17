import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { modules } from "@/data/program";

export default function RoadmapS2({ isActive }: { isActive: boolean }) {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-16 py-20 bg-background">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="fbm-badge-ai mb-4 inline-block">Program roadmap</span>
          <div className="fbm-section-divider mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter text-foreground">
            M1 is the pattern.
            <br />
            <span className="text-primary">M2–M5 reuse it.</span>
          </h2>
        </motion.div>

        <div className="mt-12 space-y-3">
          {modules.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -20 }}
              animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`fbm-card p-5 flex items-center gap-5 ${
                m.status === "active" ? "border-2 border-primary/30 bg-primary/5" : ""
              }`}
            >
              <div className={`text-2xl font-mono font-bold ${
                m.status === "active" ? "text-primary" : "text-muted-foreground/40"
              }`}>
                {m.id}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-montserrat font-bold text-foreground">{m.name}</div>
                <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{m.code}</div>
              </div>
              {m.status === "active" ? (
                <span className="fbm-badge-success inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" /> {m.label}
                </span>
              ) : (
                <span className="fbm-badge-muted">{m.label}</span>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-8 text-sm font-roboto text-muted-foreground max-w-2xl"
        >
          Same n8n. Same Claude pattern. Same audit trail. Once M1 is live in PROD, the next modules ship faster — the infrastructure is already there.
        </motion.div>
      </div>
    </section>
  );
}
