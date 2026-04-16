export const DOC_MESSAGES: Record<string, string> = {
  'docs/00-system/01-three-brain-architecture.md':
    `The Three Brain Architecture doc has been updated. This is the root model governing how Deterministic, User, and Platform Brains interact across the platform.

Why this affects your work:
→ Nikhil: This doc governs the Constitution script system you are implementing. Any change to the brain boundary definitions may require you to update how scripts are organized and executed.
→ Pranav: Your intelligence pipeline and script governance work directly references this architecture. Review the updated boundary between Deterministic Brain and AI Interpretation Layer.

Review the updated doc before continuing any architecture planning or script implementation. Flag any conflict with current in-progress work.`,

  'docs/01-foundations/06-trust-determinism-model.md':
    `The Trust & Determinism Model has been updated. This doc defines the core rule — deterministic data is source of truth, AI interprets but never generates primary mineral data — and governs all AI guardrails across the platform.

Why this affects your work:
→ Nikhil / Pranav: Any change to AI guardrails or deterministic boundaries must be reflected in Constitution scripts and the intelligence pipeline you are governing.
→ Utkarsha: You are actively building the Trust Chain Map (search → claim → verification). Review the updated model to confirm your trust validation framework aligns with the new definition. Any gap you identified may now be addressed or may require re-framing.`,

  'docs/02-platform-architecture/11-backend-architecture.md':
    `The Backend Architecture doc has been updated. This governs how backend services connect to the Admin, Intelligence Engine, and Platform.

Why this affects your work:
→ Tushar: You are actively planning the service structure and Admin backend connection. This update directly changes what you need to build for the Admin → APIs → Intelligence Engine communication model. Review before continuing architecture planning.
→ Vaishnavi: DB inventory and domain mapping work must align with the updated backend service boundaries. Check that your entity relationships remain consistent with the updated architecture.`,

  'docs/02-platform-architecture/12-database-architecture.md':
    `The Database Architecture doc has been updated. This governs schema, domain ownership, MongoDB vs PostgreSQL boundaries, and the data flow from ingestion to API.

Why this affects your work:
→ Vaishnavi: You are the Technical Owner of the MongoDB Atlas migration and just completed the DB inventory. Review the updated architecture to confirm your domain mapping and entity relationships are still correct before API repointing begins. No cutover occurs without founder confirmation.`,

  'docs/05-growth-systems/01-content-engine.md':
    `The Content Engine doc has been updated. This governs how content is created, routed, and connected to the product — defining the Q → Content Surface → Product model.

Why this affects your work:
→ Shubham: You built the Q → Surface → Product framework this week based on this doc. Review the update to confirm your 5 routing types (FAQ, Educational, Prompt Starters, Direct Intelligence, Trust-first) still match the Constitution definition.
→ Krishna: Your question bank sheets are grounded in this doc. Review the updated content routing model before mapping questions to personas next week.`,

  'docs/05-growth-systems/05-crm-integration.md':
    `The CRM Integration doc has been updated. This governs how CRM fits into the Platform Brain — defining what CRM can and cannot do within the MineralView architecture.

Why this affects your work:
→ Gautami: This is the key doc governing whether Go High Level fits the MineralView CRM architecture. Review the updated doc carefully. If GHL does not align with the updated model, training should pause until Nikhil and Shaun confirm the path forward.`,

  'docs/06-data-systems/02-data-pipeline-architecture.md':
    `The Data Pipeline Architecture doc has been updated. This governs how ingestion pipelines are structured, validated, and connected to the deterministic data layer.

Why this affects your work:
→ Riya: Your pipeline documentation for W1/W2/Well/Pricing/Production scrapers must align with the updated pipeline architecture. Review to confirm your documentation structure matches the current pipeline model.
→ Pranav: Script governance for the intelligence pipeline references this doc. Review before continuing script structure planning.`,

  'docs/06-data-systems/03-deterministic-validation.md':
    `The Deterministic Validation doc has been updated. This governs how data is validated at ingestion before entering the deterministic data layer.

Why this affects your work:
→ Ruchita: You are designing the audit logging proposal for the Mineral Owner pipeline. The updated validation rules directly govern what events must be logged and what fields are required. Review before finalizing the proposal for Shaun.
→ Riya: Your null handling validation scripts (lease number, well number) must align with the updated validation rules.`,

  'docs/06-data-systems/04-audit-and-logging.md':
    `The Audit & Logging doc has been updated. This governs what events must be logged, what fields are captured, and where logs live across the platform.

Why this affects your work:
→ Ruchita: You are the Technical Owner of the Mineral Owner pipeline audit logging proposal. The updated doc directly defines what your proposal must cover. Review before finalizing the proposal.`,

  'docs/07-platform-operations/02-system-ownership.md':
    `The System Ownership doc has been updated. This doc defines who owns each system, pipeline, and migration across the platform — including operational ownership, technical ownership, and escalation authority.

Why this affects your work:
→ Vaishnavi: Your MongoDB Atlas migration ownership and authorization chain may be affected. Review the updated ownership table before any API repointing.
→ Ruchita: Your Mineral Owner pipeline ownership and single-point-of-failure classification may have changed. Review your assigned responsibilities.
→ Riya: Your W1/W2/Well/Pricing/Production pipeline ownership table may have been updated. Confirm your operational responsibilities.`,

  'docs/01-foundations/01-persona-ecosystem.md':
    `The Persona Ecosystem doc has been updated. This defines the five canonical mineral owner personas and their behavior signals.

Why this affects your work:
→ Rohit: Your persona + intent mapping and confidence threshold work this week is directly grounded in this doc. Review the updated persona definitions to confirm your passive/active/sophisticated owner mapping is still accurate.
→ Gautami: Your persona + intent definition work and lifecycle stages must align with the updated persona ecosystem.
→ Sanskriti: Your user behavior tracking model and persona classification events must match the updated persona definitions.`,

  'docs/08-architecture-decisions/ADR-005-deterministic-first-ai.md':
    `ADR-005 (Deterministic-First AI) has been updated. This is the core architectural decision governing all AI behavior across MineralView — AI interprets deterministic outputs but never generates primary mineral data.

Why this affects your work:
→ Nikhil / Pranav: This ADR governs what the intelligence scripts can and cannot do. Any change to the AI boundary rules must be reflected in the Constitution script system you are governing.
→ Utkarsha: Your trust chain validation work must align with the updated AI guardrails. Review the updated fallback rules — when deterministic support is incomplete, the system must limit the answer rather than allow AI completion.`,
};

export function getDefaultMessage(doc: string): string {
  const shortDoc = doc.split('/').pop()?.replace('.md', '').replace(/-/g, ' ') ?? doc;
  return `The Constitution document "${shortDoc}" has been updated.

You are receiving this notification because you are listed as an owner or co-owner of this document in the MineralView Constitution ownership map.

Please review the updated document at:
${doc}

Consider how this change affects your current work and flag any conflicts with Nikhil.`;
}
