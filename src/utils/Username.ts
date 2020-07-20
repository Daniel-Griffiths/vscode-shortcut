import * as vscode from "vscode";

import { api } from "../api";
import { Storage } from "./Storage";

export class Username {
  public static set = async () => {
    const user = await api().getCurrentMember();

    const username = user.mention_name;

    return Storage.set("username", username);
  };

  public static get = async () => {
    return await Storage.get("username");
  };
}
