import mongoose, { Schema } from 'mongoose';

const RUN =
	mongoose.models.RUN ||
	mongoose.model(
		'RUN',
		new Schema(
			{
				title: {
					type: String,
					default: ''
				},
				description: {
					type: String,
					default: ''
				},
				runner: { type: Schema.Types.ObjectId, ref: 'USER', required: true },
				extension: {
					type: String,
					required: true,
					enum: ['java', 'cpp', 'py', 'js']
				},
				status: { type: String, enum: ['success', 'pending', 'running', 'error'] },
				output: { type: String },
				mode: { type: String, enum: ['everyday', 'delay', 'now'] },
				time: { type: Date, default: Date.now }
			},
			{ timestamps: true }
		)
	);
export default RUN;
