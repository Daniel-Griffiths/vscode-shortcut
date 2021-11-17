import { ShortcutClient } from "@useshortcut/client";

import { Storage } from "./utils/Storage";

let shortcutInstance: ShortcutClient<unknown>;

export const api = () => {
  const token = Storage.get<string>("token");

  if (!shortcutInstance || !token) {
    shortcutInstance = new ShortcutClient(token);
  }

  return shortcutInstance;
};
