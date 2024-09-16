import { kebabCase } from 'lodash';
import { Story as IStory } from '@shortcut/client';

import { Setting } from './Settings';

export class Branch {
  /**
   * Returns a branch name containing
   * the relevant details from the story
   * the format is also user configurable in VSCode.
   *
   * @param {IStory} story
   * @returns {string | null}
   */
  public static getNameFromStory(story: IStory): string | null {
    const branchFormat = Setting.get('branchFormat');
    const username = Setting.get('username');

    return branchFormat
      .replace('[owner_username]', username)
      .replace('[story_id]', `sc-${story.id}`)
      .replace('[story_type]', story.story_type)
      .replace('[story_name]', kebabCase(story.name));
  }
}
