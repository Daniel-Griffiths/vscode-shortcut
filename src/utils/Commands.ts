import { isEmpty } from 'lodash';
import { StorySearchResults as IStorySearchResults } from '@shortcut/client';

import { Git } from './Git';
import { Story } from './Story';
import { execute } from './exec';
import { VSCode } from './VSCode';
import { Branch } from './Branch';
import { Member } from './Member';
import { Storage } from './Storage';
import { Project } from './Project';
import { Workflow } from './Workflow';
import { Action } from '../enums/Action';
import { StoryType } from '../enums/StoryType';
import {
  SHORTCUT_BASE_URL,
  SHORTCUT_STORY_ID_PREFIX,
} from '../constants/shortcut';

import {
  STORY_CREATED_MESSAGE,
  NO_STORIES_FOUND_MESSAGE,
  NO_ASSOCIATED_STORY_MESSAGE,
  NO_STORIES_IN_WORKLOW_MESSAGE,
} from '../constants/messages';
import { Setting } from './Settings';
import { Setup } from '../decorators/Setup';

export class Commands {
  /**
   * Set the default base branch
   *
   * @returns {Promise<string|void>}
   */
  @Setup()
  public async setBaseBranch(): Promise<string | void> {
    Git.setBaseBranch();
  }

  /**
   * Create a new story.
   *
   * @returns {Promise<void>}
   */
  @Setup()
  public async createStory(): Promise<void> {
    const storyName = await VSCode.input({
      placeHolder: 'Enter the story name',
    });

    if (!storyName) return;

    const storyDescription = await VSCode.input({
      placeHolder: 'Enter the story descripion',
    });

    const storyEstimate = await VSCode.input({
      placeHolder: 'Enter the story estimate (must be a number)',
    });

    const states = await Workflow.getAll();

    const storyState = await VSCode.quickPick(states, {
      placeHolder: 'What is the story state?',
    });

    if (!storyState) return;

    const storyType = await VSCode.quickPick(
      [
        { label: 'Feature', data: StoryType.feature },
        { label: 'Bug', data: StoryType.bug },
        { label: 'Chore', data: StoryType.chore },
      ],
      {
        placeHolder: 'What is the story type?',
      }
    );

    if (!storyType) return;

    const projects = await Project.getAll();

    const storyProject = await VSCode.quickPick(
      Project.toQuickPickItems(projects),
      {
        placeHolder: 'Which project does this story belong to?',
      }
    );

    if (!storyProject) return;

    const members = await Member.getAll();

    const storyOwner = await VSCode.quickPick(
      Member.toQuickPickItems(members),
      {
        placeHolder: 'Who is the owner of this story?',
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
  }

  /**
   * Get stories assigned to the
   * currently logged in user.
   *
   * @returns {Promise<void>}
   */
  @Setup()
  public async getStories(): Promise<void> {
    const workflowsStates = await Workflow.getAll();

    const selectedState = await VSCode.quickPick(workflowsStates);

    if (!selectedState) return;

    const searchResults = await VSCode.progressLoading(
      'Fetching stories...',
      async () =>
        Story.search(
          `owner:${Setting.get(
            'username'
          )} state:"${selectedState.data.name.toLowerCase()}" !is:archived`
        )
    );

    this._queryStories(searchResults);
  }

  /**
   * Create a new pull request
   *
   * @returns {Promise<void>}
   */
  @Setup()
  public async createPullRequest(): Promise<void> {
    await VSCode.progressLoading('Creating pull request...', async () => {
      const githubUrl = 'https://github.com/';
      const branchName = await Git.getCurrentBranchName();
      const story = await Story.getBasedOnBranchName(branchName);
      const gitRemoteUrl = await execute(['git remote get-url origin']);

      if (!story) {
        VSCode.alertWarning(NO_STORIES_IN_WORKLOW_MESSAGE);
        return;
      }

      // Use different methods to extract the branch name
      // depending on if the user is using https or ssh
      const gitRemoteUrlPath = gitRemoteUrl.startsWith(githubUrl)
        ? gitRemoteUrl.replace(githubUrl, '').replace('.git', '')
        : gitRemoteUrl.split(':')[1].replace('.git', '');
      const storyDescription = `Story details: ${SHORTCUT_BASE_URL}/story/${story.id}`;

      const pullRequestUrl = `https://github.com/${gitRemoteUrlPath}/compare/${branchName}?expand=1&title=${story.name}&body=${storyDescription}`;

      VSCode.openExternalUrl(pullRequestUrl);
    });
  }

  /**
   * Create a new commit and push it to the remote branch
   *
   * @returns {Promise<void>}
   */
  @Setup()
  public async createCommit(): Promise<void> {
    const branchName = await Git.getCurrentBranchName();
    const story = await Story.getBasedOnBranchName(branchName);

    if (!story) {
      VSCode.alertWarning(NO_ASSOCIATED_STORY_MESSAGE);
      return;
    }

    const storyName = story.name.replace(/[^\w\s]/gi, '');
    const defaultCommitMessage = `${storyName} [${SHORTCUT_STORY_ID_PREFIX}${story.id}]`;

    const commitMessage = await VSCode.input({
      value: defaultCommitMessage,
      placeHolder: 'Please enter a commit message',
    });

    if (!commitMessage) return;

    await execute([
      'git add .',
      `git commit -m "${commitMessage}"`,
      'git push',
    ]);
  }

  /**
   * Search for a new story based on the provided query
   *
   * @returns {Promise<void>}
   */
  @Setup()
  public async search(): Promise<void> {
    const query = await VSCode.input({
      placeHolder: 'Please enter a search query',
    });

    const searchResults = await Story.search(query as string);

    this._queryStories(searchResults);
  }

  /**
   * @returns {Promise<void>}
   */
  private async _queryStories(stories: IStorySearchResults): Promise<void> {
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
        label: 'View Story',
        description: 'Open the story on shortcut.com',
        action: Action.openInBrowser,
      },
      {
        label: 'Create Branch',
        description: 'Create a new branch based on the story name',
        action: Action.createBranch,
      },
    ]);

    if (!selectedAction) return;

    const story = await Story.getById(selectedStory.data.id);

    const defaultBranchName = Storage.currentProjectGet('defaultBranchName');
    const branchName = Branch.getNameFromStory(story);

    if (!branchName) return;

    switch (selectedAction.action) {
      case Action.openInBrowser:
        Story.openInBrowser(story.id);
        break;
      case Action.createBranch:
        await VSCode.alertLoading('Creating new branch...', async () => {
          execute([
            `git checkout ${defaultBranchName}`,
            'git pull',
            `git checkout ${branchName} || git checkout -b ${branchName}`,
            `git push --set-upstream origin ${branchName}`,
          ]);
        });

        VSCode.alertInfo(`You are on a new branch ${branchName}`);
        break;
      default:
        VSCode.alertInfo('Command not found');
        break;
    }
  }
}
