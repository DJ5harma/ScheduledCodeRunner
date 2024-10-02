import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import USER from '../../../mongodb/models/USER.model.js';
import { json } from '@sveltejs/kit';
import { JWT_SECRET } from '$env/static/private';

export const POST = async (req) => {
	try {
		const body = await req.request.json();
		const { password, email } = body;

		const user = await USER.findOne({ email });
		if (!user) throw new Error('Email not registered');
		if (!bcrypt.compareSync(password, user.hashedPassword)) throw new Error('Incorrect password');

		const token = jwt.sign({ user_id: user._id }, JWT_SECRET);

		req.cookies.set('token', token, { path: '/', maxAge: 60 * 60 * 24 * 30 }); //month;

		return json({ user });
	} catch (error) {
		return json({
			error: (error as Error).message || 'Internal server error'
		});
	}
};

export const GET = async (req) => {
	try {
		const token = req.cookies.get('token');
		if (!token) throw new Error('No token');
		const { user_id } = jwt.verify(token, JWT_SECRET) as { user_id: string };
		if (!user_id) throw new Error('Invalid token');
		const user = await USER.findById(user_id);
		return json({ user });
	} catch (error) {
		return json({
			error: (error as Error).message || 'Internal server error'
		});
	}
};
