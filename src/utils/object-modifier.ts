export const removeUndefinedAndNull = (obj: object) => {
	const newObj = {};
	for (const key in obj) {
		if (obj[key] !== undefined && obj[key] !== null) {
			newObj[key] = obj[key];
		}
	}
	return newObj;
};
