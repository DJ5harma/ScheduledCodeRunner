import type { Handle } from '@sveltejs/kit';
import dbConnect from './mongodb/db';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
export const handle: Handle = async ({ event, resolve }) => {
	await dbConnect();
	const currentPath = event.url.pathname;
	const allowedRoutes = ['/api/login', '/api/register', '/form'];
	if (allowedRoutes.includes(currentPath)) return resolve(event);

	const cookies = event.request.headers.get('cookie');
	const parsedCookies = cookies ? cookie.parse(cookies) : {};
	const token = parsedCookies.token;

	const redirectUrl = new URL('/form', event.request.url).href;

	if (!token) return Response.redirect(redirectUrl, 302);

	const { user_id } = jwt.verify(token, JWT_SECRET) as {
		user_id: string;
	};
	if (!user_id) return Response.redirect(redirectUrl, 302);

	const response = await resolve(event);
	return response;
};
