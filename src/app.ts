import { UserController } from './controller/user';
import 'reflect-metadata';

import express, { Request, Response, Router } from 'express';
import bodyParser from 'body-parser';
import { UserRepository } from './repository/user';
import { UserService } from './service/user';
import { requestLogger } from './middleware/logger';
import { AppDataSource } from './config/orm/typorm';
import { Logger } from './utils/logger';
import { ENV } from './config/environment';
import { HealthCheckController } from './controller/healthcheck';

const logger = new Logger(ENV);

const setupRoutes = async (app: any) => {
	// init DataSource
	const appDatasource = await new AppDataSource(logger).initDatasource();
	const userRepository = new UserRepository(appDatasource, logger);

	const userService = new UserService(userRepository);

	const healthCheckController = new HealthCheckController();
	const userController = new UserController(userService);

	app.use(requestLogger);

	app.use('/healthcheck', healthCheckController.router);
	app.use('/api/user', userController.router);

	app.use('*', (_: Request, res: Response) => {
		res.status(401).send('Unauthorized');
	});
};

export const createApp = async () => {
	const app = express();
	const router = express.Router();

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.use('/test', (req, res) => {
		console.log(req.body); // Log the request body
		res.send(req.body);
	});

	await setupRoutes(app);

	return app;
};
