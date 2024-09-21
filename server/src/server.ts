import log from "./log";

interface Message {
	jsonrpc: string;
}

interface RequestMessage extends Message {
	id: number | string;

	method: string;

	params?: Array<unknown> | object;
}

process.stdin.on("data", (chunk) => {
	log.write(chunk.toString());
});
