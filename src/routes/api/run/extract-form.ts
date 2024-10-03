import type { ILanguage } from '$lib/types';

export default async function extractForm(request: Request) {
	const formData = await request.formData();

	const file = formData.get('file') as File;
	const language = formData.get('language') as ILanguage;
	if (!file) return { error: 'File not provided' };
	if (!language) return { error: 'Language not provided' };
	const title = formData.get('title') as string;
	const description = formData.get('description') as string;

	return { file, language, title, description, formData };
}
