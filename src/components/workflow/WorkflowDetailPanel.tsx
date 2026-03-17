import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import type { WorkflowNode } from "./workflowData";

const tabs = ["Trigger", "Does", "Outputs", "Errors"] as const;
type Tab = typeof tabs[number];

const tabKeys: Record<Tab, keyof WorkflowNode> = {
  Trigger: "trigger",
  Does: "does",
  Outputs: "outputs",
  Errors: "errors",
};

interface Props {
  node: WorkflowNode | null;
  onClose: () => void;
}

export default function WorkflowDetailPanel({ node, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Does");

  if (!node) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={node.id}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="bg-card border-t-2 border-border rounded-t-2xl shadow-xl px-6 py-5 relative"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span
            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-mono font-bold text-primary-foreground"
            style={{ backgroundColor: node.categoryColor }}
          >
            {String(node.id).padStart(2, "0")}
          </span>
          <h3 className="font-montserrat font-bold text-foreground text-base">{node.name}</h3>
          <span
            className="text-[10px] font-montserrat font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-primary-foreground"
            style={{ backgroundColor: node.categoryColor }}
          >
            {node.category}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {node.tool}
          </span>
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-muted rounded-lg p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-xs font-montserrat font-semibold transition-all ${
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-roboto text-foreground/80 leading-relaxed whitespace-pre-line max-h-[180px] overflow-y-auto"
          >
            {node[tabKeys[activeTab]]}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
