import Client, { create } from "clubhouse-lib";

import { Storage } from "./utils/Storage";

let clubhouseInstance: Client;

export const api = () => {
  if (!clubhouseInstance) {
    clubhouseInstance = create(Storage.get("token"));
  }

  return clubhouseInstance;
};
