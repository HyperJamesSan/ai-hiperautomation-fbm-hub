export interface WorkflowNode {
  id: number;
  name: string;
  tool: string;
  category: string;
  categoryColor: string;
  trigger: string;
  does: string;
  outputs: string;
  errors: string;
}

export const categoryColors: Record<string, string> = {
  TRIGGER: "hsl(var(--fbm-gray-medium))",
  TRANSFORM: "hsl(var(--fbm-gray-dark))",
  STORAGE: "hsl(var(--ai))",
  VALIDATION: "hsl(var(--ai))",
  "AI CORE": "hsl(var(--primary))",
  "DECISION ENGINE": "hsl(270 60% 50%)",
  "EXCEPTION": "hsl(var(--warning))",
  "DBC INTEGRATION": "hsl(var(--ai))",
  NOTIFICATION: "hsl(var(--success))",
  "HUMAN GATE": "hsl(var(--success))",
  AUDIT: "hsl(var(--fbm-gray-medium))",
};

export const nodes: WorkflowNode[] = [
  {
    id: 1,
    name: "Email Trigger",
    tool: "n8n — Email Trigger (IMAP)",
    category: "TRIGGER",
    categoryColor: categoryColors.TRIGGER,
    trigger: "New email arrives at accounts.payable@fbm.mt. Monitors inbox via IMAP polling every 60 seconds.",
    does: "• Detects new unread emails with PDF attachments\n• Captures: sender, subject, timestamp, body, all attachments\n• Filters: only emails with PDF attachments proceed",
    outputs: "email_id · sender_email · sender_name · subject · received_at · body_text · attachments[]",
    errors: "• No attachment → route to Exception Handler (NODE 13)\n• Multiple PDFs → one execution per attachment\n• Non-PDF attachment → route to Exception Handler",
  },
  {
    id: 2,
    name: "Attachment Extractor",
    tool: "n8n — Function Node",
    category: "TRANSFORM",
    categoryColor: categoryColors.TRANSFORM,
    trigger: "Output from NODE 01 — email with PDF confirmed.",
    does: "• Extracts and decodes the base64 PDF from attachments array\n• Validates it is a readable PDF (checks %PDF header)\n• Generates unique invoice_id: INV-YYYYMMDD-HHMMSS-{random4}\n• Logs to audit log: invoice_id, filename, file_size_kb, received_at",
    outputs: "invoice_id · pdf_binary · pdf_filename · file_size_kb · is_valid_pdf",
    errors: "• Corrupted/unreadable PDF → route to NODE 13, flag UNREADABLE\n• File > 10MB → flag OVERSIZED, route to NODE 13",
  },
  {
    id: 3,
    name: "DRB Storage (Original)",
    tool: "n8n — Dropbox Node",
    category: "STORAGE",
    categoryColor: categoryColors.STORAGE,
    trigger: "Runs in parallel with NODE 04, immediately after NODE 02.",
    does: "• Saves original untouched PDF to Dropbox TEST folder\n• Path: /AP_Automation/TEST/Inbox/{YYYY-MM}/{invoice_id}_ORIGINAL.pdf\n• Immutable archive copy — never overwritten\n• Records DRB file path in audit log",
    outputs: "drb_path · drb_file_id · storage_confirmed",
    errors: "• Dropbox unavailable → retry 3x with 30s delay\n• If still failing → alert NOC SOC Specialist and halt execution\n• Do not proceed without confirmed storage",
  },
  {
    id: 4,
    name: "PDF Text Extractor",
    tool: "n8n — Function Node (pdf-parse)",
    category: "TRANSFORM",
    categoryColor: categoryColors.TRANSFORM,
    trigger: "Output from NODE 02 — valid PDF confirmed.",
    does: "• Extracts all text content from the PDF\n• Handles: standard text PDFs, multi-page, tables\n• Normalizes whitespace and removes non-printable characters\n• Detects document language\n• Detects if PDF is image-only/scanned",
    outputs: "extracted_text · page_count · detected_language · is_scanned · extraction_quality_score (0–100)",
    errors: "• Scanned PDF with no extractable text → flag SCANNED_PDF, route to NODE 13\n• Extraction quality score < 40 → flag LOW_QUALITY, log warning, continue",
  },
  {
    id: 5,
    name: "Stage 1: Deterministic Validation",
    tool: "n8n — Function + DBC API + VIES API",
    category: "VALIDATION",
    categoryColor: categoryColors.VALIDATION,
    trigger: "Output from NODE 04 — extracted text available.",
    does: "5 checks in sequence:\n1. Duplicate Detection — queries DBC for existing posted entry\n2. Vendor Identification — queries DBC vendor cards\n3. VIES VAT Validation — calls VIES REST API (EU only)\n4. Open PO Match — queries DBC open purchase orders\n5. Vendor Block Check — queries DBC vendor status",
    outputs: "stage1_passed · stage1_flags[] · critical_error · vendor_id · vendor_name · po_id · vies_status · new_vendor_required",
    errors: "• Duplicate found → CRITICAL ERROR: DUPLICATE → NODE 13\n• Vendor blocked → CRITICAL ERROR: VENDOR_BLOCKED → NODE 13\n• DBC API timeout → retry twice → DBC_UNAVAILABLE → NODE 13\n• VIES unavailable → log warning, continue (non-critical)",
  },
  {
    id: 6,
    name: "Stage 2: Claude API Extraction",
    tool: "Anthropic Claude API (claude-sonnet-4-6)",
    category: "AI CORE",
    categoryColor: categoryColors["AI CORE"],
    trigger: "Output from NODE 05 — Stage 1 complete, no critical error.",
    does: "Sends extracted text to Claude with structured prompt to:\n• Identify recipient entity (7 Malta entities)\n• Extract all invoice fields, vendor data, line items\n• Analyze VAT treatment\n• Suggest GL account code with reasoning\n• Suggest budget dimensions\n• Flag anomalies with severity\n• Return confidence score 0–100",
    outputs: "recipient_entity · invoice_data · vendor_data · line_items[] · vat_analysis · suggested_gl · suggested_dimensions · anomalies[] · overall_confidence · claude_model_used · input_tokens · output_tokens · processing_time_ms",
    errors: "• API timeout > 30s → retry once\n• Invalid JSON returned → retry once with stricter prompt\n• Second failure → route to NODE 13, flag AI_EXTRACTION_FAILED",
  },
  {
    id: 7,
    name: "Stage 3: Confidence Scoring",
    tool: "n8n — Function Node",
    category: "DECISION ENGINE",
    categoryColor: categoryColors["DECISION ENGINE"],
    trigger: "Output from NODE 06 — Claude JSON response received.",
    does: "Calculates weighted composite confidence score from 8 layers:\n• Layer 1 — PDF readability: 5%\n• Layer 2 — Duplicate check: 15% (critical)\n• Layer 3 — Vendor match: 20%\n• Layer 4 — VIES validation: 10%\n• Layer 5 — PO match: 10%\n• Layer 6 — Entity ID confidence: 20%\n• Layer 7 — VAT treatment: 10%\n• Layer 8 — GL suggestion: 10%\n\nRouting: ≥90 → AUTO_PREPARED | 70–89 → ASSISTED | <70 → ESCALATED | Critical → BLOCKED",
    outputs: "composite_score · score_breakdown_by_layer · routing_decision (AUTO_PREPARED / ASSISTED / ESCALATED / BLOCKED) · routing_reason",
    errors: "• Any CRITICAL ERROR at any stage → BLOCKED (bypasses scoring entirely)",
  },
  {
    id: 8,
    name: "New Vendor Handler",
    tool: "n8n — Email + Wait Node",
    category: "EXCEPTION",
    categoryColor: categoryColors.EXCEPTION,
    trigger: "NODE 05 output where new_vendor_required = true.",
    does: "• Sends structured email to AP Executive with invoice details\n• Request to create vendor card in DBC\n• Email contains: vendor name, VAT number, invoice amount, link to PDF in DRB\n• Puts workflow into WAIT state — listening for reply\n• When AP Executive replies, resumes from NODE 05 CHECK 2",
    outputs: "vendor_creation_requested_at · vendor_creation_email_sent · resume_trigger (email reply)",
    errors: "• No response — invoice stays in pending queue until reply received",
  },
  {
    id: 9,
    name: "DBC Draft Creator",
    tool: "n8n — HTTP Request → DBC API",
    category: "DBC INTEGRATION",
    categoryColor: categoryColors["DBC INTEGRATION"],
    trigger: "Output from NODE 07 — routing_decision is AUTO_PREPARED or ASSISTED.",
    does: "• Creates a Purchase Invoice Draft in DBC via API\n• Populates all fields from Claude's extraction output\n• For ASSISTED invoices: marks low-confidence fields for review\n• Does NOT post — creates draft only\n• Attaches invoice_id and audit_log_id as reference",
    outputs: "dbc_draft_id · dbc_draft_url · draft_created_at · fields_flagged_for_review[]",
    errors: "• DBC API rejects draft (validation error) → capture error, include in AP notification\n• DBC unavailable → retry twice, then route to NODE 13",
  },
  {
    id: 10,
    name: "AP Executive Notification",
    tool: "n8n — Email Node (Outlook / M365)",
    category: "NOTIFICATION",
    categoryColor: categoryColors.NOTIFICATION,
    trigger: "Output from NODE 09 — DBC draft created.",
    does: "Sends structured notification per routing:\n• AUTO_PREPARED (≥90): ✅ Invoice Ready — confidence score, entity, GL, one-click confirm\n• ASSISTED (70–89): ⚠️ Review Required — flagged fields, DBC draft link\n• ESCALATED (<70): 🔴 Manual Processing — issues list, original PDF link",
    outputs: "notification_sent_at · notification_type · recipient_email · email_message_id",
    errors: "• Email send failure → retry once → log error to audit",
  },
  {
    id: 11,
    name: "Human Review & Confirmation",
    tool: "n8n — Webhook",
    category: "HUMAN GATE",
    categoryColor: categoryColors["HUMAN GATE"],
    trigger: "AP Executive interacts with the notification email.",
    does: "• Waits for AP Executive action (no timeout)\n• Captures action: CONFIRMED / CORRECTED / REJECTED\n• If CORRECTED: captures which fields changed and new values\n• Records correction in audit log\n• CONFIRMED or CORRECTED → triggers NODE 12\n• REJECTED → triggers NODE 13 with reason",
    outputs: "human_action (CONFIRMED / CORRECTED / REJECTED) · corrections_made[] · action_taken_at · action_taken_by",
    errors: "• REJECTED → route to Exception Handler with rejection reason",
  },
  {
    id: 12,
    name: "DBC Posting",
    tool: "n8n — HTTP Request → DBC API",
    category: "DBC INTEGRATION",
    categoryColor: categoryColors["DBC INTEGRATION"],
    trigger: "Output from NODE 11 — human_action is CONFIRMED or CORRECTED.",
    does: "• If corrections made: updates DBC draft with corrected values\n• Posts the Purchase Invoice in DBC (Draft → Posted)\n• Captures posted entry reference number\n• Triggers audit log for final posting event\n• Renames PDF in DRB to final naming convention",
    outputs: "dbc_posted_entry_id · posted_at · final_drb_filename · posting_confirmed",
    errors: "• DBC rejects posting → capture error, notify AP Executive\n• DBC unavailable → retry twice, then alert Financial Manager directly",
  },
  {
    id: 13,
    name: "Exception Handler",
    tool: "n8n — Function + Email Node",
    category: "EXCEPTION",
    categoryColor: categoryColors.EXCEPTION,
    trigger: "Any CRITICAL ERROR or failure from any previous node.",
    does: "• Receives exception with: invoice_id, exception_type, detail, originating_node\n• Determines severity: CRITICAL vs WARNING\n• CRITICAL: notifies AP Executive AND Financial Manager\n• WARNING: notifies AP Executive only\n• Logs full exception to audit log\n• Saves exception record to DRB\n\nException types: NO_ATTACHMENT · UNREADABLE_PDF · OVERSIZED_PDF · SCANNED_PDF · DUPLICATE_INVOICE · VENDOR_BLOCKED · DBC_UNAVAILABLE · AI_EXTRACTION_FAILED · HUMAN_REJECTED · STORAGE_FAILED",
    outputs: "exception_logged_at · exception_type · notification_sent_to[] · manual_processing_required (always true)",
    errors: "• All exceptions logged — this is the final catch-all handler",
  },
  {
    id: 14,
    name: "Audit Logger",
    tool: "n8n — Function + Dropbox Node",
    category: "AUDIT",
    categoryColor: categoryColors.AUDIT,
    trigger: "Called at every stage — runs in parallel, never blocks main flow.",
    does: "Maintains a running JSON audit record for every invoice:\n• invoice_id, received_at, sender_email\n• original_pdf_drb_path\n• stage1_results (5 checks with pass/fail)\n• claude_extraction_output (full JSON)\n• confidence_score_breakdown (8 layers)\n• routing_decision + reason\n• dbc_draft_id, human_action, corrections\n• dbc_posted_entry_id\n• exceptions[], total_processing_time_ms\n• final_status (POSTED / MANUAL / EXCEPTION)\n\nSaves to: /AP_Automation/TEST/AuditLogs/{YYYY-MM}/{invoice_id}_AUDIT.json",
    outputs: "audit_record_complete · audit_drb_path · final_status",
    errors: "• Dropbox unavailable → buffer locally, retry on next event",
  },
  {
    id: 15,
    name: "Completion Notifier",
    tool: "n8n — Email Node",
    category: "NOTIFICATION",
    categoryColor: categoryColors.NOTIFICATION,
    trigger: "Output from NODE 12 (successful posting) OR NODE 13 (exception handled).",
    does: "Daily summary digest (17:00 Mon–Fri) to Financial Manager & Finance Ops Lead:\n• Total invoices processed today\n• Breakdown: Auto-Prepared / Assisted / Escalated / Exceptions\n• Average confidence score\n• Pending human review count\n• Unresolved exceptions\n\nImmediate alert if >3 exceptions in a single day.",
    outputs: "daily_summary_sent_at · invoices_processed_count · breakdown_by_routing · pending_review_count · unresolved_exceptions_count",
    errors: "• Email delivery failure → retry once → log to audit",
  },
];

// Main happy path connections (solid lines)
export const happyPathConnections: [number, number][] = [
  [1, 2], [2, 3], [2, 4], [4, 5], [5, 6], [6, 7], [7, 9],
  [9, 10], [10, 11], [11, 12], [12, 14], [12, 15], [13, 15], [13, 14],
];

// Exception/branch connections (dashed amber lines)
export const exceptionConnections: [number, number][] = [
  [1, 13], [2, 13], [3, 13], [4, 13], [5, 13], [6, 13], [9, 13], [11, 13], [12, 13],
];

// Special connections
export const specialConnections: { from: number; to: number; color: string; label: string }[] = [
  { from: 5, to: 8, color: "hsl(var(--warning))", label: "New Vendor" },
  { from: 8, to: 5, color: "hsl(var(--ai))", label: "Resume" },
];

// Node positions for the 2-row layout
export const nodePositions: Record<number, { row: number; col: number }> = {
  1: { row: 0, col: 0 },
  2: { row: 0, col: 1 },
  3: { row: 0, col: 2 },
  4: { row: 0, col: 3 },
  5: { row: 0, col: 4 },
  6: { row: 0, col: 5 },
  7: { row: 0, col: 6 },
  8: { row: 0, col: 7 },
  9: { row: 1, col: 0 },
  10: { row: 1, col: 1 },
  11: { row: 1, col: 2 },
  12: { row: 1, col: 3 },
  13: { row: 1, col: 4 },
  14: { row: 1, col: 5 },
  15: { row: 1, col: 6 },
};
