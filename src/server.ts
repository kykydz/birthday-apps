declare global {
	namespace Express {
		interface Request {
			timeZone?: {
				name: String;
				offset: Number;
			};
		}
	}
}

import { createApp } from './app';
import { SERVER_PORT, ENV } from './config/environment';
import { Logger } from '../src/utils/logger';

(async () => {
	const logger = new Logger(ENV);

	const app = await createApp();

	const server = app.listen(SERVER_PORT);

	logger.info(`Server is start listening at port: ${SERVER_PORT}`, {});

	return server;
})();
