import { Octokit } from "@octokit/rest";
import { Resource } from "sst";

const OWNER = "joshborseth";
const REPO = "Senior-LinkedIn-Engineer";
const FILE_PATH = "README.md";
const BRANCH = "main";

const octokit = new Octokit({ auth: Resource.GITHUB_TOKEN.value });

export async function handler() {
  try {
    const { data: fileData } = (await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
      ref: BRANCH,
    })) as { data: { content: string; sha: string } };

    const currentContent = Buffer.from(fileData.content, "base64").toString("utf-8");
    const newContent = String(Number(currentContent) + 1);

    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
      message: newContent,
      content: Buffer.from(newContent).toString("base64"),
      sha: fileData.sha,
      branch: BRANCH,
    });
    console.log("README.md updated");
  } catch (error) {
    console.error("Error updating README.md:", error);
  }
}
