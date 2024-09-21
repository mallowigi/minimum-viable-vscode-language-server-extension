import * as fs from "node:fs";

const log = fs.createWriteStream("/tmp/lsp.json");

export default {
	write: (message: object | unknown) => {
		if (typeof message === "object") {
			log.write(`${JSON.stringify(message)}\n`);
		} else {
			log.write(`${message}\n`);
		}
	},
};
