# eslint-config-axpoint

Reusable ESLint flat config for TypeScript + Node.js projects with strict type checking, Prettier, Unicorn, and Vitest.

## Installation

```bash
pnpm add -D eslint-config-axpoint eslint
```

## Usage

Create an `eslint.config.js` in your project root:

```js
import path from "node:path";
import { axpoint } from "eslint-config-axpoint";

const gitignorePath = path.join(import.meta.dirname, ".gitignore");

export default axpoint({ gitignorePath });
```

Or without gitignore integration:

```js
import { axpoint } from "eslint-config-axpoint";

export default axpoint();
```

## What's Included

- **ESLint recommended** rules
- **TypeScript strict type checking** via `typescript-eslint`
- **Unicorn plugin** (recommended config)
- **Vitest plugin** for test files (`*.test.*`, `*.spec.*`, `tests/**/*`)
- **Prettier compatibility** (disables conflicting rules)
- **Config file handling** (disables type-checking for `*.config.*` files)

### Custom Rules

Beyond the included presets, these additional rules are enabled:

**Security:**

- `no-eval`, `no-new-func`, `no-script-url`

**Correctness:**

- `no-return-assign`, `radix`, `guard-for-in`, `prefer-object-has-own`

**Clarity:**

- `prefer-regex-literals`, `require-unicode-regexp`, `no-extend-native`
- `no-new-wrappers`, `no-implicit-coercion` (allows `!!`)

**TypeScript:**

- `@typescript-eslint/restrict-template-expressions` allows numbers

## Extending the Config

Add additional rules or override existing ones by spreading additional config objects:

```js
import path from "node:path";
import { axpoint } from "eslint-config-axpoint";

const gitignorePath = path.join(import.meta.dirname, ".gitignore");

export default [
  ...axpoint({ gitignorePath }),
  {
    rules: {
      // Your custom rules
      "no-console": "warn",
    },
  },
];
```

## Options

| Option          | Type     | Description                                                                |
| --------------- | -------- | -------------------------------------------------------------------------- |
| `gitignorePath` | `string` | Path to `.gitignore` file. Patterns will be added to ESLint's ignore list. |

## Requirements

- Node.js >= 22.14.0
- ESLint >= 9

## License

MIT
