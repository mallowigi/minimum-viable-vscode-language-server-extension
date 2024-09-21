export type Position = {
	line: number;
	character: number;
};

export type Range = {
	start: {
		line: number;
		character: number;
	};
	end: {
		line: number;
		character: number;
	};
};

interface Message {
	jsonrpc: string;
}

export interface NotificationMessage extends Message {
	method: string;
	params?: Array<unknown> | object;
}

export interface RequestMessage extends NotificationMessage {
	id: number | string;
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
