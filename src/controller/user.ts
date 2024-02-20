import { timezoneGenerator } from '../middleware/timezone';
import { UserCreationSchema } from '../schema/user';
import { UserService } from '../service/user';

import { Request, Response, Router } from 'express';

import { ValidationResult } from 'joi';

export class UserController {
	protected userService: UserService;
	public router: Router;

	constructor(userService: UserService) {
		this.userService = userService;

		this.router = Router();
		this.router.post('/create', timezoneGenerator, this.create.bind(this));
		this.router.post('/delete', this.delete.bind(this));
	}

	async create(req: Request, res: Response) {
		const validatedUserCreation: ValidationResult = UserCreationSchema.validate(
			req.body
		);
		if (validatedUserCreation.error) {
			return res.status(404).send({
				message: 'Bad request',
				last_error: validatedUserCreation.error.details,
			});
		}

		const result = await this.userService.create({
			...validatedUserCreation.value,
			timeZoneName: req.timeZone.name,
			tzOffset: req.timeZone.offset,
		});
		return res.status(200).json(result);
	}

	async delete(req: Request, res: Response) {
		const result = await this.userService.delete({
			id: req.params.id,
		});
		return res.status(200).json(result);
	}
}
