export type DocumentUri = string;
export type DocumentBody = string;

export interface TextDocumentIdentifier {
	uri: DocumentUri;
}

export interface VersionedTextDocumentIdentifier
	extends TextDocumentIdentifier {
	version: number;
}

export interface TextDocumentContentChangeEvent {
	range?: {
		start: {
			line: number;
			character: number;
		};
		end: {
			line: number;
			character: number;
		};
	};
	rangeLength?: number;
	text: string;
}

export const documents = new Map<DocumentUri, DocumentBody>();
