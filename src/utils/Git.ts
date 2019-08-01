import { execute } from "./exec";

export class Git {
  public static getCurrentBranchName = async () => {
    return await execute([`git branch | grep \\* | cut -d ' ' -f2`]);
  };
}
