import { Octokit } from "@octokit/rest";

const OWNER = "joshborseth"; // Replace with your GitHub username
const REPO = "Senior-LinkedIn-Engineer"; // Replace with your repository name
const FILE_PATH = "README.md"; // The file to modify
const COMMIT_MESSAGE = "Update README.md"; // Commit message
const BRANCH = "main"; // The branch to update

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function handler() {
  try {
    // Get the current content of the README.md file
    const { data: fileData } = (await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
    })) as { data: { content: string; sha: string } };

    const sha = fileData.sha;

    // Create a new commit
    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
      message: COMMIT_MESSAGE,
      content: "Boomshackalacka!",
      sha: sha,
      branch: BRANCH, // Specify the branch to update
    });

    console.log("README.md updated successfully!");
  } catch (error) {
    console.error("Error updating README.md:", error);
  }
}
