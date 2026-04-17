import { motion } from "framer-motion";
import { decisions } from "@/data/program";

export default function DecisionsS2({ isActive }: { isActive: boolean }) {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-16 py-20 bg-card">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="fbm-badge-primary mb-4 inline-block">Decisions required today</span>
          <div className="fbm-section-divider mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter text-foreground">
            Four answers.
            <br />
            <span className="text-primary">Before we leave the call.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 mt-12">
          {decisions.map((d, i) => (
            <motion.div
              key={d.n}
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="fbm-card p-6 flex gap-5"
            >
              <div className="text-5xl font-mono font-bold text-primary/30 leading-none">
                {String(d.n).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-montserrat font-bold text-foreground">{d.title}</h3>
                <p className="text-sm font-roboto text-muted-foreground mt-2">{d.detail}</p>
                <div className="mt-3 inline-flex items-center gap-2 text-[10px] font-montserrat font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                  Owner · {d.owner}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
