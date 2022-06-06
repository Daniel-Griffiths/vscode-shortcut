import * as vscode from 'vscode';

import { Commands } from './utils/Commands';
import { registerGlobalState } from './utils/registerGlobalState';

export function activate(context: vscode.ExtensionContext) {
  registerGlobalState(context);

  const commands = new Commands();

  /**
   * Commands
   */
  vscode.commands.registerCommand('shortcut.search', commands.search);
  vscode.commands.registerCommand('shortcut.getStories', commands.getStories);
  vscode.commands.registerCommand('shortcut.createStory', commands.createStory);
  vscode.commands.registerCommand(
    'shortcut.createPullRequest',
    commands.createPullRequest,
  );
  vscode.commands.registerCommand(
    'shortcut.createCommit',
    commands.createCommit,
  );
  vscode.commands.registerCommand(
    'shortcut.setBaseBranch',
    commands.setBaseBranch,
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
