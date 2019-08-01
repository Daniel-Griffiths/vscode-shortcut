import * as vscode from "vscode";

const { exec } = require("child_process");

/**
 * Run commands from the project root
 *
 * @param {string[]} commands
 */
export const execute = async (commands: string[]): Promise<string> => {
  const command = [
    `cd ${vscode.workspace.rootPath as string}`,
    ...commands,
  ].join(" && ");

  return new Promise((resolve, _reject) => {
    exec(command, (error: string, stdout: string, stderr: string) => {
      if (error) {
        console.warn(error);
      }

      const output = (stdout ? stdout : stderr).trim();

      resolve(output);
    });
  });
};
