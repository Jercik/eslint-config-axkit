import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const consumerRequire = createRequire(`${process.cwd()}/`);

async function dynamicImport(resolvedPath: string): Promise<unknown> {
  const imported = (await import(pathToFileURL(resolvedPath).href)) as Record<
    string,
    unknown
  >;
  return imported["default"] ?? imported;
}

/**
 * Dynamically import an optional dependency from the consumer's project.
 *
 * Uses `createRequire(cwd)` to resolve the module from the consumer's
 * node_modules (not from this package), then `import()` the resolved path.
 * This ensures transitive dependencies (e.g. `next` for `eslint-config-next`)
 * are accessible.
 */
export async function importOptional(name: string): Promise<unknown> {
  let resolvedPath: string;
  try {
    resolvedPath = consumerRequire.resolve(name);
  } catch {
    throw new Error(
      `eslint-config-axkit: "${name}" must be installed to use this option. Run: pnpm add -D ${name}`,
    );
  }
  return dynamicImport(resolvedPath);
}
