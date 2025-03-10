import { testBlock } from "create-testers";
import { describe, expect, test } from "vitest";

import { blockPackageJson } from "./blockPackageJson.js";
import { optionsBase } from "./options.fakes.js";

describe("blockPackageJson", () => {
	test("without addons or mode", () => {
		const creation = testBlock(blockPackageJson, {
			options: optionsBase,
		});

		expect(creation).toMatchInlineSnapshot(`
			{
			  "files": {
			    "package.json": "{"name":"test-repository","version":"0.0.0","description":"Test description","repository":{"type":"git","url":"https://github.com/test-owner/test-repository"},"license":"MIT","author":{"email":"npm@email.com"},"type":"module","main":"./lib/index.js","files":["README.md","package.json"]}",
			  },
			  "scripts": [
			    {
			      "commands": [
			        "pnpm install",
			      ],
			      "phase": 1,
			    },
			  ],
			}
		`);
	});

	test("migration mode", () => {
		const creation = testBlock(blockPackageJson, {
			mode: "migrate",
			options: optionsBase,
		});

		expect(creation).toMatchInlineSnapshot(`
			{
			  "files": {
			    "package.json": "{"name":"test-repository","version":"0.0.0","description":"Test description","repository":{"type":"git","url":"https://github.com/test-owner/test-repository"},"license":"MIT","author":{"email":"npm@email.com"},"type":"module","main":"./lib/index.js","files":["README.md","package.json"]}",
			  },
			  "scripts": [
			    {
			      "commands": [
			        "pnpm install",
			      ],
			      "phase": 1,
			    },
			    {
			      "commands": [
			        "rm package-lock.json yarn.lock",
			      ],
			      "phase": 0,
			    },
			  ],
			}
		`);
	});

	test("with addons", () => {
		const creation = testBlock(blockPackageJson, {
			addons: {
				cleanupCommands: ["pnpm dedupe"],
				properties: {
					dependencies: {
						"is-odd": "1.2.3",
					},
					other: true,
				},
			},
			options: optionsBase,
		});

		expect(creation).toMatchInlineSnapshot(`
			{
			  "files": {
			    "package.json": "{"name":"test-repository","version":"0.0.0","description":"Test description","repository":{"type":"git","url":"https://github.com/test-owner/test-repository"},"license":"MIT","author":{"email":"npm@email.com"},"type":"module","main":"./lib/index.js","files":["README.md","package.json"],"dependencies":{"is-odd":"1.2.3"},"other":true}",
			  },
			  "scripts": [
			    {
			      "commands": [
			        "pnpm install",
			        "pnpm dedupe",
			      ],
			      "phase": 1,
			    },
			  ],
			}
		`);
	});

	test("with addons adding devDependencies", () => {
		const creation = testBlock(blockPackageJson, {
			addons: {
				cleanupCommands: ["pnpm dedupe"],
				properties: {
					dependencies: {
						"is-odd": "1.2.3",
					},
					devDependencies: {
						"is-even": "4.5.6",
					},
					other: true,
				},
			},
			options: optionsBase,
		});

		expect(creation).toMatchInlineSnapshot(`
			{
			  "files": {
			    "package.json": "{"name":"test-repository","version":"0.0.0","description":"Test description","repository":{"type":"git","url":"https://github.com/test-owner/test-repository"},"license":"MIT","author":{"email":"npm@email.com"},"type":"module","main":"./lib/index.js","files":["README.md","package.json"],"dependencies":{"is-odd":"1.2.3"},"devDependencies":{"is-even":"4.5.6"},"other":true}",
			  },
			  "scripts": [
			    {
			      "commands": [
			        "pnpm install",
			        "pnpm dedupe",
			      ],
			      "phase": 1,
			    },
			  ],
			}
		`);
	});
});
