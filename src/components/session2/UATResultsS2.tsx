import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { uat, acceptanceCriteria } from "@/data/program";

export default function UATResultsS2({ isActive }: { isActive: boolean }) {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-16 py-20 bg-background">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="fbm-badge-success mb-4 inline-block">Act 2 · Results · {uat.date}</span>
          <div className="fbm-section-divider mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter text-foreground">
            UAT pass.
            <br />
            <span className="text-success">Every single invoice.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-6 mt-12">
          {/* Numbers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="fbm-card-dark p-8"
          >
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/50 mb-6">Real corpus · real numbers</div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { v: uat.corpusTotal, l: "PDFs in corpus" },
                { v: uat.validProcessed, l: "Valid processed" },
                { v: uat.invoicesClassified, l: "Invoices classified", big: true },
                { v: `${uat.accuracy}%`, l: "Accuracy", big: true },
                { v: uat.maxConfidence, l: "Max confidence" },
                { v: `< 30 sec`, l: "Per invoice" },
              ].map((m) => (
                <div key={m.l}>
                  <div className={`font-mono font-bold ${m.big ? "text-5xl text-primary" : "text-3xl text-white"}`}>
                    {m.v}
                  </div>
                  <div className="text-[10px] font-montserrat font-semibold uppercase tracking-wider text-white/50 mt-1.5">
                    {m.l}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-6 text-xs font-mono text-white/60">
              <div>
                <div className="text-white/40 uppercase tracking-wider text-[10px]">Prompt</div>
                <div className="text-white mt-1">{uat.prompt}</div>
              </div>
              <div>
                <div className="text-white/40 uppercase tracking-wider text-[10px]">Model</div>
                <div className="text-white mt-1">{uat.model}</div>
              </div>
            </div>
          </motion.div>

          {/* Acceptance criteria */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35 }}
            className="fbm-card p-6"
          >
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
              Acceptance criteria · {uat.acceptanceCriteria}
            </div>
            <ul className="space-y-2.5">
              {acceptanceCriteria.map((ac) => {
                const pending = ac.status.toLowerCase().includes("pending");
                return (
                  <li key={ac.id} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${pending ? "text-muted-foreground/30" : "text-success"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-muted-foreground">{ac.id}</div>
                      <div className="text-sm font-roboto text-foreground">{ac.text}</div>
                    </div>
                    <div className={`text-[11px] font-mono font-semibold ${pending ? "text-warning" : "text-success"}`}>
                      {ac.status}
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        {/* Before / after */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-6 fbm-card p-6 flex flex-col md:flex-row items-center gap-6"
        >
          <div className="flex-1 text-center md:text-left">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Before · manual</div>
            <div className="text-3xl font-mono font-bold text-muted-foreground line-through decoration-2">3–10 min</div>
            <div className="text-xs font-roboto text-muted-foreground">manual reading + filing per invoice</div>
          </div>
          <ArrowRight className="w-6 h-6 text-primary hidden md:block" />
          <div className="flex-1 text-center md:text-right">
            <div className="text-[10px] font-mono uppercase tracking-widest text-primary">After · automated pipeline</div>
            <div className="text-3xl font-mono font-bold text-primary">&lt; 30 sec</div>
            <div className="text-xs font-roboto text-muted-foreground">end-to-end · classified · routed · audited</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
