import { motion } from "framer-motion";
import { Mail, FileText, Brain, FolderCheck, Bell, FileSearch, ArrowRight } from "lucide-react";

const flow = [
  { icon: Mail, label: "Email in", sub: "accounts.payable@fbm.mt" },
  { icon: FileText, label: "Extract", sub: "PDF → text + base64" },
  { icon: Brain, label: "Classify", sub: "Claude Sonnet · v1.4" },
  { icon: FolderCheck, label: "Route", sub: "Dropbox · entity folder" },
  { icon: Bell, label: "Notify", sub: "AP Executive" },
  { icon: FileSearch, label: "Audit", sub: "Notion log" },
];

export default function LivePipelineS2({ isActive }: { isActive: boolean }) {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-16 py-20 bg-card">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="fbm-badge-ai mb-4 inline-block">The pipeline · live</span>
          <div className="fbm-section-divider mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter text-foreground">
            Email arrives.
            <br />
            <span className="text-primary">90 seconds later, it's filed.</span>
          </h2>
        </motion.div>

        {/* Flow */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-2 items-stretch">
          {flow.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex items-center gap-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isActive ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.12 }}
                  className="fbm-card p-4 flex-1 text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-sm font-montserrat font-bold text-foreground">{step.label}</div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-1 break-words">{step.sub}</div>
                </motion.div>
                {i < flow.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : {}}
                    transition={{ delay: 0.4 + i * 0.12 }}
                    className="hidden md:block"
                  >
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Branch logic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="mt-10 grid md:grid-cols-2 gap-4"
        >
          <div className="fbm-card p-6 border-l-4 border-l-success">
            <div className="text-[10px] font-mono uppercase tracking-widest text-success mb-2">Confidence ≥ 0.90</div>
            <h3 className="text-lg font-montserrat font-bold text-foreground">Auto-route</h3>
            <p className="text-sm font-roboto text-muted-foreground mt-2">
              File goes straight to the entity folder in Dropbox. AP Executive is notified. Audit log written.
            </p>
            <div className="mt-3 text-xs font-mono text-success">In UAT: 222 / 222 → 100%</div>
          </div>
          <div className="fbm-card p-6 border-l-4 border-l-warning">
            <div className="text-[10px] font-mono uppercase tracking-widest text-warning mb-2">Confidence &lt; 0.90</div>
            <h3 className="text-lg font-montserrat font-bold text-foreground">Manual review queue</h3>
            <p className="text-sm font-roboto text-muted-foreground mt-2">
              Routed to AP Executive for decision. Logged with reasoning so we can improve the prompt.
            </p>
            <div className="mt-3 text-xs font-mono text-muted-foreground">In UAT: 0 / 222 → 0%</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
