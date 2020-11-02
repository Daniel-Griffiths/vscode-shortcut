import { VSCode } from "./VSCode";
import { Storage } from "./Storage";

export class Token {
  /**
   * Set the clubhouse api token
   *
   * @returns {Promise<string | void>}
   */
  public static async set(): Promise<string | void> {
    const token = await VSCode.input({
      placeHolder: "Please enter your clubhouse api token",
    });

    if (!token) return;

    VSCode.alertInfo("The Clubhouse api token has been set");

    return Storage.set("token", token);
  }
}
