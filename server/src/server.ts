import log from "./log";
import { methodLookup } from "./methodLookup";
import type { RequestMessage } from "./types";

let buffer = "";

const respond = (id: RequestMessage["id"], result: object | null) => {
	// Build a message according to jsonrpc, e.g. Content-length followed by the message as JSON
	const message = JSON.stringify({ id, result }, null, 2);
	const messageLength = Buffer.byteLength(message, "utf8");
	const header = `Content-Length: ${messageLength}\r\n\r\n`;

	// log.write(header + message);
	process.stdout.write(header + message);
};

process.stdin.on("data", (chunk) => {
	buffer += chunk;

	// We listen to the flow of data coming from the client, which is a chunk so there is no guarantee that the data will be complete.
	while (true) {
		// First, check for the content-length header
		const lengthMatch = buffer.match(/Content-Length: (\d+)\r\n/);
		// If no match, break the loop because it means we're not done yet
		if (!lengthMatch) break;

		const contentLength = Number.parseInt(lengthMatch[1], 10);
		// Skip the header by reading two lines
		const messageStart = buffer.indexOf("\r\n\r\n") + 4;

		// Continue buffering until the full message is in the buffer
		if (buffer.length < messageStart + contentLength) break;

		// Extract the message from the buffer
		const rawMessage = buffer.slice(messageStart, messageStart + contentLength);
		const message = JSON.parse(rawMessage) as RequestMessage;

		// Log the message
		log.write({
			id: message.id,
			message: message.method,
			params: message.params,
		});

		// Respond to the message
		const method = methodLookup[message.method];
		if (method) {
			// We don't want to respond in case of notifications (void)
			const result = method(message);
			if (result !== undefined) {
				respond(message.id, result);
			}
		}

		// Remove the message from the buffer
		buffer = buffer.slice(messageStart + contentLength);
	}
});
