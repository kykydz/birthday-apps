import { User } from '../entity/user';
import { UserRepository } from '../repository/user';
import { GreetingRepository } from '../repository/greeting';
import axios from 'axios';
import { GreetingStatus } from '../entity/greeting';

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
		// const utc = now.getTime() + now.getTimezoneOffset() * 60000; // Convert to UTC

		// Create a new Date object with the timezone offset of the target timezone
		// const dateInTimeZone = new Date(utc - 3600000 * Number(user.tz_offset));
		// const hour = dateInTimeZone.getHours();
		// const minute = dateInTimeZone.getMinutes();

		// user date
		const hoursToAdd = user.tz_offset;
		// const userNowDate = now;
		// userNowDate.setHours(user.birthdate.getHours() + Number(hoursToAdd));
		// const userHour = userNowDate.getHours();
		// const userMinute = userNowDate.getMinutes();

		const timeZoneOffset = Number(hoursToAdd) * 3600 * 1000;

		// Adjust date by adding timezone offset
		const dateInTimeZone = new Date(now.getTime() + timeZoneOffset);

		// check if this current date
		// if (this._formatDate(now) == this._formatDate(userNowDate)) {
		// 	// for tolerance 2 minute
		// 	if (userHour === 9 && userMinute >= 0 && userMinute <= 2) {
		// 		return true;
		// 	} else {
		// 		return false;
		// 	}
		// }
		console.log('');
		return true;
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
