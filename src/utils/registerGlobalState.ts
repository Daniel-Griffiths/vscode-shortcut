import { Memento, ExtensionContext } from "vscode";

export let globalState: Memento;
export let globalContext: ExtensionContext;

/**
 * Add VSCode's context to the global state
 *
 * @param {ExtensionContext} context
 */
export function registerGlobalState(context: ExtensionContext) {
  globalContext = context;
  globalState = context.globalState;
}
