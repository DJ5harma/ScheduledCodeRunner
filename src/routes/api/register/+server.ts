import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import USER from '../../../mongodb/models/USER.model';
import { json } from '@sveltejs/kit';
import { JWT_SECRET } from '$env/static/private';

export const POST = async (req) => {
	try {
		const body = await req.request.json();

		const { username, password, email } = body;
		if (password.length < 6) throw new Error('Password too short');

		if (await USER.exists({ email })) throw new Error('Email already registered');

		const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		const user = new USER({
			username,
			hashedPassword,
			email
		});
		const token = jwt.sign({ user_id: user._id }, JWT_SECRET);
		req.cookies.set('token', token, { path: '/', maxAge: 60 * 60 * 24 * 30 }); //month
		await user.save();
		return json({
			user: { _id: user._id, username, email }
		});
	} catch (error) {
		return json({
			error: (error as Error).message || 'Internal server error'
		});
	}
};
