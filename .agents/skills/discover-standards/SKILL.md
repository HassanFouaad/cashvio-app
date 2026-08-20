---
name: discover-standards
description: Extract new tribal knowledge, architectural invariants, and recurring patterns into modular skills
---

# Discover Standards

Protocol for identifying emerging codebase patterns, extracting tribal knowledge, and creating new modular skills.

## When to Use

- When a new architectural pattern or third-party integration is introduced.
- When an invariant is repeated across ≥3 independent modules and lacks codification.
- When expanding the agent governance framework.

## Discovery Workflow

1. **Identify Recurring Pattern**: Confirm pattern exists in ≥3 distinct files across different domains.
2. **Determine Tier**:
   - Universal invariant across all tasks -> `.cursor/rules/<name>.mdc`.
   - Task-specific workflow with discrete steps -> `.agents/skills/<name>/SKILL.md`.
3. **Draft the Standard**:
   - Include clear `When to Use` trigger conditions.
   - Specify `Core Rules & Invariants`.
   - Provide concrete `❌ FORBIDDEN` vs `✅ REQUIRED` code examples.
4. **Register in Standards Catalog**: Add entry to `.cursor/standards-index.yml` and `AGENTS.md`.
5. **Verify Zero Duplication**: Ensure new skill does not repeat content from existing rules.
