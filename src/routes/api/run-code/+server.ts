import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

const execPromise = promisify(exec);

const tmpDir = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file') as File;
	const language = formData.get('language') as string;

	if (!file) return json({ error: 'File not provided' });
	if (!language) return json({ error: 'Language not provided' });

	const tempFilePath = path.join(tmpDir, file.name);
	const fileContent = Buffer.from(await file.arrayBuffer());
	fs.writeFileSync(tempFilePath, fileContent);

	let command = '';
	let outputFilePath = '';

	switch (language) {
		case 'cpp': {
			outputFilePath = path.join(tmpDir, 'output.exe');
			command = `g++ ${tempFilePath} -o ${outputFilePath} && ${outputFilePath}`;
			break;
		}
		case 'python':
			command = `python ${tempFilePath}`;
			break;
		case 'javascript':
			command = `node ${tempFilePath}`;
			break;
		case 'java':
			{
				const javaFileName = path.basename(tempFilePath, '.java');
				outputFilePath = tempFilePath.slice(0, tempFilePath.length - 5) + '.class';
				command = `javac ${tempFilePath} && java -cp ${tmpDir} ${javaFileName}`;
			}
			break;
		default:
			throw new Error('Invalid language selected');
	}

	try {
		const { stdout: output, stderr: error } = await execPromise(command);
		return json({ output, error });
	} catch (err: unknown) {
		return json({ error: (err as Error).message });
	} finally {
		fs.unlinkSync(tempFilePath);
		if (outputFilePath && fs.existsSync(outputFilePath)) {
			fs.unlinkSync(outputFilePath);
			outputFilePath = '';
		}
	}
};
