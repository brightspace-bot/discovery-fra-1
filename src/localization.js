import { resolveUrl } from '@polymer/polymer/lib/utils/resolve-url.js';

const baseUrl = import.meta.url;
export async function getLocalizeResources(langs) {
	const imports = [];
	let supportedLanguage;
	for (const language of langs.reverse()) {
		if (['en', 'ar', 'de', 'es', 'fr', 'ja', 'ko', 'nl', 'pt', 'sv', 'tr', 'zh', 'zh-tw'].includes(language)) {
			supportedLanguage = language;
			const filePath = `./lang/${language}.js`;
			imports.push(import(resolveUrl(filePath, baseUrl)));
		}
	}

	const translationFiles = await Promise.all(imports);
	const langterms = {};
	for (const translationFile of translationFiles) {
		for (const langterm in translationFile.default) {
			langterms[langterm] = translationFile.default[langterm];
		}
	}

	return {
		language: supportedLanguage,
		resources: langterms
	};
}
