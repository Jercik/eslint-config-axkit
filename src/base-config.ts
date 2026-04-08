import globals from "globals";
import type { Linter } from "eslint";

const DEFAULT_PROJECT_SERVICE_ALLOW_DEFAULT_PROJECT = [
  "scripts/export-release-version-plugin.mjs",
];

export function createBaseConfig(): Linter.Config {
  return {
    name: "axkit/base",
    files: ["**/*.{js,mjs,cjs,ts,tsx,mts,cts}"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: {
          allowDefaultProject: DEFAULT_PROJECT_SERVICE_ALLOW_DEFAULT_PROJECT,
        },
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
  };
}
