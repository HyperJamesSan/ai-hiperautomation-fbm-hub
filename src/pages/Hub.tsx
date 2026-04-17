import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, Lightbulb, Mail, BookOpen, Layers, Building2, Cpu, FileCheck2 } from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";
import { program, uat, modules, entities } from "@/data/program";

const knowledgeTiles = [
  { id: "architecture", title: "Architecture", desc: "End-to-end pipeline & layers", icon: Layers },
  { id: "pipeline", title: "Pipeline", desc: "n8n nodes, step by step", icon: Cpu },
  { id: "stack", title: "Stack", desc: "Live technologies in use", icon: BookOpen },
  { id: "entities", title: "Entities", desc: "8 Malta companies in scope", icon: Building2 },
  { id: "environments", title: "Environments", desc: "TEST and PROD topology", icon: Cpu },
  { id: "uat", title: "UAT Results", desc: "Acceptance criteria & metrics", icon: FileCheck2 },
];

export default function Hub() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />

      {/* Hero / Live status */}
      <section className="pt-28 pb-20 px-6 md:px-10 bg-gradient-to-b from-card to-background border-b border-border/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="fbm-badge-primary">Program · {program.code}</span>
              <span className="fbm-badge-success inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                M1 · UAT PASS · 16 Apr 2026
              </span>
              <span className="fbm-badge-muted">Target go-live · {program.goLiveTarget}</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-extrabold tracking-tighter text-foreground mb-4">
              Hyperautomation Finance
              <br />
              <span className="text-gradient-fbm">FBM Malta.</span>
            </h1>
            <p className="text-lg md:text-xl font-roboto text-muted-foreground max-w-3xl">
              The internal home of FBM's finance automation program. What we've built, how it works, and where we're going.
            </p>
          </motion.div>

          {/* Headline metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
          >
            {[
              { value: uat.invoicesClassified, label: "Invoices classified", suffix: "" },
              { value: uat.accuracy, label: "Accuracy", suffix: "%" },
              { value: uat.bugsOpen, label: "P0 bugs open", suffix: "" },
              { value: 8, label: "Entities covered", suffix: "" },
            ].map((m) => (
              <div key={m.label} className="fbm-metric-card text-center">
                <div className="text-3xl md:text-4xl font-mono font-bold text-primary">
                  {m.value}{m.suffix}
                </div>
                <div className="text-[11px] font-montserrat font-semibold uppercase tracking-wider text-muted-foreground mt-2">
                  {m.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Module pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 fbm-card p-5 md:p-6"
          >
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
              Module pipeline
            </div>
            <div className="grid grid-cols-5 gap-2 md:gap-3">
              {modules.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-lg p-3 border transition-all ${
                    m.status === "active"
                      ? "bg-primary/5 border-primary/30"
                      : "bg-muted/40 border-border/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${m.status === "active" ? "text-primary" : "text-muted-foreground"}`}>
                      {m.id}
                    </span>
                    {m.status === "active" && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    )}
                  </div>
                  <div className="text-[10px] md:text-xs font-roboto text-foreground mt-1.5 line-clamp-2 leading-tight">
                    {m.name.split("—")[0]}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sessions */}
      <section className="py-20 px-6 md:px-10 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <span className="fbm-badge-muted mb-3 inline-block">Executive Sessions</span>
            <h2 className="text-3xl md:text-5xl font-montserrat font-extrabold tracking-tight text-foreground">
              Two sessions. One story.
            </h2>
            <p className="text-muted-foreground font-roboto mt-2 max-w-2xl">
              Session 1 was the proposal. Session 2 is the report. Together they tell the full project arc.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Session 1 card */}
            <Link to="/session-1" className="group">
              <motion.div
                whileHover={{ y: -4 }}
                className="fbm-card p-8 h-full flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="fbm-badge-muted">Session 1</span>
                  <span className="text-[10px] font-mono text-muted-foreground">March 2026</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-montserrat font-extrabold tracking-tight text-foreground mb-3">
                  The Proposal.
                </h3>
                <p className="font-roboto text-muted-foreground leading-relaxed flex-1">
                  Why automate AP. The 8-layer validation framework. Architecture, governance, and a 6-week POC plan.
                </p>
                <div className="mt-6 flex items-center gap-2 text-primary font-montserrat font-semibold text-sm group-hover:gap-3 transition-all">
                  Open presentation <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            </Link>

            {/* Session 2 card */}
            <Link to="/session-2" className="group">
              <motion.div
                whileHover={{ y: -4 }}
                className="fbm-card p-8 h-full flex flex-col border-2 border-primary/20"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="fbm-badge-primary">Session 2</span>
                  <span className="text-[10px] font-mono text-muted-foreground">20 April 2026</span>
                  <span className="fbm-badge-success">Live</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-montserrat font-extrabold tracking-tight text-foreground mb-3">
                  The Results.
                </h3>
                <p className="font-roboto text-muted-foreground leading-relaxed flex-1">
                  UAT pass with 100% accuracy on 222 invoices. The pipeline is live. One gate left to ship: the DBC Sandbox.
                </p>
                <div className="mt-6 flex items-center gap-2 text-primary font-montserrat font-semibold text-sm group-hover:gap-3 transition-all">
                  Open presentation <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Knowledge preview */}
      <section className="py-20 px-6 md:px-10 bg-card border-y border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="fbm-badge-ai mb-3 inline-block">Knowledge base</span>
              <h2 className="text-3xl md:text-5xl font-montserrat font-extrabold tracking-tight text-foreground">
                The system, navigable.
              </h2>
              <p className="text-muted-foreground font-roboto mt-2 max-w-2xl">
                Architecture, pipeline, stack, entities. Understand how it's built without opening Notion.
              </p>
            </div>
            <Link to="/knowledge" className="text-primary font-montserrat font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all">
              Open full knowledge base <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {knowledgeTiles.map((t) => {
              const Icon = t.icon;
              return (
                <Link key={t.id} to={`/knowledge#${t.id}`}>
                  <motion.div whileHover={{ y: -3 }} className="fbm-card p-5 h-full">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-montserrat font-bold text-foreground">{t.title}</h3>
                    <p className="text-xs font-roboto text-muted-foreground mt-1">{t.desc}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Entities preview */}
          <div className="mt-10 fbm-card p-6">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
              8 Malta entities in scope
            </div>
            <div className="flex flex-wrap gap-2">
              {entities.map((e) => (
                <div
                  key={e.code}
                  className={`px-3 py-1.5 rounded-md border text-xs font-mono ${
                    e.highlight
                      ? "bg-primary/5 border-primary/30 text-primary"
                      : "bg-muted/40 border-border/50 text-foreground"
                  }`}
                >
                  <span className="font-bold">{e.code}</span>
                  <span className="text-muted-foreground ml-2">{e.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ideas CTA */}
      <section className="py-20 px-6 md:px-10 bg-background">
        <div className="max-w-7xl mx-auto">
          <Link to="/ideas">
            <motion.div
              whileHover={{ y: -3 }}
              className="fbm-card-dark p-10 md:p-14 relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <span className="fbm-badge-primary mb-3 inline-block">Ideas inbox</span>
                  <h2 className="text-2xl md:text-4xl font-montserrat font-extrabold tracking-tight text-white">
                    Got something that eats your time?
                  </h2>
                  <p className="text-white/60 font-roboto mt-2 max-w-2xl">
                    If it's repetitive and you think AI could do it — tell us. Anyone in the team can submit. No login.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-primary font-montserrat font-semibold">
                  Send an idea <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 md:px-10 border-t border-border/50 bg-card">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-montserrat font-extrabold text-[10px]">
              F
            </div>
            <span>{program.name} · {program.code}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{program.owner}</span>
            <a href="mailto:accounts.payable@fbm.mt" className="hover:text-primary inline-flex items-center gap-1.5">
              <Mail className="w-3 h-3" /> accounts.payable@fbm.mt
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
