import {
	documents,
	type TextDocumentContentChangeEvent,
	type VersionedTextDocumentIdentifier,
} from "../../documents";
import log from "../../log";
import type { NotificationMessage } from "../../types";

export interface DidChangeTextDocumentParams {
	textDocument: VersionedTextDocumentIdentifier;
	contentChanges: TextDocumentContentChangeEvent[];
}

export const didChange = (message: NotificationMessage): void => {
	const { contentChanges, textDocument } =
		message.params as DidChangeTextDocumentParams;
	// For every change, keep the last change in the documents map for the given URI
	documents.set(textDocument.uri, contentChanges[0].text);
};
