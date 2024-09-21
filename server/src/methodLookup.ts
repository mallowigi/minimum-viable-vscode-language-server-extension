import { initialize } from "./methods/initialize";
import { codeAction } from "./methods/textDocument/codeAction";
import { completion } from "./methods/textDocument/completion";
import { diagnostic } from "./methods/textDocument/diagnostic";
import { didChange } from "./methods/textDocument/didChange";
import type { RequestMessage } from "./types";

export type RequestMethod = (
	message: RequestMessage,
) =>
	| ReturnType<typeof initialize>
	| ReturnType<typeof completion>
	| ReturnType<typeof diagnostic>
	| ReturnType<typeof codeAction>;

export type NotificationMethod = (message: RequestMessage) => void;

export const methodLookup: Record<string, RequestMethod | NotificationMethod> =
	{
		initialize: initialize,
		"textDocument/completion": completion,
		"textDocument/didChange": didChange,
		"textDocument/diagnostic": diagnostic,
		"textDocument/codeAction": codeAction,
	};
