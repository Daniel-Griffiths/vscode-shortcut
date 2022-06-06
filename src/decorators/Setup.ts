import { commands } from 'vscode';
import { SettingKey } from '../enums/SettingKey';
import { Git } from '../utils/Git';
import { Setting } from '../utils/Settings';
import { Storage } from '../utils/Storage';
import { VSCode } from '../utils/VSCode';

/**
 * Make sure all the relevant options are set before running the command
 */
export function Setup() {
  return (target: any, key: string, descriptor: any) => {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = async function setup() {
      // Prompt the user to set the base branch if it's not set
      if (!Storage.currentProjectGet('defaultBranchName')) {
        await Git.setBaseBranch();
      }

      // The user was prompted but did not fill anything in
      if (!Storage.currentProjectGet('defaultBranchName')) {
        VSCode.alertWarning(
          'A base branch must be set before running this command'
        );
        return;
      }

      for (const settingKey of Object.values(SettingKey)) {
        if (!Setting.get(settingKey)) {
          VSCode.alertWarning(
            `Please set the "${settingKey}" option in the "shortcut" extension`
          );
          commands.executeCommand(
            'workbench.action.openSettings',
            '@ext:danielgriffiths.shortcut-com'
          );
          return;
        }
      }

      return originalMethod.apply(target);
    };

    return descriptor;
  };
}
