import { json, type RequestHandler } from '@sveltejs/kit';
import runCode from '../run-code';
import RUN from '../../../../mongodb/models/RUN.model';
import extractForm from '../extract-form';
import extractExtension from '../extract-extension';

const mode = 'delay';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { description, file, language, title, error, time } = await extractForm(request, mode);
	if (error) return json({ error: error });

	try {
		const newRun = await RUN.create({
			title,
			description,
			mode,
			runner: locals.user_id,
			status: 'pending',
			extension: extractExtension(language!),
			time
			//output is null until executed
		});
		const run_id = newRun._id;

		setTimeout(async () => {
			const { error, output } = await runCode(language!, file!);
			const findRun = await RUN.findById(run_id);
			findRun.status = error ? 'error' : 'success';
			findRun.output = output || error;
			await findRun.save();
		}, time! - Date.now());

		return json({ run: newRun });
	} catch (err: unknown) {
		return json({ error: (err as Error).message });
	}
};
