import mongoose, { Schema } from 'mongoose';

const USER =
	mongoose.models.USER ||
	mongoose.model(
		'USER',
		new Schema(
			{
				username: {
					type: String,
					required: [true, 'Username required']
				},
				hashedPassword: {
					type: String,
					required: [true, "<hashedPassword> didn't reach"]
				},
				email: {
					type: String,
					required: [true, 'Email required']
				}
			},
			{ timestamps: true }
		)
	);
export default USER;
