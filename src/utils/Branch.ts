import { kebabCase } from "lodash";
import { workspace } from "vscode";
import { Story as IStory } from "clubhouse-lib";

import { Storage } from "./Storage";

export class Branch {
  /**
   * Returns a branch name containing
   * the relevant details from the story
   * the format is also user configurable in VSCode.
   *
   * @param {IStory} story
   * @returns {string}
   */
  public static getNameFromStory(story: IStory): string {
    // prettier-ignore
    const branchFormat = workspace.getConfiguration("clubhouse").get<string>("branchFormat") || "[story_type]/[story_id]/[story_name]";

    return branchFormat
      .replace("[story_id]", `sc-${story.id}`)
      .replace("[story_type]", story.story_type)
      .replace("[story_name]", kebabCase(story.name))
      .replace("[owner_username]", Storage.get("username"));
  }
}
