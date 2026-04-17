import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { entities } from "@/data/program";

export default function EntitiesGridS2({ isActive }: { isActive: boolean }) {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-16 py-20 bg-card">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="fbm-badge-primary mb-4 inline-block">8 entities covered</span>
          <div className="fbm-section-divider mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter text-foreground">
            Every Malta company.
            <br />
            <span className="text-primary">One pipeline.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-12">
          {entities.map((e, i) => (
            <motion.div
              key={e.code}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isActive ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.07 }}
              className={`fbm-card p-5 relative ${
                e.highlight ? "border-2 border-primary/30 bg-primary/5" : ""
              }`}
            >
              {e.highlight && (
                <div className="absolute -top-2 -right-2 fbm-badge-primary text-[9px] inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Added in UAT
                </div>
              )}
              <div className={`text-3xl font-mono font-bold ${e.highlight ? "text-primary" : "text-foreground"}`}>
                {e.code}
              </div>
              <div className="text-xs font-montserrat font-semibold text-foreground mt-2 leading-tight">
                {e.name}
              </div>
              <div className="text-[10px] font-roboto text-muted-foreground mt-1">{e.type}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-10 text-sm font-roboto text-muted-foreground max-w-3xl"
        >
          EPS — Epsilon Toro Entertainment — was added during UAT itself. The pipeline absorbed a new entity without code changes — only a prompt update.
        </motion.div>
      </div>
    </section>
  );
}
