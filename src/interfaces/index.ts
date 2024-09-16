import { QuickPickItem } from 'vscode';
import { Member, Project } from '@shortcut/client';

export type QuickPick<T> = Array<
{
  data: T;
} & QuickPickItem
>;

export interface IUser {
  role: string;
  profile: {
    mention_name: string;
  };
}

export type IMember = Member;
export type IProject = Project;
