import { kebabCase } from "lodash";
import * as vscode from "vscode";

import { Git } from "./Git";
import { api } from "../api";
import { User } from "./User";
import { execute } from "./exec";
import { Story } from "./Story";
import { Storage } from "./Storage";
import { Workflow } from "./Workflow";

import {
  ISearchStory,
  IUserQuickPick,
  ISearchStoryQuickPick,
} from "../interfaces";

enum Action {
  openInBrowser,
  createBranch,
}

export class Commands {
  /**
   * Make sure we have the token and username on startup
   *
   * @returns {Promise<void>}
   */
  public setup = async () => {
    !this.getToken() ? await this.setToken() : this.getToken();
    !this.getUsername() ? await this.setUsername() : this.getUsername();
  };

  /**
   * Get the api token
   *
   * @returns {Promise<string>}
   */
  public getToken = (): string => {
    return Storage.get("token");
  };

  /**
   * Set the api token
   *
   * @returns {Promise<string>}
   */
  public setToken = async (): Promise<string> => {
    const token = await vscode.window.showInputBox({
      placeHolder: "Please enter your clubhouse api token",
    });

    if (token) {
      vscode.window.showInformationMessage(
        "The Clubhouse api token has been set"
      );

      return Storage.set("token", token);
    }

    return "";
  };

  /**
   * Get the username
   *
   * @returns {Promise<string>}
   */
  public getUsername = (): string => {
    return Storage.get("username");
  };

  /**
   * Set the username
   *
   * @returns {Promise<string>}
   */
  public setUsername = async (): Promise<string> => {
    const { data } = await api.get(`members?token=${this.getToken()}`);

    const users = User.toQuickPickItems(data);

    if (users) {
      const user = await vscode.window.showQuickPick<IUserQuickPick>(users);

      if (user) {
        const username = user.data.profile.mention_name;

        vscode.window.showInformationMessage(
          `Your username is now set to ${username}`
        );

        return Storage.set("username", username);
      }
    }

    return "";
  };

  /**
   * Get stories assigned to the
   * currently logged in user.
   *
   * @returns {Promise<void>}
   */
  public getStories = async () => {
    const workflowsStates = await Workflow.get();

    const selectedState = await vscode.window.showQuickPick(workflowsStates);

    if (selectedState) {
      const searchResults = await Story.search(
        `owner:${this.getUsername()} state:"${selectedState.label.toLowerCase()}"`
      );

      this.queryStories(searchResults);
    }
  };

  /**
   * Create a new pull story
   *
   * @returns {Promise<void>}
   */
  public createStory = async () => {
    Story.create();
  };

  /**
   * Create a new pull request
   *
   * @returns {Promise<void>}
   */
  public createPullRequest = async (): Promise<void> => {
    const branchName = await Git.getCurrentBranchName();
    const story = await Story.getBasedOnBranchName(branchName);

    const gitRemoteUrl = await execute([`git remote get-url origin`]);
    const gitRemoteUrlPath = gitRemoteUrl.split(":")[1].replace(".git", "");
    const storyDescription = `Story details: https://app.clubhouse.io/story/${
      story.id
    }`;

    const pullRequestUrl = `https://github.com/${gitRemoteUrlPath}/compare/${branchName}?expand=1&title=${
      story.name
    }&body=${storyDescription}`;

    vscode.env.openExternal(vscode.Uri.parse(pullRequestUrl));
  };

  /**
   * Create a new commit
   *
   * @returns {Promise<void>}
   */
  public createCommit = async (): Promise<void> => {
    const branchName = await Git.getCurrentBranchName();
    const story = await Story.getBasedOnBranchName(branchName);

    const defaultCommitMessage = `${story.name} [ch${story.id}]`;

    const commitMessage = await vscode.window.showInputBox({
      value: defaultCommitMessage,
      placeHolder: "Please enter a commit message",
    });

    if (commitMessage) {
      await execute([
        `git add .`,
        `git commit -m "${commitMessage}"`,
        `git push`,
      ]);
    }
  };

  /**
   * Search for a new story based on the provided query
   *
   * @returns {Promise<string>}
   */
  public search = async () => {
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
  public queryStories = async (stories: ISearchStory[]) => {
    if (!stories) return;

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

    switch (selectedAction.action) {
      case Action.openInBrowser:
        Story.openInBrowser(story.id);
        break;
      case Action.createBranch:
        const branchName = `${Storage.get("username")}/ch${
          story.id
        }/${kebabCase(story.name)}`;

        await execute([
          // @todo dont assume to default branch is called `develop`
          `git checkout develop`,
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
