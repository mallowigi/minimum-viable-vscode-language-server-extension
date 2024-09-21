import type { RequestMessage, ResponseMessage } from "../types";

interface ServerCapabilities {
	textDocumentSync?: number;
	completionProvider?: {
		resolveProvider?: boolean;
		triggerCharacters?: string[];
	};
}

interface InitializeResult {
	capabilities: ServerCapabilities;

	serverInfo?: {
		name: string;
		version?: string;
	};
}

export const initialize = (message: RequestMessage): InitializeResult => ({
	capabilities: {
		completionProvider: {},
		textDocumentSync: 1, // Always send the full document on change
	},
	serverInfo: {
		name: "lsp-from-scratch",
		version: "0.0.1",
	},
});
