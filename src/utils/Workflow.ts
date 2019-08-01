import { api } from "../api";
import { Storage } from "./Storage";

import { IWorkflow } from "../interfaces";
import { QuickPickItem } from "vscode";

export class Workflow {
  /**
   * Get a list of all the workflows.
   *
   * Worlflows are cached in local storage
   * as they they will not be changed very often
   * They will be updated on every second request.
   *
   * @returns {Promise<QuickPickItem[]>}
   * @static
   */
  public static get = async (): Promise<QuickPickItem[]> => {
    const token = Storage.get("token");

    if (!Storage.get<IWorkflow[]>("workflows")) {
      const { data } = await api.get(`workflows?token=${token}`);
      Storage.set<IWorkflow[]>("workflows", data);
    }

    // @todo don't assume the first item has the correct workflows
    return Storage.get<IWorkflow[]>("workflows")[0].states.map(workflow => {
      return {
        label: workflow.name,
        description: workflow.description,
      };
    });
  };
}
