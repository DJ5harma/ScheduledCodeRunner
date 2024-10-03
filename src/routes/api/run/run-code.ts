import type { ILanguage } from '$lib/types';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import fs from 'fs';
import extractExtension from './extract-extension';

const execPromise = promisify(exec);
const tmpDir = path.join(process.cwd(), 'tmp');

export default async function runCode(language: ILanguage, file: File) {
	if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
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
		case 'javascript': {
			command = `node ${tempFilePath}`;
			break;
		}
		case 'java':
			{
				const javaFileName = path.basename(tempFilePath, '.java');
				outputFilePath = tempFilePath.slice(0, tempFilePath.length - 5) + '.class';
				command = `javac ${tempFilePath} && java -cp ${tmpDir} ${javaFileName}`;
			}
			break;
	}
	const { stdout: output, stderr: error } = await execPromise(command);
	fs.unlinkSync(tempFilePath);

	if (outputFilePath && fs.existsSync(outputFilePath)) fs.unlinkSync(outputFilePath);

	return { extension: extractExtension(language), output, error };
}
