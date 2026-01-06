import path from "node:path";
import { axpoint } from "./src/index.ts";

const gitignorePath = path.join(import.meta.dirname, ".gitignore");

export default axpoint({ gitignorePath });
