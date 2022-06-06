import { ShortcutClient } from '@useshortcut/client';

import { Setting } from './utils/Settings';

let shortcutInstance: ShortcutClient<unknown>;

export const api = () => {
  const token = Setting.get('token');

  if (!token) {
    throw new Error('Please set your shortcut token');
  }

  if (!shortcutInstance) {
    shortcutInstance = new ShortcutClient(token);
  }

  return shortcutInstance;
};
