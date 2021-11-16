import { ShortcutClient } from "@useshortcut/client";

import { Storage } from "./utils/Storage";

let shortcutInstance: ShortcutClient<unknown>;

export const api = () => {
  if (!shortcutInstance) {
    console.log(Storage.get("token"));
    shortcutInstance = new ShortcutClient(Storage.get("token"));
  }

  return shortcutInstance;
};
