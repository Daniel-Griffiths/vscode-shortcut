import { create } from "clubhouse-lib";
import { Storage } from "./utils/Storage";

export const api = () => create(Storage.get("token"));
