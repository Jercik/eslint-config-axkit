import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { includeIgnoreFile } from "@eslint/compat";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import vitest from "@vitest/eslint-plugin";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import type { Linter } from "eslint";

export type Options = {
  /**
   * Path to .gitignore file. If provided, patterns from this file
   * will be added to ESLint's ignore list.
   */
  gitignorePath?: string;
};

/**
 * Creates a complete ESLint flat config for TypeScript + Node.js projects.
 *
 * Includes:
 * - ESLint recommended rules
 * - TypeScript strict type checking
 * - Unicorn plugin (recommended)
 * - Vitest plugin for test files
 * - Prettier compatibility (disables conflicting rules)
 */
export function axkit(options: Options = {}): Linter.Config[] {
  const { gitignorePath } = options;

  const configs: Linter.Config[] = [];

  if (gitignorePath) {
    configs.push(
      includeIgnoreFile(gitignorePath, "Copy patterns from .gitignore"),
    );
  }

  configs.push(
    // ESLint recommended
    js.configs.recommended,

    // TypeScript strict type checking
    ...tseslint.configs.strictTypeChecked,

    // Base config for all JS/TS files
    {
      name: "axkit/base",
      files: ["**/*.{js,mjs,cjs,ts,tsx,mts,cts}"],
      languageOptions: {
        globals: globals.node,
        parserOptions: {
          projectService: true,
        },
      },
      rules: {
        // Security rules
        "no-eval": "error",
        "no-new-func": "error",
        "no-script-url": "error",

        // Correctness rules
        "no-return-assign": ["error", "always"],
        radix: ["error", "as-needed"],
        "guard-for-in": "error",
        "prefer-object-has-own": "error",

        // Clarity rules
        "prefer-regex-literals": ["error", { disallowRedundantWrapping: true }],
        "require-unicode-regexp": "error",
        "no-extend-native": "error",
        "no-new-wrappers": "error",
        "no-implicit-coercion": ["error", { allow: ["!!"] }],

        // Allow numbers in template literals (safe and common)
        "@typescript-eslint/restrict-template-expressions": [
          "error",
          { allowNumber: true },
        ],

        // Disallow value-returning functions where void-returning expected
        "@typescript-eslint/strict-void-return": "error",

        // Disallow unused private class members (extends ESLint rule for TS private keyword)
        "@typescript-eslint/no-unused-private-class-members": "error",

        // ===== ESLint Core Bug Prevention =====

        // Catch missing returns in array methods (.map, .filter, etc.)
        "array-callback-return": ["error", { allowImplicit: false }],

        // Constructors shouldn't return values
        "no-constructor-return": "error",

        // Returns in Promise executors are meaningless
        "no-promise-executor-return": "error",

        // Comparing variable to itself is always a bug
        "no-self-compare": "error",

        // Catch template literal syntax in regular strings
        "no-template-curly-in-string": "error",

        // Loops that only run once are bugs
        "no-unreachable-loop": "error",

        // Infinite loop detection (loop condition never changes)
        "no-unmodified-loop-condition": "error",

        // Dead code - assignments never read
        "no-useless-assignment": "error",

        // Race condition detection in async code
        "require-atomic-updates": "error",

        // Require === and !== (allow == null for null/undefined check)
        eqeqeq: ["error", "always", { null: "ignore" }],

        // Comma operator is confusing
        "no-sequences": "error",

        // ===== TypeScript-ESLint Enhancements =====

        // Ensure switch statements handle all enum/union cases
        "@typescript-eslint/switch-exhaustiveness-check": "error",

        // Use ?. instead of && chains (safer and cleaner)
        "@typescript-eslint/prefer-optional-chain": "error",

        // Require compare function for sort() to prevent string sorting bugs
        "@typescript-eslint/require-array-sort-compare": "error",

        // Prevent confusing ! placement next to == or !=
        "@typescript-eslint/no-confusing-non-null-assertion": "error",

        // Enforce import type for type-only imports
        "@typescript-eslint/consistent-type-imports": [
          "error",
          { prefer: "type-imports" },
        ],

        // Enforce export type for type-only exports
        "@typescript-eslint/consistent-type-exports": "error",
      },
    },

    // Unicorn plugin recommended config
    eslintPluginUnicorn.configs.recommended,

    // Enable unicorn rules that are off by default
    {
      name: "axkit/unicorn-extras",
      files: ["**/*.{js,mjs,cjs,ts,tsx,mts,cts}"],
      rules: {
        // Prefer import.meta.dirname/filename over fileURLToPath (Node.js 20.11+)
        "unicorn/prefer-import-meta-properties": "error",

        // Optimize regex patterns (/[0-9]/ → /\d/)
        "unicorn/better-regex": "error",

        // Ensure correct Error subclassing (this.name, no redundant this.message)
        "unicorn/custom-error-definition": "error",

        // Catch unused object properties (dead code)
        "unicorn/no-unused-properties": "error",

        // Consistent numeric literal casing (0xFF, 2e5)
        "unicorn/number-literal-case": "error",
      },
    },

    // Disable type-checking for config files
    {
      name: "axkit/config-files",
      files: ["*.config.{js,ts,mjs,mts}"],
      ...tseslint.configs.disableTypeChecked,
    },

    // Vitest rules for test files
    {
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
    },

    // Prettier compatibility (must be last)
    eslintConfigPrettier,
  );

  return configs;
}

export default axkit;
