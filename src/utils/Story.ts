import * as vscode from "vscode";
import {
  ID,
  Story as IStory,
  StoryChange as IStoryChange,
} from "clubhouse-lib";

import { api } from "../api";
import { QuickPick } from "../interfaces";

export class Story {
  /**
   * Search for stories based on the specified query
   *
   * @param   {string} query
   * @returns {Promise<IStory[]>}
   * @static
   */
  public static async search(query: string): Promise<IStory[]> {
    const { data } = await api().searchStories(query, 25);

    return data;
  }

  /**
   * SCreate a new story
   *
   * @param   {strIStoryChangeing} story
   * @returns {Promise<IStory>}
   * @static
   */
  public static async create(story: IStoryChange): Promise<IStory> {
    return await api().createStory(story);
  }

  /**
   * Get a story based on it's ID
   *
   * @param   {ID} id The story id
   * @returns {Promise<IStory>}
   * @static
   */
  public static async getById(id: ID): Promise<IStory> {
    return await api().getStory(id);
  }

  /**
   * Extract the story ID from the provided branch name
   *
   * @param   {string} branch
   * @returns {number | undefined}
   * @static
   */
  public static getIdFromBranchName(branch: string): number | undefined {
    const [_, branchId] = branch.split("/");

    if (!branchId) return;

    return Number(branchId.replace("ch", ""));
  }

  /**
   * Get a story based on the specified branch name
   *
   * @param   {string} branch
   * @returns {Promise<IStory|undefined>}
   * @static
   */
  public static async getBasedOnBranchName(
    branch: string
  ): Promise<IStory | undefined> {
    const storyId = Story.getIdFromBranchName(branch);

    if (!storyId) return;

    return await Story.getById(storyId);
  }

  /**
   * Open the specified story in the browser
   *
   * @param {ID} id The story id
   * @static
   */
  public static openInBrowser(id: ID) {
    if (id) {
      vscode.env.openExternal(
        vscode.Uri.parse(`https://app.clubhouse.io/story/${id}`)
      );
    }
  }

  /**
   * Convert `IStory[]` to `IStoryQuickPick[]`
   *
   * @param {IStory[]} stories
   * @returns {IStoryQuickPick[]}
   * @static
   */
  public static toQuickPickItems(stories: IStory[]): QuickPick<IStory> {
    return stories.map((story) => {
      return {
        data: story,
        label: String(story.id),
        description: String(story.name),
      };
    });
  }
}
