import { UserService } from '../service/user';

import { Request, Response, Router } from 'express';

export class UserController {
	protected userService: UserService;
	public router: Router;

	constructor(userService: UserService) {
		this.userService = userService;

		this.router = Router();
		this.router.post('/create', this.create.bind(this));
		this.router.post('/delete', this.delete.bind(this));
	}

	async create(req: Request, res: Response) {
		const result = await this.userService.create({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			birthdate: req.body.birthdate,
			location: req.body.location,
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
