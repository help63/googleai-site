import fs from "fs/promises";
import path from "path";

export async function getPosts(type) {
  try {
    const file = path.join(
      process.cwd(),
      "data",
      "posts.json"
    );

    const posts = JSON.parse(
      await fs.readFile(file, "utf8")
    );

    return posts.filter(
      (post) =>
        post.type === type &&
        post.published !== false
    );

  } catch {
    return [];
  }
}
