import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { includeIgnoreFile } from "@eslint/compat";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import type { Linter } from "eslint";
import { importOptional } from "./import-optional.ts";
import { baseConfig } from "./base-config.ts";
import { vitestConfig } from "./vitest-config.ts";

export type Options = {
  /**
   * Path to .gitignore file. If provided, patterns from this file
   * will be added to ESLint's ignore list.
   */
  gitignorePath?: string;

  /**
   * Enable Next.js rules (eslint-config-next core-web-vitals + typescript).
   * Includes React, React Hooks, JSX accessibility, and Next.js-specific rules.
   * Requires `eslint-config-next` to be installed.
   */
  nextjs?: boolean;

  /**
   * Enable Storybook rules (eslint-plugin-storybook flat/recommended).
   * Requires `eslint-plugin-storybook` to be installed.
   */
  storybook?: boolean;

  /**
   * Path to the Tailwind CSS entry point (e.g. `"src/app/globals.css"`).
   * Enables eslint-plugin-better-tailwindcss recommended rules and configures
   * the plugin to resolve project-specific classes, variants, and plugins.
   * Requires `eslint-plugin-better-tailwindcss` to be installed.
   */
  tailwindcss?: string;
};

/**
 * Creates a complete ESLint flat config for TypeScript projects.
 *
 * Includes:
 * - ESLint recommended rules
 * - TypeScript strict type checking
 * - Unicorn plugin (recommended)
 * - Vitest plugin for test files
 * - Prettier compatibility (disables conflicting rules)
 *
 * Optional:
 * - Next.js rules (core-web-vitals + typescript) via `nextjs: true`
 * - Storybook rules (flat/recommended) via `storybook: true`
 * - Tailwind CSS rules (better-tailwindcss/recommended) via `tailwindcss: "path/to/entry.css"`
 */
export async function axkit(options: Options = {}): Promise<Linter.Config[]> {
  const { gitignorePath, nextjs, storybook, tailwindcss } = options;

  const configs: Linter.Config[] = [];

  // ── Gitignore ──────────────────────────────────────────────────────
  if (gitignorePath) {
    configs.push(
      includeIgnoreFile(gitignorePath, "Copy patterns from .gitignore"),
    );
  }

  // ── Next.js (before base so axkit's strict rules override) ─────────
  if (nextjs) {
    const [nextVitals, nextTs] = await Promise.all([
      importOptional("eslint-config-next/core-web-vitals"),
      importOptional("eslint-config-next/typescript"),
    ]);
    configs.push(
      ...(nextVitals as Linter.Config[]),
      ...(nextTs as Linter.Config[]),
    );
  }

  // ── Core configs ───────────────────────────────────────────────────
  configs.push(
    js.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    baseConfig,
    eslintPluginUnicorn.configs.recommended,

    // Unicorn rules that are off by default
    {
      name: "axkit/unicorn-extras",
      files: ["**/*.{js,mjs,cjs,ts,tsx,mts,cts}"],
      rules: {
        "unicorn/prefer-import-meta-properties": "error",
        "unicorn/better-regex": "error",
        "unicorn/custom-error-definition": "error",
        "unicorn/no-unused-properties": "error",
        "unicorn/number-literal-case": "error",
      },
    },

    {
      name: "axkit/config-files",
      files: ["*.config.{js,ts,mjs,mts}"],
      ...tseslint.configs.disableTypeChecked,
    },

    vitestConfig,
  );

  // ── Storybook (after base, before Prettier) ────────────────────────
  if (storybook) {
    const storybookPlugin = (await importOptional(
      "eslint-plugin-storybook",
    )) as {
      configs: { "flat/recommended": Linter.Config[] };
    };
    configs.push(...storybookPlugin.configs["flat/recommended"]);
  }

  // ── Tailwind CSS (before Prettier) ─────────────────────────────────
  if (tailwindcss) {
    const tailwindPlugin = (await importOptional(
      "eslint-plugin-better-tailwindcss",
    )) as {
      configs: { recommended: Linter.Config | Linter.Config[] };
    };
    const tailwindConfig = tailwindPlugin.configs.recommended;
    configs.push(
      ...(Array.isArray(tailwindConfig) ? tailwindConfig : [tailwindConfig]),
      {
        name: "axkit/tailwindcss-entry-point",
        settings: {
          "better-tailwindcss": {
            entryPoint: tailwindcss,
          },
        },
      },
      {
        name: "axkit/tailwindcss-overrides",
        rules: {
          // Collapse multi-line className strings to single lines.
          // Multi-line strings cause hydration mismatches in Next.js + Turbopack
          // because the server preserves newlines while the client collapses them.
          // See: https://github.com/tailwindlabs/tailwindcss/discussions/19582
          "better-tailwindcss/no-unnecessary-whitespace": [
            "error",
            { allowMultiline: false },
          ],
          // Must be disabled — it enforces multi-line wrapping, which conflicts
          // with allowMultiline: false above.
          "better-tailwindcss/enforce-consistent-line-wrapping": "off",
        },
      },
    );
  }

  // ── Prettier compatibility (must be last) ──────────────────────────
  configs.push(eslintConfigPrettier);

  return configs;
}
