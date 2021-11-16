import { VSCode } from "./VSCode";
import { Storage } from "./Storage";

export class Token {
  /**
   * Set the api token
   *
   * @returns {Promise<string | void>}
   */
  public static async set(): Promise<string | void> {
    const token = await VSCode.input({
      placeHolder: "Please enter your Shortcut api token",
    });

    if (!token) return;

    VSCode.alertInfo("The Shortcut api token has been set");

    return Storage.set("token", token);
  }
}
