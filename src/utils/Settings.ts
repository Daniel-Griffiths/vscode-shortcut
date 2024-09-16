import { workspace } from 'vscode';

export class Setting {
  public static get(key: 'username' | 'token' | 'branchFormat' | 'workplaceSlug'): string {
    // prettier-ignore
    const value = workspace.getConfiguration('shortcut').get<string>(key);

    if (!value) {
      return '';
    }

    return value;
  }
}
