import fs from "fs/promises";
import path from "path";
import TVClient from "./TVClient";

async function getChannels() {
  try {
    return JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), "data", "tv-channels.json"),
        "utf8"
      )
    );
  } catch {
    return [];
  }
}

export default async function TVPage() {
  const channels = await getChannels();

  return <TVClient channels={channels} />;
}
