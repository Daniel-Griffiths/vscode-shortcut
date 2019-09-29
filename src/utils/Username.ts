import * as vscode from "vscode";

import { api } from "../api";
import { User } from "./User";
import { Storage } from "./Storage";
import { IUserQuickPick } from "../interfaces";

export class Username {
  public static set = async () => {
    const { data } = await api.get(`members`);

    const users = User.toQuickPickItems(data);

    if (!users) return;

    const user = await vscode.window.showQuickPick<IUserQuickPick>(users);

    if (!user) return;

    const username = user.data.profile.mention_name;

    vscode.window.showInformationMessage(
      `Your username is now set to ${username}`
    );

    return Storage.set("username", username);
  };

  public static get = async () => {
    return await Storage.get("username");
  };
}
