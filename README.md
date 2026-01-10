# eslint-config-axkit

Reusable ESLint flat config for TypeScript + Node.js projects with strict type checking, Prettier, Unicorn, and Vitest.

## Quick Start

```bash
# Install
npm install -D eslint eslint-config-axkit
```

Create an `eslint.config.js` in your project root:

```js
import path from "node:path";
import { axkit } from "eslint-config-axkit";

const gitignorePath = path.join(import.meta.dirname, ".gitignore");

export default axkit({ gitignorePath });
```

```bash
# Run
npx eslint .
```

## Installation

```bash
# npm
npm install -D eslint eslint-config-axkit

# pnpm
pnpm add -D eslint eslint-config-axkit
```

## Configuration

Create an `eslint.config.js` in your project root:

```js
import path from "node:path";
import { axkit } from "eslint-config-axkit";

const gitignorePath = path.join(import.meta.dirname, ".gitignore");

export default axkit({ gitignorePath });
```

Or without gitignore integration:

```js
import { axkit } from "eslint-config-axkit";

export default axkit();
```

## What's Included

For the current rule set and presets, see the source code in `src/`.

## Extending the Config

Add additional rules or override existing ones by spreading additional config objects:

```js
import path from "node:path";
import { axkit } from "eslint-config-axkit";

const gitignorePath = path.join(import.meta.dirname, ".gitignore");

export default [
  ...axkit({ gitignorePath }),
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
