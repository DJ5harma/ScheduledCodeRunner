import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import RUN from '../../../mongodb/models/RUN.model';
import dbConnect from '../../../mongodb/db';

const execPromise = promisify(exec);
const availableModes = ['everyday', 'delay', 'now'];

const tmpDir = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

export const POST: RequestHandler = async ({ request, locals }) => {
	const formData = await request.formData();
	const file = formData.get('file') as File;
	const language = formData.get('language') as string;
	const mode = formData.get('mode') as string;
	const title = formData.get('title') as string;
	const description = formData.get('description') as string;

	if (!file) return json({ error: 'File not provided' });
	if (!language) return json({ error: 'Language not provided' });

	const tempFilePath = path.join(tmpDir, file.name);
	const fileContent = Buffer.from(await file.arrayBuffer());
	fs.writeFileSync(tempFilePath, fileContent);

	let command = '';
	let outputFilePath = '';
	let extension = '';
	if (!availableModes.includes(mode)) return json({ error: 'Invalid mode' });

	switch (language) {
		case 'cpp': {
			outputFilePath = path.join(tmpDir, 'output.exe');
			command = `g++ ${tempFilePath} -o ${outputFilePath} && ${outputFilePath}`;
			extension = 'cpp';
			break;
		}
		case 'python':
			{
				command = `python ${tempFilePath}`;
				extension = 'py';
			}
			break;
		case 'javascript': {
			command = `node ${tempFilePath}`;
			extension = 'js';
			break;
		}
		case 'java':
			{
				const javaFileName = path.basename(tempFilePath, '.java');
				outputFilePath = tempFilePath.slice(0, tempFilePath.length - 5) + '.class';
				command = `javac ${tempFilePath} && java -cp ${tmpDir} ${javaFileName}`;
				extension = 'java';
			}
			break;
		default:
			throw new Error('Invalid language selected');
	}
	try {
		console.log({ mode, extension });
		if (mode === 'now') {
			const { stdout: output, stderr: error } = await execPromise(command);
			const status = error ? 'error' : 'success';
			console.log({ output, error });

			await dbConnect();
			const newRun = await RUN.create({
				title,
				description,
				mode,
				runner: locals.user_id,
				status,
				output: error || output || 'waiting',
				extension
			});
			console.log({ newRun });
			return json({ run: newRun });
		}
		return json({});
	} catch (err: unknown) {
		return json({ error: (err as Error).message });
	} finally {
		fs.unlinkSync(tempFilePath);
		if (outputFilePath && fs.existsSync(outputFilePath)) {
			fs.unlinkSync(outputFilePath);
			outputFilePath = '';
			extension = '';
		}
	}
};
