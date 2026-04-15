// src/infrastructure/services/FileService.ts
import fs from "fs";
import path from "path";
import axios from "axios";
import { pipeline } from "stream/promises";

export class FileStorageService {
  // Use absolute path inside the container
  private uploadDir = "/app/uploads";

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async save(url: string): Promise<string> {
    const fileName = `${Date.now()}-${path.basename(url.split("?")[0]) || "image.jpg"}`;
    const filePath = path.join(this.uploadDir, fileName);

    try {
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
      });

      // Pipeline ensures the file is FULLY written to disk before resolving
      await pipeline(response.data, fs.createWriteStream(filePath));

      console.log(`Successfully saved: ${fileName}`);
      return fileName;
    } catch (error: any) {
      console.error(`Failed to download ${url}:`, error.message);
      throw error;
    }
  }
}
