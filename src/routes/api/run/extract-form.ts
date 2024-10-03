import type { ILanguage } from '$lib/types';

export default async function extractForm(request: Request, mode: 'everyday' | 'now' | 'delay') {
	const formData = await request.formData();

	const file = formData.get('file') as File;
	const language = formData.get('language') as ILanguage;
	if (!file) return { error: 'File not provided' };
	if (!language) return { error: 'Language not provided' };
	const title = formData.get('title') as string;
	const description = formData.get('description') as string;

	let time: number | null = null;
	switch (mode) {
		case 'now':
			time = Date.now();
			break;
		case 'delay': {
			const delay = parseInt(formData.get('delay') as string);
			time = Date.now() + delay;
			break;
		}
		case 'everyday': {
			const everydayTime = formData.get('everydayTime') as string;
			console.log({ everydayTime });
		}
	}
	console.log({ file, language, title, description, time });

	return { file, language, title, description, time };
}
