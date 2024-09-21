import { initialize } from "./methods/initialize";
import type { RequestMessage, RequestMethod } from "./types";

export const methodLookup: Record<string, RequestMethod> = {
	initialize,
};
