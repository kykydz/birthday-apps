import { NextFunction, Request, Response } from 'express';

import { lookup } from 'geoip-lite';
import { find } from 'geo-tz';
import { findTimeZone, getUTCOffset, getZonedTime } from 'timezone-support';

const DEFAULT_TIMEZONE = 'Asia/Jakarta';

export const timezoneGenerator = async (
	req: Request,
	_: Response,
	next: NextFunction
) => {
	const ip = '180.254.85.180' || req.ip;
	const geo = lookup(ip);

	if (geo && geo.ll) {
		const [latitude, longitude] = geo.ll;
		const tz = find(latitude, longitude);
		const timeZoneName = tz[0] ? tz[0] : DEFAULT_TIMEZONE;

		const timezoneInfo = findTimeZone(timeZoneName);
		const tzOffset = getUTCOffset(new Date(), timezoneInfo);
		const tzOffsetHours = tzOffset.offset / 60;

		req.timeZone = {
			name: timeZoneName,
			offset: tzOffsetHours,
		};
	}

	next();
};
