import Joi from 'joi';

export const UserCreationSchema = Joi.object({
	firstName: Joi.string().alphanum().min(3).max(30).required(),

	lastName: Joi.string().alphanum().min(3).max(30).required(),

	birthdate: Joi.string().isoDate().options({
		convert: true,
	}),

	location: Joi.string(),
});
