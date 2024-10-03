import { json } from '@sveltejs/kit';
import RUN from '../../../mongodb/models/RUN.model';

export const GET = async (ev) => {
	try {
		const runsArray = (await RUN.find({ runner: ev.locals.user_id })).reverse();
		return json({ runsArray });
	} catch (error) {
		return json({
			error: (error as Error).message || 'Internal server error'
		});
	}
};
