import { IUser, IUserQuickPick } from "../interfaces";

export class User {
  /**
   * Convert `IUser[]` to `IUserQuickPick[]`
   *
   * @param {IUser[]} users
   * @returns {IUserQuickPick[]}
   * @static
   */
  public static toQuickPickItems = (users: IUser[]): IUserQuickPick[] => {
    return users.map(user => {
      return {
        label: String(user.profile.mention_name),
        description: String(user.role),
        data: user,
      };
    });
  };
}
