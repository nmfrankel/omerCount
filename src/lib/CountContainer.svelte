<script lang="ts">
	import {
		GeoLocation,
		Zmanim,
		HDate,
		HebrewCalendar,
		HebrewDateEvent,
		OmerEvent,
		Locale
	} from '@hebcal/core';
	import { onMount } from 'svelte';

	let dayEl: HTMLDivElement, leftEl: HTMLDivElement, rightEl: HTMLDivElement;

	function getTime(timestamp: Date) {
		// const gloc = new GeoLocation(null, options.latitude, options.longitude, options.elevation, options.tzid);
		// const zmanim = new Zmanim(gloc, options.date, false);
		// const shkiah = zmanim.shkiah()
		// const tzeit = zmanim.sunsetOffset(72)
		// console.log(shkiah, tzeit)
		/* tslint:disable-next-line */
		// const hebcalDay = new Hebcal.HDate(options.date)
		// hebcalDay.setLocation(options.latitude, options.longitude)
		// let { shkiah, tzeit } = hebcalDay.getZemanim()
		// let omerCount = hebcalDay.omer()
		// console.log(omerCount)
	}

	function setOmer() {
		let options = {
			// date: new Date('Jan 1 2024'),
			date: new Date(),
			tzid: 'America/New_York',
			locationName: 'Brooklyn - Mesivta Veretzky',
			latitude: 40.62,
			longitude: -73.957,
			elevation: 9
		};
		const today = new HDate(options.date);
		const todays_date = new HebrewDateEvent(today);
		const calendar_events = HebrewCalendar.calendar({
			omer: true,
			start: today,
			end: today
		});
		const omerDay: number | undefined = calendar_events[0]?.omer;

		// debugging
		// debugging
		console.log(calendar_events);
		globalThis.calendar_events = calendar_events;
		// debugging
		// debugging

		if (omerDay) {
			const omer = new OmerEvent(today, omerDay).getTodayIs('he');
			const middos = new OmerEvent(today, omerDay).sefira('he');

			dayEl.innerText = omer.replace(',', '\n');
			leftEl.innerText = Locale.hebrewStripNikkud(todays_date.renderBrief('he'));
			rightEl.innerText = Locale.hebrewStripNikkud(middos);
		} else {
			// add loading animation
			dayEl.innerText = 'Loading...';
			leftEl.innerHTML = '&nbsp;';
			rightEl.innerHTML = '&nbsp;';
		}
	}

	// check if it's time to change the display
	// if (hr == 7 && min == 30 && meridian == 'PM') clearOmer()
	// else if (hr == 8 && min == 44 && meridian == 'PM') updateOmer()

	onMount(() => setOmer());
</script>

<div class="container column">
	<div id="title">ספירת העומר</div>
	<div id="day" bind:this={dayEl}>&nbsp;</div>
	<div id="metadata" class="row">
		<div id="right" bind:this={rightEl}>&nbsp;</div>
		<div id="left" bind:this={leftEl}>&nbsp;</div>
	</div>
</div>

<style>
	.container {
		width: 75%;
		font-family: 'Calibri', 'david';
	}
	#title {
		margin-bottom: 2rem;
		font-size: 1.33rem;
		font-weight: 700;
		color: #051791;
	}
	#day {
		min-height: 2.6rem;
		min-width: 90%;
	}
	#metadata {
		height: unset;
		margin-top: 1.5rem;
		width: 80%;
		justify-content: space-between;
		font-size: 0.7rem;
		font-weight: 700;
		line-height: 1.75;
		letter-spacing: 1.3px;
	}
	#metadata div {
		width: fit-content;
		text-align: center;
	}
</style>
