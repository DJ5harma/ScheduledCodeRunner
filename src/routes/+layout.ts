import { user } from '../stores.js';

export async function load(ev) {
	const response = await ev.fetch(`/api/login`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const result = await response.json();
	user.update(() => result.user);
}
