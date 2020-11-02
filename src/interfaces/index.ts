import { QuickPickItem } from "vscode";
import { Story, WorkflowState } from "clubhouse-lib";

export interface ISearchStoryQuickPick extends QuickPickItem {
  data: Story;
}

export interface ISearchWorkflowQuickPick extends QuickPickItem {
  data: WorkflowState;
}

export interface IUser {
  role: string;
  profile: {
    mention_name: string;
  };
}
