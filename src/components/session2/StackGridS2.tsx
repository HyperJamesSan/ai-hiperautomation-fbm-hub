import { motion } from "framer-motion";
import { stack } from "@/data/program";

export default function StackGridS2({ isActive }: { isActive: boolean }) {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-16 py-20 bg-background">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="fbm-badge-muted mb-4 inline-block">The stack · live</span>
          <div className="fbm-section-divider mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter text-foreground">
            7 services up.
            <br />
            <span className="text-warning">1 pending.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-12">
          {stack.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 15 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.06 }}
              className={`fbm-card p-5 ${
                s.status === "Operational" ? "" : "border-warning/30 bg-warning/5"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-montserrat font-bold text-foreground">{s.name}</h3>
                <span className={`w-2 h-2 rounded-full ${
                  s.status === "Operational" ? "bg-success" : "bg-warning animate-pulse"
                }`} />
              </div>
              <div className="text-xs font-roboto text-muted-foreground">{s.role}</div>
              <div className="text-[10px] font-mono text-muted-foreground/70 mt-2 truncate">{s.host}</div>
              <div className={`text-[10px] font-mono uppercase tracking-wider mt-3 ${
                s.status === "Operational" ? "text-success" : "text-warning"
              }`}>
                {s.status}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-8 text-xs font-mono text-muted-foreground"
        >
          PDF never leaves the company. Only extracted text reaches Claude. Secrets in Doppler. Audit trail in Notion.
        </motion.div>
      </div>
    </section>
  );
}
