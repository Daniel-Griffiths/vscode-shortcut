import * as vscode from "vscode";
import { kebabCase, isEmpty } from "lodash";

import { Git } from "./Git";
import { Token } from "./Token";
import { execute } from "./exec";
import { Story } from "./Story";
import { Storage } from "./Storage";
import { Workflow } from "./Workflow";
import { Username } from "./Username";

import {
  NO_STORIES_FOUND_MESSAGE,
  NO_ASSOCIATED_STORY_MESSAGE,
} from "../constants/messages";

import { Story as IStory } from "clubhouse-lib";
import { ISearchStoryQuickPick } from "../interfaces";

enum Action {
  openInBrowser,
  createBranch,
}

export class Commands {
  /**
   * Check all the required values are set before commands can run
   *
   * @returns {Promise<boolean>}
   */
  public setup = async (): Promise<boolean> => {
    try {
      if (!Storage.get("token")) {
        await Token.set();
      }

      if (!Storage.get("username")) {
        await Username.set();
      }

      if (!Storage.currentProjectGet("defaultBranchName")) {
        await Git.setBaseBranch();
      }

      return ![
        Storage.get("token"),
        Storage.get("username"),
        Storage.currentProjectGet("defaultBranchName"),
      ].some((setting) => setting === false);
    } catch (error) {
      vscode.window.showWarningMessage(error.message);
      return false;
    }
  };

  /**
   * Set the token
   *
   * @returns {Promise<string|void>}
   */
  public setToken = async (): Promise<string | void> => {
    return await Token.set();
  };

  /**
   * Set the default base branch
   *
   * @returns {Promise<string|void>}
   */
  public setBaseBranch = async (): Promise<string | void> => {
    return Git.setBaseBranch();
  };

  /**
   * Get stories assigned to the
   * currently logged in user.
   *
   * @returns {Promise<void>}
   */
  public getStories = async (): Promise<void> => {
    if (!(await this.setup())) return;

    const workflowsStates = await Workflow.get();

    const selectedState = await vscode.window.showQuickPick(workflowsStates);

    if (!selectedState) return;

    const searchResults = await Story.search(
      `owner:${await Username.get()} state:"${selectedState.label.toLowerCase()}"`
    );

    this.queryStories(searchResults);
  };

  /**
   * Create a new pull request
   *
   * @returns {Promise<void>}
   */
  public createPullRequest = async (): Promise<void> => {
    if (!(await this.setup())) return;

    const githubUrl = "https://github.com/";
    const branchName = await Git.getCurrentBranchName();
    const story = await Story.getBasedOnBranchName(branchName);
    const gitRemoteUrl = await execute([`git remote get-url origin`]);

    if (!story) {
      vscode.window.showWarningMessage(NO_ASSOCIATED_STORY_MESSAGE);
      return;
    }

    // Use different methods to extract the branch name
    // depending on if the user is using https or ssh
    const gitRemoteUrlPath = gitRemoteUrl.startsWith(githubUrl)
      ? gitRemoteUrl.replace(githubUrl, "").replace(".git", "")
      : gitRemoteUrl.split(":")[1].replace(".git", "");
    const storyDescription = `Story details: https://app.clubhouse.io/story/${story.id}`;

    const pullRequestUrl = `https://github.com/${gitRemoteUrlPath}/compare/${branchName}?expand=1&title=${story.name}&body=${storyDescription}`;

    vscode.env.openExternal(vscode.Uri.parse(pullRequestUrl));
  };

  /**
   * Redo the previous commit
   *
   * @returns {Promise<void>}
   */
  public redoCommit = async (): Promise<void> => {
    await execute([
      `git add .`,
      `git commit --amend -C HEAD`,
      `git push --force-with-lease`,
    ]);
  };

  /**
   * Create a new commit and push it to the remote branch
   *
   * @returns {Promise<void>}
   */
  public createCommitAndPush = async (): Promise<void> => {
    if (!(await this.setup())) return;

    const branchName = await Git.getCurrentBranchName();
    const story = await Story.getBasedOnBranchName(branchName);

    if (!story) {
      vscode.window.showWarningMessage(NO_ASSOCIATED_STORY_MESSAGE);
      return;
    }

    const storyName = story.name.replace(/[^\w\s]/gi, "");
    const defaultCommitMessage = `${storyName} [ch${story.id}]`;

    const commitMessage = await vscode.window.showInputBox({
      value: defaultCommitMessage,
      placeHolder: "Please enter a commit message",
    });

    if (!commitMessage) return;

    await execute([
      `git add .`,
      `git commit -m "${commitMessage}"`,
      `git push`,
    ]);
  };

  /**
   * Search for a new story based on the provided query
   *
   * @returns {Promise<void>}
   */
  public search = async (): Promise<void> => {
    if (!(await this.setup())) return;

    const query = await vscode.window.showInputBox({
      placeHolder: "Please enter a search query",
    });

    const searchResults = await Story.search(query as string);

    this.queryStories(searchResults);
  };

  /**
   * WIP
   *
   * @returns {Promise<void>}
   */
  private queryStories = async (stories: IStory[]): Promise<void> => {
    if (isEmpty(stories)) {
      vscode.window.showInformationMessage(NO_STORIES_FOUND_MESSAGE);
      return;
    }

    const selectedStory = await vscode.window.showQuickPick<
      ISearchStoryQuickPick
    >(Story.toQuickPickItems(stories));

    if (!selectedStory) return;

    const selectedAction = await vscode.window.showQuickPick([
      {
        label: "View Story",
        description: "Open the story on clubhouse.io",
        action: Action.openInBrowser,
      },
      {
        label: "Create Branch",
        description: "Create a new branch based on the story name",
        action: Action.createBranch,
      },
    ]);

    if (!selectedAction) return;

    const story = await Story.get(selectedStory.data.id);

    const defaultBranchName = Storage.currentProjectGet("defaultBranchName");

    switch (selectedAction.action) {
      case Action.openInBrowser:
        Story.openInBrowser(story.id);
        break;
      case Action.createBranch:
        const branchName = `${Storage.get("username")}/ch${
          story.id
        }/${kebabCase(story.name)}`;

        await execute([
          `git checkout ${defaultBranchName}`,
          `git pull`,
          `git checkout ${branchName} || git checkout -b ${branchName}`,
          `git push --set-upstream origin ${branchName}`,
        ]);

        vscode.window.showInformationMessage(
          `You are on a new branch ${branchName}`
        );

        break;
    }
  };
}
