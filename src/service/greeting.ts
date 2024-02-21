import { User } from '../entity/user';
import { UserRepository } from '../repository/user';
import { GreetingRepository } from '../repository/greeting';
import axios from 'axios';
import { GreetingStatus, GreetingType } from '../entity/greeting';
import { FindOptionsWhere } from 'typeorm';

const DEFAULT_SENDING_GREETING_HOUR = 13;

type CustomFindOptionsWhere<T> = FindOptionsWhere<T> & { where: any };

export class Greeting {
	protected userRepository: UserRepository;
	protected greetingRepository: GreetingRepository;

	constructor(
		userRepository: UserRepository,
		greetingRepository: GreetingRepository
	) {
		this.userRepository = userRepository;
		this.greetingRepository = greetingRepository;
	}

	public async birthdayEmail() {
		const sendBulkPromise = [];

		const users = await this.userRepository.getAll();

		for (let i = 0; i < users.length; i++) {
			const { userTimezoneDate, sendGreeting } = this._calculateUserTimeZone(
				users[i]
			);
			if (sendGreeting) {
				sendBulkPromise.push(this._sendMail(users[i], userTimezoneDate));
			}
		}

		// Execute promises in parallel
		try {
			const results = await Promise.all(sendBulkPromise);
			console.log('All promises resolved:', results);
		} catch (error) {
			console.error('At least one promise rejected:', error);
		}

		return await Promise.all(sendBulkPromise);
	}

	public async selfCheckPendingFailGreeting() {}

	private _calculateUserTimeZone(user: User): any {
		const now = new Date(); // Get the current date/time in local timezone
		const utc = now.getTime() + now.getTimezoneOffset() * 60000; // Convert to UTC

		// user current time
		const userTimezoneDate = new Date(
			utc - Number(user.tz_offset) * 60 * 60 * 1000
		);
		const userDate = userTimezoneDate.getDate();
		const userMonth = userTimezoneDate.getMonth();
		const userHour = userTimezoneDate.getHours();
		const userMinute = userTimezoneDate.getMinutes();
		const userBirthMonth = user.birthdate.getMonth();
		const userBirthDate = user.birthdate.getDate();

		// check if this current date = user birtday
		if (userMonth == userBirthMonth && userDate == userBirthDate) {
			// for tolerance 20 minute
			if (
				userHour == DEFAULT_SENDING_GREETING_HOUR &&
				userMinute >= 0 &&
				userMinute <= 59
			) {
				return {
					userTimezoneDate,
					sendGreeting: true,
				};
			} else {
				return {
					userTimezoneDate,
					sendGreeting: false,
				};
			}
		} else {
			return {
				userTimezoneDate,
				sendGreeting: false,
			};
		}
	}

	private async _sendMail(user: User, userTimezoneDate: Date) {
		let greeting = await this.greetingRepository.findOne({
			where: {
				user: {
					id: user.id,
				},
			},
		});

		if (!greeting) {
			greeting = await this.greetingRepository.save({
				user: user,
				year: userTimezoneDate.getFullYear(),
				status: GreetingStatus.PROGRESS,
				type: GreetingType.BIRTHDAY,
			});
		}

		// if it found greeting already sent success this year => skip
		// TODO: cover edge case during 31 December birthdate
		const currentYear = new Date().getFullYear();
		if (
			greeting &&
			greeting.year == currentYear &&
			greeting.status == GreetingStatus.SUCCESS
		) {
			return;
		}

		try {
			const result = await axios.post(
				'https://email-service.digitalenvision.com.au/send-email',
				{
					email: 'test@digitalenvision.com.au',
					message: `Hey, ${user.first_name} it's your birthday`,
				}
			);

			const greetingUpdated = await this.greetingRepository.update(
				{
					id: greeting.id,
				},
				{
					status: GreetingStatus.SUCCESS,
					raw_response: JSON.stringify(result.data),
				}
			);

			return greetingUpdated;
		} catch (error) {
			throw new Error(
				`Something unexpected happening. ${JSON.stringify(error)}`
			);
		}
	}
}
