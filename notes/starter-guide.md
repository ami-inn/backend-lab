# Node.js + TypeScript Starter Guide (Manual Setup)

This guide explains how to set up a production-ready Node.js + TypeScript service manually, without any scaffolding tool.

## 1) Create the project

Run:

		mkdir user-service
		cd user-service
		npm init -y

## 2) Install dependencies

Runtime dependency:

		npm install express

Development dependencies:

		npm install -D typescript @types/node @types/express tsx rimraf tsc-alias eslint@9 @eslint/js@9 typescript-eslint eslint-config-prettier prettier eslint-plugin-import eslint-import-resolver-typescript

If npm cache permission errors happen, use a local cache in the project:

		npm install express --cache .npm-cache
		npm install -D typescript @types/node @types/express tsx rimraf tsc-alias eslint@9 @eslint/js@9 typescript-eslint eslint-config-prettier prettier eslint-plugin-import eslint-import-resolver-typescript --cache .npm-cache

## 3) Create folder structure

Run:

		mkdir -p src/utils

## 4) Create tsconfig.json

Create tsconfig.json with:

		{
			"compilerOptions": {
				"ignoreDeprecations": "6.0",
				"target": "ES2020",
				"module": "CommonJS",
				"moduleResolution": "Node",
				"rootDir": "./src",
				"outDir": "./dist",
				"strict": true,
				"esModuleInterop": true,
				"skipLibCheck": true,
				"baseUrl": ".",
				"paths": {
					"@/*": ["src/*"]
				}
			},
			"include": ["src"]
		}

## 5) Create ESLint config

Create eslint.config.mjs with:

		import js from "@eslint/js";
		import importPlugin from "eslint-plugin-import";
		import tseslint from "typescript-eslint";

		export default tseslint.config(
			{ ignores: ["dist", "node_modules"] },
			js.configs.recommended,
			...tseslint.configs.recommended,
			{
				files: ["**/*.ts"],
				plugins: {
					import: importPlugin,
				},
				settings: {
					"import/resolver": {
						typescript: true,
					},
				},
				rules: {
					"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
					"import/order": [
						"warn",
						{
							"newlines-between": "always",
							alphabetize: { order: "asc", caseInsensitive: true },
							groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
						},
					],
				},
			},
			{
				rules: {
					"no-console": "off",
				},
			},
		);

## 6) Create Prettier config

Create .prettierrc with:

		{
			"semi": true,
			"singleQuote": false,
			"trailingComma": "all",
			"printWidth": 100
		}

Create .prettierignore with:

		dist
		node_modules

## 7) Create source files

Create src/utils/env.ts with:

		export const env = {
			port: Number(process.env.PORT ?? 3000),
		};

Create src/index.ts with:

		import express from "express";

		import { env } from "@/utils/env";

		const app = express();

		app.get("/", (_req, res) => {
			res.send("Hello Node + TypeScript");
		});

		app.listen(env.port, () => {
			console.log("Server running on http://localhost:" + env.port);
		});

## 8) Update package.json

Set scripts to:

		"scripts": {
			"dev": "tsx watch src/index.ts",
			"build": "rimraf dist && tsc && tsc-alias",
			"start": "node dist/index.js",
			"lint": "eslint .",
			"lint:fix": "eslint . --fix",
			"format": "prettier . --write",
			"format:check": "prettier . --check"
		}

Also set:

		"main": "dist/index.js"

## 9) Add .gitignore

Create .gitignore with:

		node_modules
		dist
		.npm-cache
		.env

## 10) Validate setup

Run:

		npm run lint
		npm run build

Start development server:

		npm run dev

## 11) Production run

Run:

		npm run build
		npm start

Server URL:

		http://localhost:3000
