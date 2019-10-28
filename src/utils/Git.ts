import * as vscode from "vscode";

import { execute } from "./exec";
import { Storage } from "./Storage";

export class Git {
  public static getCurrentBranchName = async () => {
    return await execute([`git branch | grep \\* | cut -d ' ' -f2`]);
  };

  /**
   * Set the default branch name
   *
   * @returns {Promise<string|void>}
   */
  public static setBaseBranch = async (): Promise<string | void> => {
    const defaultBranchName = await vscode.window.showInputBox({
      value: Storage.currentProjectGet("defaultBranchName"),
      placeHolder: "Please enter the name of the base branch (eg. develop)",
    });

    if (!defaultBranchName) return;

    vscode.window.showInformationMessage(
      `The base branch is now set to "${defaultBranchName}"`
    );

    return Storage.currentProjectSet(`defaultBranchName`, defaultBranchName);
  };
}
