import * as path from "path";
import * as vscode from "vscode";

import { api } from "../api";
import { globalContext } from "./registerGlobalState";
import { IStory, ISearchStory, ISearchStoryQuickPick } from "../interfaces";

const marked = require("marked");

function loadScript(path: string) {
  return `<script src="${vscode.Uri.file(globalContext.asAbsolutePath(path))
    .with({ scheme: "vscode-resource" })
    .toString()}"></script>`;
}

export class Story {
  /**
   * Open the specified story in the browser
   *
   * @param {number} id The story id
   * @static
   */
  public static openInBrowser = (id: number) => {
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
    stories: ISearchStory[]
  ): ISearchStoryQuickPick[] => {
    return stories
      .filter(story => !story.archived)
      .map(story => {
        return {
          data: story,
          label: String(story.id),
          description: String(story.name),
        };
      });
  };

  /**
   * Search for stories based on the specified query
   *
   * @param   {string} query
   * @returns {Promise<ISearchStory[]>}
   * @static
   */
  public static search = async (query: string): Promise<ISearchStory[]> => {
    const {
      data: { data },
    } = await api.get(`search/stories?page_size=25&query=${query}"`);

    return data;
  };

  /**
   * Get a story based on it's ID
   *
   * @param   {number} id The story id
   * @returns {Promise<IStory>}
   * @static
   */
  public static get = async (id: number): Promise<IStory> => {
    const { data } = await api.get(`stories/${id}`);

    return data;
  };

  /**
   * Extract the story ID from the provided branch name
   *
   * @param   {string} branch
   * @returns {number}
   * @static
   */
  public static getIdFromBranchName = (branch: string): number => {
    return Number(branch.split("/")[1].replace("ch", ""));
  };

  /**
   * Get a story based on the specified branch name
   *
   * @param   {string} branch
   * @returns {Promise<IStory>}
   * @static
   */
  public static getBasedOnBranchName = async (
    branch: string
  ): Promise<IStory> => {
    const storyId = Story.getIdFromBranchName(branch);

    return await Story.get(storyId);
  };

  /**
   * Open story in a web view
   *
   * @static
   */
  public static openInWebView = (story: IStory): void => {
    const panel = vscode.window.createWebviewPanel(
      "Story",
      "Story",
      vscode.ViewColumn.Active,
      {
        enableScripts: true,
      }
    );

    panel.webview.html = `
    <h1><a href="https://app.clubhouse.io/story/${story.id}">${story.id}</a>: ${
      story.name
    }</h1>
    <p>${marked(story.description)}</p>
      <pre>
        ${JSON.stringify(story.tasks)}

        ${JSON.stringify(story.comments)}
        </pre>
    `;
  };

  /**
   * Create a new story
   *
   * @static
   */
  public static create = (): void => {
    const panel = vscode.window.createWebviewPanel(
      "Create Story",
      "Create Story",
      vscode.ViewColumn.Active,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(globalContext.extensionPath, "out")),
        ],
      }
    );

    panel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      </head>
      <body>
          <div id="root"></div>
          <script>
            window.story = 'testing story'
          </script>
          ${loadScript("out/bundle.js")}
      </body>
      </html>
  `;
  };
}
