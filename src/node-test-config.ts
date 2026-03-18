import type { Linter } from "eslint";

/**
 * ESLint config for projects using `node:test` instead of Vitest.
 *
 * Disables `@typescript-eslint/no-floating-promises` in test files —
 * `node:test`'s `describe`/`it`/`test` return `Promise<void>` but are
 * not meant to be awaited.
 *
 * `allowForKnownSafeCalls` with `{ from: "package", package: "node:test" }`
 * would be more precise but does not work at runtime:
 * https://github.com/typescript-eslint/typescript-eslint/issues/11504
 */
export const nodeTestConfig: Linter.Config = {
  name: "axkit/node-test",
  files: [
    "**/*.{test,spec}.{ts,tsx,js,mjs,cjs,mts,cts}",
    "tests/**/*.{ts,tsx,js,mjs,cjs,mts,cts}",
  ],
  rules: {
    "@typescript-eslint/no-floating-promises": "off",
  },
};
