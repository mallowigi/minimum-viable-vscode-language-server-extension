import { documents, type TextDocumentIdentifier } from "../../documents";
import log from "../../log";
import { getSpellingSuggestions } from "../../suggestions";
import type { Range, RequestMessage } from "../../types";

export enum DocumentDiagnosticReportKind {
	Full = "full",
}

export enum DiagnosticSeverity {
	Error = 1,
	Warning = 2,
	Information = 3,
	Hint = 4,
}

interface SpellingSuggestionData {
	invalidWord: string;
	wordSuggestions: string[];
	type?: "spelling-suggestion";
}

export interface Diagnostic {
	range: Range;
	severity?: DiagnosticSeverity;
	source?: "LSP Example";
	message: string;
	data: SpellingSuggestionData;
}

export interface FullDocumentDiagnosticReport {
	kind: DocumentDiagnosticReportKind.Full;
	resultId?: string;
	items: Diagnostic[];
}

export interface DocumentDiagnosticsParams {
	textDocument: TextDocumentIdentifier;
}

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

	// Get the invalid words and suggestions from aspell
	const invalidWordsAndSuggestions: Record<string, string[]> =
		getSpellingSuggestions(content);

	// Next we need to split the document into lines for the ranges
	const lines = content.split("\n");
	const items: Diagnostic[] = [];

	// Now we need to build the ranges
	for (const [word, suggestions] of Object.entries(
		invalidWordsAndSuggestions,
	)) {
		const errorMessage = suggestions.length
			? `Unknown word: ${word}. Did you mean: ${suggestions.join(", ")}?`
			: `Unknown word: ${word}`;

		lines.forEach((line, lineNumber) => {
			// Find all instances of the invalid word in the line
			const indexes = findAllIndexes(line, word);

			for (const match of indexes) {
				items.push({
					range: {
						start: { line: lineNumber, character: match },
						end: { line: lineNumber, character: match + word.length },
					},
					severity: DiagnosticSeverity.Error,
					message: errorMessage,
					data: {
						invalidWord: word,
						wordSuggestions: suggestions,
					},
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
