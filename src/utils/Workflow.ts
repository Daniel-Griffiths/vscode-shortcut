import {
  Workflow as IWorkflow,
  WorkflowState as IWorkflowState,
} from '@shortcut/client';

import { api } from '../api';
import { Storage } from './Storage';
import { QuickPick } from '../interfaces';

export class Workflow {
  /**
   * Get a list of all the workflows.
   *
   * Worlflows are cached in local storage
   * as they they will not be changed very often
   * They will be updated on every second request.
   *
   * @returns {Promise<QuickPick<IWorkflowState>>}
   * @static
   */
  public static async getAll(): Promise<QuickPick<IWorkflowState>> {
    const cachedWorkflows = Storage.get<IWorkflow[]>('workflows');

    const { data: workflows } = await api().listWorkflows();

    Storage.set<IWorkflow[]>('workflows', workflows);

    const [firstWorkflow] = cachedWorkflows || workflows;

    // @todo don't assume the first item has the correct workflows
    return firstWorkflow.states.map((workflow) => ({
      data: workflow,
      label: workflow.name,
      description: workflow.description,
    }));
  }
}
