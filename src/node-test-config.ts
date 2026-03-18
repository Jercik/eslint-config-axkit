import type { Linter } from "eslint";

/**
 * ESLint config for projects using `node:test` instead of Vitest.
 *
 * Whitelists `describe`, `it`, and `test` from `node:test` in the
 * `no-floating-promises` rule via `allowForKnownSafeCalls` — these
 * return `Promise<void>` but are not meant to be awaited.
 */
export const nodeTestConfig: Linter.Config = {
  name: "axkit/test-files",
  files: [
    "**/*.{test,spec}.{ts,tsx,js,mjs,cjs,mts,cts}",
    "tests/**/*.{ts,tsx,js,mjs,cjs,mts,cts}",
  ],
  rules: {
    "@typescript-eslint/no-floating-promises": [
      "error",
      {
        allowForKnownSafeCalls: [
          {
            from: "package",
            package: "node:test",
            name: ["describe", "it", "test"],
          },
        ],
      },
    ],
  },
};
