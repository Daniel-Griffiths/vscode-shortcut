import { isEmpty } from "lodash";
import {
  StorySearchResults as IStory,
  StorySearchResults as IStorySearchResults,
} from "@useshortcut/client";

import { Git } from "./Git";
import { Token } from "./Token";
import { Story } from "./Story";
import { execute } from "./exec";
import { VSCode } from "./VSCode";
import { Branch } from "./Branch";
import { Member } from "./Member";
import { Storage } from "./Storage";
import { Project } from "./Project";
import { Workflow } from "./Workflow";
import { Username } from "./Username";
import { Action } from "../enums/Action";
import { StoryType } from "../enums/StoryType";

import {
  STORY_CREATED_MESSAGE,
  NO_STORIES_FOUND_MESSAGE,
  NO_ASSOCIATED_STORY_MESSAGE,
  NO_STORIES_IN_WORKLOW_MESSAGE,
} from "../constants/messages";

export class Commands {
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
   * Create a new story.
   *
   * @returns {Promise<void>}
   */
  public createStory = async (): Promise<void> => {
    if (!(await this._setup())) return;

    const storyName = await VSCode.input({
      placeHolder: "Enter the story name",
    });

    if (!storyName) return;

    const storyDescription = await VSCode.input({
      placeHolder: "Enter the story descripion",
    });

    const storyEstimate = await VSCode.input({
      placeHolder: "Enter the story estimate (must be a number)",
    });

    const states = await Workflow.getAll();

    const storyState = await VSCode.quickPick(states, {
      placeHolder: "What is the story state?",
    });

    if (!storyState) return;

    const storyType = await VSCode.quickPick(
      [
        { label: "Feature", data: StoryType.feature },
        { label: "Bug", data: StoryType.bug },
        { label: "Chore", data: StoryType.chore },
      ],
      {
        placeHolder: "What is the story type?",
      }
    );

    if (!storyType) return;

    const projects = await Project.getAll();

    const storyProject = await VSCode.quickPick(
      Project.toQuickPickItems(projects),
      {
        placeHolder: "Which project does this story belong to?",
      }
    );

    if (!storyProject) return;

    const members = await Member.getAll();

    const storyOwner = await VSCode.quickPick(
      Member.toQuickPickItems(members),
      {
        placeHolder: "Who is the owner of this story?",
      }
    );

    if (!storyOwner) return;

    await Story.create({
      name: storyName,
      story_type: storyType.data,
      description: storyDescription,
      estimate: Number(storyEstimate),
      owner_ids: [storyOwner.data.id],
      project_id: storyProject.data.id,
      workflow_state_id: storyState.data.id,
    });

    VSCode.alertInfo(STORY_CREATED_MESSAGE);
  };

  /**
   * Get stories assigned to the
   * currently logged in user.
   *
   * @returns {Promise<void>}
   */
  public getStories = async (): Promise<void> => {
    if (!(await this._setup())) return;

    const workflowsStates = await Workflow.getAll();

    const selectedState = await VSCode.quickPick(workflowsStates);

    if (!selectedState) return;

    const searchResults = await VSCode.progressLoading(
      "Fetching stories...",
      async () => {
        return await Story.search(
          `owner:${await Username.get()} state:"${selectedState.data.name.toLowerCase()}" !is:archived`
        );
      }
    );

    this._queryStories(searchResults);
  };

  /**
   * Create a new pull request
   *
   * @returns {Promise<void>}
   */
  public createPullRequest = async (): Promise<void> => {
    if (!(await this._setup())) return;

    await VSCode.progressLoading("Creating pull request...", async () => {
      const githubUrl = "https://github.com/";
      const branchName = await Git.getCurrentBranchName();
      const story = await Story.getBasedOnBranchName(branchName);
      const gitRemoteUrl = await execute([`git remote get-url origin`]);

      if (!story) {
        VSCode.alertWarning(NO_STORIES_IN_WORKLOW_MESSAGE);
        return;
      }

      // Use different methods to extract the branch name
      // depending on if the user is using https or ssh
      const gitRemoteUrlPath = gitRemoteUrl.startsWith(githubUrl)
        ? gitRemoteUrl.replace(githubUrl, "").replace(".git", "")
        : gitRemoteUrl.split(":")[1].replace(".git", "");
      const storyDescription = `Story details: https://app.shortcut.com/story/${story.id}`;

      const pullRequestUrl = `https://github.com/${gitRemoteUrlPath}/compare/${branchName}?expand=1&title=${story.name}&body=${storyDescription}`;

      VSCode.openExternalUrl(pullRequestUrl);
    });
  };

  /**
   * Create a new commit and push it to the remote branch
   *
   * @returns {Promise<void>}
   */
  public createCommit = async (): Promise<void> => {
    if (!(await this._setup())) return;

    const branchName = await Git.getCurrentBranchName();
    const story = await Story.getBasedOnBranchName(branchName);

    if (!story) {
      VSCode.alertWarning(NO_ASSOCIATED_STORY_MESSAGE);
      return;
    }

    const storyName = story.name.replace(/[^\w\s]/gi, "");
    const defaultCommitMessage = `${storyName} [ch${story.id}]`;

    const commitMessage = await VSCode.input({
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
    if (!(await this._setup())) return;

    const query = await VSCode.input({
      placeHolder: "Please enter a search query",
    });

    const searchResults = await Story.search(query as string);

    this._queryStories(searchResults);
  };

  /**
   * Check all the required values are set before commands can run
   *
   * @returns {Promise<boolean>}
   */
  public _setup = async (): Promise<boolean> => {
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
      VSCode.alertWarning(error.message);
      return false;
    }
  };

  /**
   * @returns {Promise<void>}
   */
  private _queryStories = async (
    stories: IStorySearchResults
  ): Promise<void> => {
    if (isEmpty(stories)) {
      VSCode.alertInfo(NO_STORIES_FOUND_MESSAGE);
      return;
    }

    const selectedStory = await VSCode.quickPick(
      Story.toQuickPickItems(stories)
    );

    if (!selectedStory) return;

    const selectedAction = await VSCode.quickPick([
      {
        label: "View Story",
        description: "Open the story on shortcut.com",
        action: Action.openInBrowser,
      },
      {
        label: "Create Branch",
        description: "Create a new branch based on the story name",
        action: Action.createBranch,
      },
    ]);

    if (!selectedAction) return;

    const story = await Story.getById(selectedStory.data.id);

    const defaultBranchName = Storage.currentProjectGet("defaultBranchName");

    switch (selectedAction.action) {
      case Action.openInBrowser:
        Story.openInBrowser(story.id);
        break;
      case Action.createBranch:
        const branchName = Branch.getNameFromStory(story);

        await VSCode.alertLoading("Creating new branch...", async () => {
          return await execute([
            `git checkout ${defaultBranchName}`,
            `git pull`,
            `git checkout ${branchName} || git checkout -b ${branchName}`,
            `git push --set-upstream origin ${branchName}`,
          ]);
        });

        VSCode.alertInfo(`You are on a new branch ${branchName}`);

        break;
    }
  };
}
