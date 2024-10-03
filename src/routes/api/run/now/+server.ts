import { json, type RequestHandler } from '@sveltejs/kit';
import runCode from '../run-code';
import RUN from '../../../../mongodb/models/RUN.model';
import extractForm from '../extract-form';

const mode = 'now';
export const POST: RequestHandler = async ({ request, locals }) => {
	const { description, file, language, title, error, time } = await extractForm(request, mode);
	if (error) return json({ error: error });

	try {
		const { error, extension, output } = await runCode(language!, file!);

		const newRun = await RUN.create({
			title,
			description,
			mode,
			runner: locals.user_id,
			status: error ? 'error' : 'success',
			output: error || output,
			extension,
			time
		});
		return json({ run: newRun });
	} catch (err: unknown) {
		return json({ error: (err as Error).message });
	}
};
