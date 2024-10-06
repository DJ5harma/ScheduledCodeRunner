import { json, type RequestHandler } from '@sveltejs/kit';
import runCode from '../run-code';
import RUN from '../../../../mongodb/models/RUN.model';
import extractForm from '../extract-form';
import extractExtension from '../extract-extension';
import { schedule, validate } from 'node-cron';

const mode = 'cron';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { description, file, language, title, error, formData } = await extractForm(request);
	if (error) return json({ error: error });
	const cronStr = formData?.get('cronStr') as string;

	try {
		if (!validate(cronStr)) throw new Error('Invalid schedule inputs');
		const newRun = await RUN.create({
			title,
			description,
			mode,
			runner: locals.user_id,
			status: 'pending',
			extension: extractExtension(language!),
			time: cronStr
			//output is null until executed
		});
		const run_id = newRun._id;

		schedule(cronStr, async () => {
			const { error, output } = await runCode(language!, file!);
			const findRun = await RUN.findById(run_id);
			findRun.status = error ? 'error' : 'running';
			findRun.output = output || error;
			await findRun.save();
		});

		return json({ run: newRun });
	} catch (err: unknown) {
		return json({ error: (err as Error).message });
	}
};
