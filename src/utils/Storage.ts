import { globalState } from "./registerGlobalState";

export class Storage {
  /**
   * Get an item from local storage
   *
   * @param   {string} key
   * @returns {T}
   * @static
   */
  public static get = <T>(key: string): T => {
    return globalState.get(key) as T;
  };

  /**
   * Set an item from local storage
   *
   * @param   {string} key
   * @param   {T} value
   * @returns {T}
   * @static
   */
  public static set = <T>(key: string, value: T): T => {
    globalState.update(key, value);
    return value;
  };
}
