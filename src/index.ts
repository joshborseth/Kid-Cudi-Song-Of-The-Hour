import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // Ensure this is set correctly
});

async function pushCommit() {
  const owner = "joshborseth"; // Replace with your GitHub username
  const repo = "Senior-LinkedIn-Engineer"; // Replace with your repository name
  const branch = "main"; // Replace with your target branch

  // Get the reference for the branch
  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${branch}`,
  });

  const sha = refData.object.sha;
  console.log("Branch SHA:", sha); // Debugging output

  // Get the commit data to retrieve the tree SHA
  const { data: commitData } = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: sha,
  });

  console.log("Commit Data:", commitData); // Debugging output

  // Create a new tree with the changes
  const newTree = await octokit.git.createTree({
    owner,
    repo,
    base_tree: commitData.tree.sha, // Use the tree SHA from the commit data
    tree: [
      {
        path: "README.md", // Path to the file you want to change
        mode: "100644", // File mode
        content: "New content for the file", // New content
      },
    ],
  });

  // Create a new commit
  const newCommit = await octokit.git.createCommit({
    owner,
    repo,
    message: "Your commit message", // Commit message
    tree: newTree.data.sha,
    parents: [sha],
  });

  // Update the reference to point to the new commit
  await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: newCommit.data.sha,
  });

  console.log("Commit pushed successfully!");
}

export async function handler() {
  await pushCommit();
}
