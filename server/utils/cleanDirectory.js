import { readdir, stat, rm, unlink } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// __dirname workaround for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function cleanDirectory(relativePath) {
  const directoryPath = path.join(__dirname, "..", relativePath);

  try {
    const files = await readdir(directoryPath);

    for (const file of files) {
      if (file === ".gitkeep") continue;

      const fullPath = path.join(directoryPath, file);
      const stats = await stat(fullPath);

      if (stats.isDirectory()) {
        await rm(fullPath, { recursive: true, force: true });
      } else {
        await unlink(fullPath);
      }
    }

    console.log(`✅ Cleaned directory: ${directoryPath}`);
  } catch (err) {
    console.error("❌ Failed to clean directory:", err);
  }
}
