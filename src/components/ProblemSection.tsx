import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AlertTriangle, User, Mail, TrendingDown, XCircle, FileQuestion } from "lucide-react";

const painPoints = [
  { icon: AlertTriangle, title: "100% Manual", desc: "One operator processes everything. Zero redundancy.", color: "text-primary" },
  { icon: User, title: "Single Operator", desc: "Concentrated knowledge. Continuity risk.", color: "text-primary" },
  { icon: Mail, title: "Shared Mailbox", desc: "All invoices arrive to a single inbox.", color: "text-warning" },
  { icon: TrendingDown, title: "No Scalability", desc: "The process doesn't scale with growth.", color: "text-primary" },
  { icon: XCircle, title: "Human Error", desc: "GL classification, VAT, duplicates — all manual.", color: "text-destructive" },
  { icon: FileQuestion, title: "No Audit Trail", desc: "No structured traceability of the process.", color: "text-warning" },
];

export default function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <span className="fbm-badge-primary mb-4 block w-fit">The Friction</span>
          <div className="fbm-section-divider mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter mb-4 text-foreground">
            A non-scalable process
            <br />
            <span className="text-primary">and highly dependent.</span>
          </h2>
          <p className="text-muted-foreground text-lg font-roboto max-w-xl">
            100–125 invoices per month processed manually by a single person across 7 entities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {painPoints.map((point, i) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="fbm-card p-6 cursor-default"
              >
                <div className={`w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${point.color}`} />
                </div>
                <h3 className="text-lg font-montserrat font-bold text-foreground mb-1">{point.title}</h3>
                <p className="text-sm font-roboto text-muted-foreground">{point.desc}</p>
                <div className="mt-4 h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={inView ? { width: "100%" } : {}}
                    transition={{ delay: 0.5 + i * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
