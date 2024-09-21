import type { RequestMessage, ResponseMessage } from "../types";

interface ServerCapabilities {
	textDocumentSync: number;
}

interface InitializeResult {
	capabilities: Record<string, unknown>;

	serverInfo?: {
		name: string;
		version?: string;
	};
}

export const initialize = (message: RequestMessage): InitializeResult => ({
	capabilities: {},
	serverInfo: {
		name: "lsp-from-scratch",
		version: "0.0.1",
	},
});
