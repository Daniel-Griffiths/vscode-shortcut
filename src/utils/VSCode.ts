import * as vscode from "vscode";

export class VSCode {
  /**
   * Open up the webview in a new tab.
   *
   * @param options
   * @returns {void}
   */
  public static openWebView(options: { title: string; html: string }): void {
    const panel = vscode.window.createWebviewPanel(
      "catCoding",
      options.title,
      vscode.ViewColumn.One,
      {}
    );

    panel.webview.html = `<div style="max-width: 900px; margin: auto;">${options.html}</div>`;
  }

  /**
   * Select a quickpick item
   *
   * @param {T[]} items
   * @param {vscode.QuickPickOptions} options
   * @returns {Promise<T | undefined>}
   */
  public static async quickPick<T extends vscode.QuickPickItem>(
    items: T[],
    options?: vscode.QuickPickOptions
  ): Promise<T | undefined> {
    return await vscode.window.showQuickPick(items, options);
  }

  /**
   * Display a info alert
   *
   * @param {string} message
   * @returns {Thenable<string | undefined>}
   */
  public static alertInfo(message: string): Thenable<string | undefined> {
    return vscode.window.showInformationMessage(message);
  }

  /**
   * Display a warning alert
   *
   * @param {string} message
   * @returns {Thenable<string | undefined>}
   */
  public static alertWarning(message: string): Thenable<string | undefined> {
    return vscode.window.showWarningMessage(message);
  }

  /**
   * Display a error alert
   *
   * @param {string} message
   * @returns {Thenable<string | undefined>}
   */
  public static alertError(message: string): Thenable<string | undefined> {
    return vscode.window.showErrorMessage(message);
  }

  /**
   * Display a loading alert until the callback resolves
   *
   * @param {string} message
   * @param {Progress<{ message?: string; increment?: number }>} callback
   */
  public static async alertLoading<T>(
    message: string,
    callback: () => Promise<T>
  ) {
    return await vscode.window.withProgress(
      {
        title: message,
        cancellable: false,
        location: vscode.ProgressLocation.Notification,
      },
      () => {
        return callback();
      }
    );
  }

  /**
   * Display a loading indicator in the status bar until the callback resolves
   *
   * @param {string} message
   * @param {Progress<{ message?: string; increment?: number }>} callback
   */
  public static async progressLoading<T>(
    message: string,
    callback: () => Promise<T>
  ) {
    return await vscode.window.withProgress(
      {
        title: message,
        cancellable: false,
        location: vscode.ProgressLocation.Window,
      },
      () => {
        return callback();
      }
    );
  }

  /**
   * Display a input prompt
   *
   * @param {vscode.InputBoxOptions} options
   * @returns {Promise<Thenable<string | undefined>>}
   */
  public static async input(
    options: vscode.InputBoxOptions
  ): Promise<Thenable<string | undefined>> {
    return await vscode.window.showInputBox(options);
  }

  /**
   * Opens a external url in the default web browser
   *
   * @param {string} url
   * @returns {Thenable<boolean>}
   */
  public static openExternalUrl(url: string): Thenable<boolean> {
    return vscode.env.openExternal(vscode.Uri.parse(url));
  }
}
