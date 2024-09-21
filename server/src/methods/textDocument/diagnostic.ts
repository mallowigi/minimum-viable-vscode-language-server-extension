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

export const diagnostic = (
	message: RequestMessage,
): FullDocumentDiagnosticReport => {
	return {
		kind: DocumentDiagnosticReportKind.Full,
		items: [
			{
				severity: DiagnosticSeverity.Error,
				message: "This is an error",
				range: {
					start: {
						line: 0,
						character: 0,
					},
					end: {
						line: 0,
						character: 5,
					},
				},
			},
			{
				severity: DiagnosticSeverity.Warning,
				message: "This is a warning",
				range: {
					start: {
						line: 1,
						character: 0,
					},
					end: {
						line: 1,
						character: 5,
					},
				},
			},
		],
	};
};
