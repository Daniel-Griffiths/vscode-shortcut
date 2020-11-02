import { execute } from "./exec";
import { VSCode } from "./VSCode";
import { Storage } from "./Storage";

export class Git {
  public static async getCurrentBranchName() {
    return await execute([`git branch | grep \\* | cut -d ' ' -f2`]);
  }

  /**
   * Set the default branch name
   *
   * @returns {Promise<string|void>}
   */
  public static async setBaseBranch(): Promise<string | void> {
    const defaultBranchName = await VSCode.input({
      value: Storage.currentProjectGet("defaultBranchName"),
      placeHolder: "Please enter the name of the base branch (eg. develop)",
    });

    if (!defaultBranchName) return;

    VSCode.alertInfo(`The base branch is now set to "${defaultBranchName}"`);

    return Storage.currentProjectSet(`defaultBranchName`, defaultBranchName);
  }
}
