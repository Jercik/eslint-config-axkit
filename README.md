# eslint-config-axpoint

Reusable ESLint flat config for TypeScript + Node.js projects with strict type checking, Prettier, Unicorn, and Vitest.

## Quick Start

```bash
# Install
npm install -D eslint eslint-config-axpoint
```

Create an `eslint.config.js` in your project root:

```js
import path from "node:path";
import { axpoint } from "eslint-config-axpoint";

const gitignorePath = path.join(import.meta.dirname, ".gitignore");

export default axpoint({ gitignorePath });
```

```bash
# Run
npx eslint .
```

## Installation

```bash
# npm
npm install -D eslint eslint-config-axpoint

# pnpm
pnpm add -D eslint eslint-config-axpoint
```

## Configuration

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

For the current rule set and presets, see the source code in `src/`.

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
