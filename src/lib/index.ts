import { GeoLocation, Zmanim } from '@hebcal/core';

export let options = {
	// date: new Date('May 8 2024'),
	// date: new Date('April 15 2024'),
	// date: new Date('May 10 2024 20:30'),
	date: new Date(),
	name: 'Brooklyn - Mesivta Veretzky',
	latitude: 40.62,
	longitude: -73.957,
	elevation: 9,
	tzid: 'America/New_York'
};

export function tzeisOffset() {
	// refresh date
	options.date = new Date();

	const gloc = new GeoLocation(
		null,
		options.latitude,
		options.longitude,
		options.elevation,
		options.tzid
	);
	const zmanim = new Zmanim(gloc, options.date, false);
	const shkiah = zmanim.shkiah();
	const tzeis = zmanim.sunsetOffset(72);

	if (options.date < shkiah) {
		return 0;
	} else if (options.date > tzeis) {
		return 1;
	} else {
		return -1;
	}

	// if (options.date >= shkiah && options.date <= tzeis) {
	// 	return true;
	// } else {
	// 	return false;
	// }
}
