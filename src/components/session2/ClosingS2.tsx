import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function ClosingS2() {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-16 py-20 bg-gradient-to-br from-background via-card to-background">
      <div className="max-w-5xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="fbm-badge-success mb-6 inline-block">Module 1 · delivered</span>
          <h2 className="text-5xl md:text-8xl font-montserrat font-extrabold tracking-tighter text-foreground leading-[0.9]">
            Built.
            <br />
            <span className="text-gradient-fbm">Tested.</span>
            <br />
            Ready to ship.
          </h2>
          <p className="text-lg md:text-xl font-roboto text-muted-foreground mt-8 max-w-2xl mx-auto">
            One decision today unlocks Q2 2026 go-live. The rest of the program follows the same pattern.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/knowledge"
              className="px-6 py-3 rounded-xl bg-card border border-border text-sm font-montserrat font-semibold text-foreground hover:border-primary/40 transition-all inline-flex items-center justify-center gap-2"
            >
              Explore the system <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/ideas"
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-montserrat font-semibold hover:bg-primary/90 transition-all inline-flex items-center justify-center gap-2"
            >
              Suggest the next module <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-16 text-xs font-mono text-muted-foreground">
            James Sanabria · Finance Operations Lead · FBM Group · April 2026
          </div>
        </motion.div>
      </div>
    </section>
  );
}
