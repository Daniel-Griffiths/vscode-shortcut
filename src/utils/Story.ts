import * as vscode from "vscode";
import { Story as IStory, ID } from "clubhouse-lib";

import { api } from "../api";
import { ISearchStoryQuickPick } from "../interfaces";

export class Story {
  /**
   * Open the specified story in the browser
   *
   * @param {ID} id The story id
   * @static
   */
  public static openInBrowser = (id: ID) => {
    if (id) {
      vscode.env.openExternal(
        vscode.Uri.parse(`https://app.clubhouse.io/story/${id}`)
      );
    }
  };

  /**
   * Convert `ISearchStory[]` to `ISearchStoryQuickPick[]`
   *
   * @param {ISearchStory[]} stories
   * @returns {ISearchStoryQuickPick[]}
   * @static
   */
  public static toQuickPickItems = (
    stories: IStory[]
  ): ISearchStoryQuickPick[] => {
    return stories
      .filter(story => !story.archived)
      .map(story => {
        return {
          data: story,
          label: String(story.id),
          description: String(story.name)
        };
      });
  };

  /**
   * Search for stories based on the specified query
   *
   * @param   {string} query
   * @returns {Promise<IStory[]>}
   * @static
   */
  public static search = async (query: string): Promise<IStory[]> => {
    const { data } = await api().searchStories(query, 25);

    return data;
  };

  /**
   * Get a story based on it's ID
   *
   * @param   {ID} id The story id
   * @returns {Promise<IStory>}
   * @static
   */
  public static get = async (id: ID): Promise<IStory> => {
    return await api().getStory(id);
  };

  /**
   * Extract the story ID from the provided branch name
   *
   * @param   {string} branch
   * @returns {number | undefined}
   * @static
   */
  public static getIdFromBranchName = (branch: string): number | undefined => {
    const [_, branchId] = branch.split("/");

    if (!branchId) return;

    return Number(branchId.replace("ch", ""));
  };

  /**
   * Get a story based on the specified branch name
   *
   * @param   {string} branch
   * @returns {Promise<IStory|undefined>}
   * @static
   */
  public static getBasedOnBranchName = async (
    branch: string
  ): Promise<IStory | undefined> => {
    const storyId = Story.getIdFromBranchName(branch);

    if (!storyId) return;

    return await Story.get(storyId);
  };
}
