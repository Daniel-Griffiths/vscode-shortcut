import * as vscode from "vscode";

import { Commands } from "./utils/Commands";
import { registerGlobalState } from "./utils/registerGlobalState";

export function activate(context: vscode.ExtensionContext) {
  registerGlobalState(context);

  const commands = new Commands();

  commands.setup();

  /**
   * Commands
   */
  vscode.commands.registerCommand("clubhouse.search", commands.search);
  vscode.commands.registerCommand("clubhouse.setToken", commands.setToken);
  vscode.commands.registerCommand("clubhouse.getStories", commands.getStories);
  vscode.commands.registerCommand(
    "clubhouse.createPullRequest",
    commands.createPullRequest
  );
  vscode.commands.registerCommand(
    "clubhouse.createCommit",
    commands.createCommit
  );
  vscode.commands.registerCommand(
    "clubhouse.createStory",
    commands.createStory
  );
  vscode.commands.registerCommand(
    "clubhouse.setUsername",
    commands.setUsername
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
