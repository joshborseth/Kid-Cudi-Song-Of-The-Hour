import { Octokit } from "@octokit/rest";

const OWNER = "joshborseth";
const REPO = "Senior-LinkedIn-Engineer";
const FILE_PATH = "README.md";
const BRANCH = "main";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function handler() {
  try {
    const { data: fileData } = (await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
      ref: BRANCH,
    })) as { data: { content: string; sha: string } };

    const currentContent = Buffer.from(fileData.content, "base64").toString("utf-8");
    const content = String(Number(currentContent) + 1);

    const newContent = `${currentContent}\n\n${content}`;

    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
      message: content,
      content: Buffer.from(newContent).toString("base64"),
      sha: fileData.sha,
      branch: BRANCH,
    });
    console.log("README.md updated");
  } catch (error) {
    console.error("Error updating README.md:", error);
  }
}
