import type { ILanguage } from '$lib/types';

export default function extractExtension(language: ILanguage) {
	switch (language) {
		case 'cpp':
			return 'cpp';
		case 'java':
			return 'java';
		case 'python':
			return 'py';
		case 'javascript':
			return 'js';
		default:
			break;
	}
}
