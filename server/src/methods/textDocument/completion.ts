import { documents, type TextDocumentIdentifier } from "../../documents";
import log from "../../log";
import type { RequestMessage } from "../../types";
import * as fs from "node:fs";

export interface CompletionItem {
	label: string;
}

export interface CompletionList {
	isIncomplete: boolean;
	items: CompletionItem[];
}

export type Position = {
	line: number;
	character: number;
};

export interface TextDocumentPositionParams {
	textDocument: TextDocumentIdentifier;
	position: Position;
}

export interface CompletionParams extends TextDocumentPositionParams {}

// Load from MacOS dict
const words = fs
	.readFileSync("/usr/share/dict/words", "utf8")
	.toString()
	.split("\n");

export const completion = (message: RequestMessage): CompletionList => {
	const { position, textDocument } = message.params as CompletionParams;
	// Returns the last text before completion
	const content = documents.get(textDocument.uri);
	if (!content) {
		return {
			isIncomplete: false,
			items: [],
		};
	}

	const currentLine = content.split("\n")[position.line];
	const lineUntilCursor = currentLine.slice(0, position.character);
	// Now we are removing anything but the last word (cut at the cursor)
	const currentPrefix = lineUntilCursor.replace(/.*\W(\w+)$/, "$1");

	const items = words
		.filter((word) => word.startsWith(currentPrefix))
		.slice(0, 100)
		.map((label) => ({ label }));

	return {
		isIncomplete: true,
		items: items,
	};
};
