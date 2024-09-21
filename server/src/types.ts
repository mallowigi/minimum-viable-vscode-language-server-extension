interface Message {
	jsonrpc: string;
}

export interface RequestMessage extends Message {
	id: number | string;

	method: string;

	params?: Array<unknown> | object;
}

export interface ResponseMessage extends Message {
	id: number | string;

	result?: unknown;

	error?: {
		code: number;
		message: string;
		data?: unknown;
	};
}

export type RequestMethod = (message: RequestMessage) => unknown;
