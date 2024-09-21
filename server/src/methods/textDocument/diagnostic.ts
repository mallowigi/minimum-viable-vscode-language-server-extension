import { documents, type TextDocumentIdentifier } from "../../documents";
import type { Range, RequestMessage } from "../../types";
import * as fs from "node:fs";

export enum DocumentDiagnosticReportKind {
	Full = "full",
}

export enum DiagnosticSeverity {
	Error = 1,
	Warning = 2,
	Information = 3,
	Hint = 4,
}

export interface Diagnostic {
	range: Range;
	severity?: DiagnosticSeverity;
	source?: "LSP Example";
	message: string;
	data?: unknown;
}

export interface FullDocumentDiagnosticReport {
	kind: DocumentDiagnosticReportKind.Full;
	resultId?: string;
	items: Diagnostic[];
}

export interface DocumentDiagnosticsParams {
	textDocument: TextDocumentIdentifier;
}

const dictionary = fs
	.readFileSync("/usr/share/dict/words", "utf8")
	.toString()
	.split("\n");

export const diagnostic = (
	message: RequestMessage,
): FullDocumentDiagnosticReport => {
	const { textDocument } = message.params as DocumentDiagnosticsParams;
	const content = documents.get(textDocument.uri);
	if (!content) {
		return {
			kind: DocumentDiagnosticReportKind.Full,
			items: [],
		};
	}

	// Find all words that are not found in the dict
	const wordsInDocument = content.split(/\s+/);
	const invalidWords = new Set(
		wordsInDocument.filter((word) => !dictionary.includes(word)),
	);

	// Next we need to split the document into lines for the ranges
	const lines = content.split("\n");
	const regex = /\b\w+\b/g;

	const items: Diagnostic[] = [];

	// Now we need to build the ranges
	for (const word of invalidWords) {
		lines.forEach((line, lineNumber) => {
			const indexes = findAllIndexes(line, word);

			for (const match of indexes) {
				items.push({
					range: {
						start: { line: lineNumber, character: match },
						end: { line: lineNumber, character: match + word.length },
					},
					severity: DiagnosticSeverity.Error,
					message: `Unknown word: ${word}`,
				});
			}
		});
	}

	return {
		kind: DocumentDiagnosticReportKind.Full,
		items,
	};
};

function findAllIndexes(str: string, word: string) {
	const indexes = [];
	let i = str.indexOf(word);
	while (i !== -1) {
		indexes.push(i);
		i = str.indexOf(word, i + 1);
	}
	return indexes;
}
