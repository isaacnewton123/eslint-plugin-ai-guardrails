please analyze the rules in this project and make a plan to improve and make the  finalize the CLI `init` script with a professional, international standard. 

Your tasks:
1. **AI Content Generation**: Use your imagination to draft a high-authority "AI Guardrail" instruction in English. It must strictly prohibit AI from ever using comments (`//` or `/* */`) in the code output. Emphasize that this is mandatory to avoid build failures triggered by `eslint-plugin-ai-guardrails`.
2. **Platform-Specific Formatting**:
## windsurf
   - `.windsurf/rules/ai-guardrails.md`: Must start with:
     ---
     trigger: always_on
     ---
## cursor
   - `.cursor/rules/ai-guardrails.md`: Must start with:
     ---
     alwaysApply: true
     ---
## antigravity
   - `.agents/rules/ai-guardrails.md`: Standard Markdown.
## kiro
   - `.kiro/steering/ai-guardrails.md`: Must start with:
     ---
     inclusion: always
     ---
     (Include the default Kiro HTML instruction comments at the bottom).
3. **Robust Automation**: Use `fs.mkdirSync` with `{ recursive: true }` to ensure all parent directories are created automatically.
4. **Professional UI & Signature**:
   - Provide clear, clean status logs in the terminal for each file created.
   - Use professional icons (e.g., ✅ or ✨).
   - Display the mandatory closing signature:
     "✨ Setup Complete! Your project is now AI-safe."
     "Powered by @isaacnewton123"

Ensure the logic is efficient, clean, and follows the "vibe coding" philosophy of instant, zero-friction setup.