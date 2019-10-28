import { QuickPickItem } from "vscode";
import { StorySearchResult, Story } from "clubhouse-lib";

export interface ISearchStoryQuickPick extends QuickPickItem {
  data: Story;
}

export interface IUser {
  role: string;
  profile: {
    mention_name: string;
  };
}
