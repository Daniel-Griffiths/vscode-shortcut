import * as vscode from "vscode";

import { Storage } from "./Storage";

export class Token {
  /**
   * Set the clubhouse api token
   *
   * @returns {Promise<string | void>}
   */
  public static set = async (): Promise<string | void> => {
    const token = await vscode.window.showInputBox({
      placeHolder: "Please enter your clubhouse api token",
    });

    if (!token) return;

    vscode.window.showInformationMessage(
      "The Clubhouse api token has been set"
    );

    return Storage.set("token", token);
  };
}
