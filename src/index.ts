import { Octokit } from "@octokit/rest";
import { Resource } from "sst";
import { songs } from "./data";

const OWNER = "joshborseth";
const REPO = "Kid-Cudi-Song-Of-The-Day";
const FILE_PATH = "README.md";
const BRANCH = "main";

const octokit = new Octokit({ auth: Resource.GITHUB_TOKEN.value });

function getRandomSong(currentSong: string): string {
  const randomSong = songs[Math.floor(Math.random() * songs.length)];
  return randomSong === currentSong ? getRandomSong(currentSong) : randomSong;
}

export async function handler() {
  try {
    const { data: fileData } = (await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
      ref: BRANCH,
    })) as { data: { content: string; sha: string } };

    const randomSong = getRandomSong(fileData.content);
    const newContent = `# Kid Cudi Song Of The Day\n${randomSong}`;

    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
      message: randomSong,
      content: Buffer.from(newContent).toString("base64"),
      sha: fileData.sha,
      branch: BRANCH,
    });

    console.log("README.md updated");
  } catch (error) {
    console.error("Error updating README.md:", error);
  }
}
