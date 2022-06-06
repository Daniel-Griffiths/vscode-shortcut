import * as vscode from 'vscode';
import {
  Story as IStory,
  CreateStoryParams as IStoryChange,
  StorySearchResults as IStorySearchResults,
} from '@useshortcut/client';

import { api } from '../api';
import { QuickPick } from '../interfaces';
import { SHORTCUT_BASE_URL } from '../constants/shortcut';

export class Story {
  /**
   * Search for stories based on the specified query
   *
   * @param   {string} query
   * @returns {Promise<IStorySearchResults>}
   * @static
   */
  public static async search(query: string): Promise<IStorySearchResults> {
    const { data } = await api().searchStories({ query, page_size: 25 });

    return data;
  }

  /**
   * SCreate a new story
   *
   * @param   {IStoryChange} story
   * @returns {Promise<IStory>}
   * @static
   */
  public static async create(story: IStoryChange): Promise<IStory> {
    const { data } = await api().createStory(story);

    return data;
  }

  /**
   * Get a story based on it's ID
   *
   * @param   {number} id The story id
   * @returns {Promise<IStory>}
   * @static
   */
  public static async getById(id: number): Promise<IStory> {
    const { data } = await api().getStory(id);

    return data;
  }

  /**
   * Extract the story ID from the provided branch name
   *
   * @param   {string} branch
   * @returns {number | undefined}
   * @static
   */
  public static getIdFromBranchName(branch: string): number | undefined {
    const [, branchId] = branch.split('/');

    if (!branchId) return;

    const branchIdWithoutPrefix = branchId.replace(/\D/g, '');

    return Number(branchIdWithoutPrefix);
  }

  /**
   * Get a story based on the specified branch name
   *
   * @param   {string} branch
   * @returns {Promise<IStory|undefined>}
   * @static
   */
  public static async getBasedOnBranchName(
    branch: string,
  ): Promise<IStory | undefined> {
    const storyId = Story.getIdFromBranchName(branch);

    if (!storyId) return;

    return Story.getById(storyId);
  }

  /**
   * Open the specified story in the browser
   *
   * @param {number} id The story id
   * @static
   */
  public static openInBrowser(id: number) {
    if (id) {
      vscode.env.openExternal(
        vscode.Uri.parse(`${SHORTCUT_BASE_URL}/story/${id}`),
      );
    }
  }

  /**
   * Convert `IStorySearchResults` to `IStoryQuickPick[]`
   *
   * @param {IStorySearchResults} stories
   * @returns {IStoryQuickPick[]}
   * @static
   */
  public static toQuickPickItems(
    stories: IStorySearchResults,
  ): QuickPick<IStory> {
    return stories.data.map((story) => ({
      data: story,
      label: String(story.id),
      description: String(story.name),
    }));
  }
}
