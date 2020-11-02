import { Workflow as IWorkflow } from "clubhouse-lib";

import { api } from "../api";
import { Storage } from "./Storage";
import { ISearchWorkflowQuickPick } from "../interfaces";

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
  public static async get(): Promise<ISearchWorkflowQuickPick[]> {
    if (!Storage.get<IWorkflow[]>("workflows")) {
      const workflows = await api().listWorkflows();
      Storage.set<IWorkflow[]>("workflows", workflows);
    }

    // @todo don't assume the first item has the correct workflows
    return Storage.get<IWorkflow[]>("workflows")[0].states.map((workflow) => {
      return {
        data: workflow,
        label: workflow.name,
        description: workflow.description,
      };
    });
  }
}
