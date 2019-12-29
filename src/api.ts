import Clubhouse from "clubhouse-lib";

import { Storage } from "./utils/Storage";

let clubhouseInstance: Clubhouse<unknown, unknown>;

export const api = () => {
  if (!clubhouseInstance) {
    clubhouseInstance = Clubhouse.create(Storage.get("token"));
  }

  return clubhouseInstance;
};
