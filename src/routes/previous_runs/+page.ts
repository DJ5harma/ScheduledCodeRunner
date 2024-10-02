import { runsArray } from '../../stores';

export async function load(ev) {
	const response = await ev.fetch(`/api/previous_runs`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const result = await response.json();
	runsArray.update(() => result.runsArray);
}
