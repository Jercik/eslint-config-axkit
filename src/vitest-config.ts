import vitest from "@vitest/eslint-plugin";
import type { Linter } from "eslint";

export const vitestConfig: Linter.Config = {
  name: "axkit/vitest",
  files: [
    "**/*.{test,spec}.{ts,tsx,js,mjs,cjs,mts,cts}",
    "tests/**/*.{ts,tsx,js,mjs,cjs,mts,cts}",
  ],
  plugins: { vitest },
  rules: {
    ...vitest.configs.recommended.rules,

    // Ensure expect.poll() and expect.element() are awaited
    "vitest/require-awaited-expect-poll": "error",

    // Keep vi.mock() and other hoisted APIs at the top of files
    "vitest/hoisted-apis-on-top": "warn",

    // Prefer toHaveBeenCalledTimes() matcher
    "vitest/prefer-to-have-been-called-times": "warn",

    // Prefer mockResolvedValue() over mockImplementation(() => Promise.resolve())
    "vitest/prefer-mock-promise-shorthand": "warn",

    // Prefer expectTypeOf() for type testing
    "vitest/prefer-expect-type-of": "warn",

    // Enforce consistent use of .each vs .for for parameterized tests
    "vitest/consistent-each-for": "warn",

    // Keep hooks (beforeEach, afterEach, etc.) at the top of describe blocks
    "vitest/prefer-hooks-on-top": "warn",

    // ===== Test Logic Errors =====

    // No conditionals (if/else) inside test bodies - tests should be deterministic
    "vitest/no-conditional-in-test": "error",

    // No conditionally defined tests - tests should always run
    "vitest/no-conditional-tests": "error",

    // No return statements in tests - just execute assertions
    "vitest/no-test-return-statement": "warn",

    // No duplicate lifecycle hooks
    "vitest/no-duplicate-hooks": "warn",

    // ===== Better Matchers (auto-fixable) =====

    // Use toBe() for primitives (strict equality)
    "vitest/prefer-to-be": "warn",

    // Use toHaveLength() instead of expect(arr.length).toBe()
    "vitest/prefer-to-have-length": "warn",

    // Use toContain() instead of expect(arr.includes()).toBe(true)
    "vitest/prefer-to-contain": "warn",

    // Use toBeGreaterThan(), toBeLessThan(), etc.
    "vitest/prefer-comparison-matcher": "warn",

    // Use dedicated equality matchers
    "vitest/prefer-equality-matcher": "warn",

    // ===== Best Practices =====

    // Use vi.spyOn() instead of direct property assignment
    "vitest/prefer-spy-on": "warn",

    // Use test.todo() for empty/placeholder tests
    "vitest/prefer-todo": "warn",

    // Use expect().resolves instead of expect(await promise)
    "vitest/prefer-expect-resolves": "warn",

    // No deprecated alias methods (toBeCalled → toHaveBeenCalled)
    "vitest/no-alias-methods": "warn",

    // Use vi.mocked() instead of type casting
    "vitest/prefer-vi-mocked": "warn",

    // Use .only/.skip instead of f/x prefixes
    "vitest/no-test-prefixes": "warn",
  },
  languageOptions: {
    globals: { ...vitest.environments.env.globals },
  },
};
