import { User } from '../entity/user';
import { UserRepository } from '../repository/user';
import { GreetingRepository } from '../repository/greeting';
import axios from 'axios';
import { GreetingStatus, GreetingType } from '../entity/greeting';

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

	async birthdayEmail() {
		const sendBulkPromise = [];

		const users = await this.userRepository.getAll();

		for (let i = 0; i < users.length; i++) {
			if (this._isSendBirthday(users[i])) {
				sendBulkPromise.push(this._sendMail(users[i]));
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

	_isSendBirthday(user: User): Boolean {
		const now = new Date(); // Get the current date/time in local timezone
		const utc = now.getTime() + now.getTimezoneOffset() * 60000; // Convert to UTC

		// user current time
		const userTimezoneDate = new Date(utc - Number(user.tz_offset) * 60 * 60 * 1000);
		const userDate = userTimezoneDate.getDate();
		const userMonth = userTimezoneDate.getMonth();
		const userHour = userTimezoneDate.getHours();
		const userMinute = userTimezoneDate.getMinutes();
		const userBirthMonth = user.birthdate.getMonth();
		const userBirthDate = user.birthdate.getDate();

		// check if this current date = user birtday
		if (userMonth == userBirthMonth && userDate == userBirthDate) {
			// for tolerance 2 minute
			if (userHour == 10 && userMinute >= 0 && userMinute <= 20) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	_formatDate(date: Date) {
		// Get current date
		const currentDate = new Date(date);

		// Get day, month, and year components
		const day = currentDate.getDate().toString().padStart(2, '0'); // Ensure two digits with leading zero if necessary
		const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
		const year = currentDate.getFullYear();

		// Format the date as "dd-mm-yyyy"
		const formattedDate = `${year}-${month}-${day}`;

		return formattedDate;
	}

	async _sendMail(user: User) {
		const greeting = await this.greetingRepository.save({
			user: user,
			greetingDate: user.birthdate,
			status: GreetingStatus.PROGRESS,
			type: GreetingType.BIRTHDAY
		});

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
