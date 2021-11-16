import { api } from "../api";
import { IProject, QuickPick } from "../interfaces";

export class Project {
  /**
   * Get a list of all active projects
   *
   * @returns {Promise<IProject[]>}
   * @static
   */
  public static async getAll(): Promise<IProject[]> {
    const { data: projects } = await api().listProjects({});

    return projects.filter((project) => !project.archived);
  }

  /**
   * Convert `IProject[]` to `QuickPick<IProject>`
   *
   * @param {IProject[]} projects
   * @returns {QuickPick<IProject>}
   * @static
   */
  public static toQuickPickItems(projects: IProject[]): QuickPick<IProject> {
    return projects.map((project) => {
      return {
        data: project,
        label: String(project.name),
        description: String(project.description),
      };
    });
  }
}
