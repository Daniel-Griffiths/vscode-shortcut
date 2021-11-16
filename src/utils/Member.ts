import { api } from "../api";
import { IMember, QuickPick } from "../interfaces";
import { Username } from "./Username";

export class Member {
  /**
   * Get a list of all active members
   *
   * @returns {Promise<IMember[]>}
   * @static
   */
  public static async getAll(): Promise<IMember[]> {
    const { data: members } = await api().listMembers({});
    const currentUsername = await Username.get();

    return (
      members
        .filter((member) => !member.disabled)
        // Make sure the users own name is at the top of the list
        .sort((a) => {
          return a.profile.mention_name === currentUsername ? -1 : 1;
        })
    );
  }

  /**
   * Convert `IMember[]` to `QuickPick<IMember>`
   *
   * @param {IMember[]} members
   * @returns {QuickPick<IMember>}
   * @static
   */
  public static toQuickPickItems(members: IMember[]): QuickPick<IMember> {
    return members.map((member) => {
      return {
        data: member,
        label: String(member.profile.name),
        description: String(member.profile.email_address),
      };
    });
  }
}
