import { spawnSync } from "node:child_process";
import log from "./log";

export const getSpellingSuggestions = (
	content: string,
): Record<string, string[]> => {
	const invalidWordsAndSuggestions: Record<string, string[]> = {};

	// Use aspell to get suggestions
	const allOutput = spawnSync("aspell", ["pipe"], {
		input: content,
		encoding: "utf8",
	})
		.stdout.trim()
		.split("\n");

	// Now we need to filter to get only the invalid words
	for (const line of allOutput) {
		const type = line.slice(0, 1);
		switch (type) {
			case "&": {
				const { suggestions, word } = handleGoodSuggestion(line);
				invalidWordsAndSuggestions[word] = suggestions;
				break;
			}
			case "#": {
				const { word } = handleBadSuggestion(line);
				invalidWordsAndSuggestions[word] = [];
				break;
			}
		}
	}

	return invalidWordsAndSuggestions;
};

const handleGoodSuggestion = (line: string) => {
	// Example: & word <numSuggestions> *: suggestion1, suggestion2
	const [key, rest] = line.split(":");
	const [, word] = key.split(" ");
	const suggestions = rest.split(",").map((suggestion) => suggestion.trim());

	return {
		word: word.trim(),
		suggestions,
	};
};

const handleBadSuggestion = (line: string) => {
	// Example: # word
	const [, word] = line.split(" ");
	return {
		word: word.trim(),
	};
};
