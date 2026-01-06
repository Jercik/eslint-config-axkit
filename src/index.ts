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
export function axpoint(options: Options = {}): Linter.Config[] {
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
      name: "axpoint/base",
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
      },
    },

    // Unicorn plugin recommended config
    eslintPluginUnicorn.configs.recommended,

    // Disable type-checking for config files
    {
      name: "axpoint/config-files",
      files: ["*.config.{js,ts,mjs,mts}"],
      ...tseslint.configs.disableTypeChecked,
    },

    // Vitest rules for test files
    {
      name: "axpoint/vitest",
      files: [
        "**/*.{test,spec}.{ts,tsx,js,mjs,cjs,mts,cts}",
        "tests/**/*.{ts,tsx,js,mjs,cjs,mts,cts}",
      ],
      plugins: { vitest },
      rules: vitest.configs.recommended.rules,
      languageOptions: {
        globals: { ...vitest.environments.env.globals },
      },
    },

    // Prettier compatibility (must be last)
    eslintConfigPrettier,
  );

  return configs;
}

export default axpoint;
