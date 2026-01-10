import path from "node:path";
import { axkit } from "./src/index.ts";

const gitignorePath = path.join(import.meta.dirname, ".gitignore");

export default axkit({ gitignorePath });
