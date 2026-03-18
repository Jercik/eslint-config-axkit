import type { Linter } from "eslint";

/**
 * Whitelists promise-returning `node:test` functions in the
 * `no-floating-promises` rule via `allowForKnownSafeCalls`.
 *
 * Always applied — harmless if not using `node:test`.
 */
export const nodeTestConfig: Linter.Config = {
  name: "axkit/node-test",
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
            name: ["describe", "it", "test", "suite", "todo", "skip", "only"],
          },
        ],
      },
    ],
  },
};
