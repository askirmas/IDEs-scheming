import { iTask } from "../defs";
export { vscodeTasks };
declare function vscodeTasks(cwd?: string): Promise<iTask[]>;
