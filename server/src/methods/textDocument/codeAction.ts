import type { DocumentUri, TextDocumentIdentifier } from "../../documents";
import type { Range, RequestMessage } from "../../types";
import type { Diagnostic } from "./diagnostic";

enum CodeActionKind {
	Empty = "",
	QuickFix = "quickfix",
	Refactor = "refactor",
}

interface TextEdit {
	range: Range;
	newText: string;
}

export interface WorkspaceEdit {
	changes?: Record<DocumentUri, TextEdit[]>;
}

export interface CodeAction {
	title: string;
	kind: CodeActionKind;
	edit?: WorkspaceEdit;
	data?: unknown;
}

export interface CodeActionParams {
	textDocument: TextDocumentIdentifier;
	range: Range;
	context: {
		diagnostics: Diagnostic[];
	};
}

export const codeAction = (message: RequestMessage): CodeAction[] | null => {
	const params = message.params as CodeActionParams;
	const diagnostics = params.context.diagnostics;

	// Create range for diagnostics
	return diagnostics.flatMap((diagnostic): CodeAction[] => {
		return diagnostic.data.wordSuggestions.map((wordSuggestion) => {
			// Create a code action for each suggestion
			const codeAction: CodeAction = {
				title: `Replace me with ${wordSuggestion}`,
				kind: CodeActionKind.QuickFix,
				edit: {
					changes: {
						[params.textDocument.uri]: [
							{
								range: diagnostic.range,
								newText: wordSuggestion,
							},
						],
					},
				},
			};

			return codeAction;
		});
	});
};
