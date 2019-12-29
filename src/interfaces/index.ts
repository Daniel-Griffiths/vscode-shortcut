import { Story } from "clubhouse-lib";
import { QuickPickItem } from "vscode";

export interface ISearchStoryQuickPick extends QuickPickItem {
  data: Story;
}

export interface IUser {
  role: string;
  profile: {
    mention_name: string;
  };
}
