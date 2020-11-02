import { api } from "../api";
import { Storage } from "./Storage";

export class Username {
  public static async set() {
    const user = await api().getCurrentMember();

    const username = user.mention_name;

    return Storage.set("username", username);
  }

  public static async get(): Promise<string> {
    return await Storage.get<string>("username");
  }
}
