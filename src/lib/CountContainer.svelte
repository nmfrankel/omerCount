<script lang="ts">
	import { options, tzeisOffset } from '$lib/index';
	import { HDate, HebrewCalendar, HebrewDateEvent, OmerEvent, Locale } from '@hebcal/core';
	import { onMount } from 'svelte';

	let dayEl: HTMLDivElement, dateEl: HTMLDivElement, middosEl: HTMLDivElement;
	let isLoading = true;

	function setOmer() {
		const today = new HDate(options.date);
		const todays_date = new HebrewDateEvent(today);
		const calendar_events = HebrewCalendar.calendar({
			omer: true,
			start: today,
			end: today
		});

		let display_date = todays_date.renderBrief('he');
		let omerDay: number | undefined;

		// handle multiple calendar_events
		for (const event of calendar_events) {
			if (event.getCategories()[0] === 'roshchodesh') {
				display_date += `, ${event.renderBrief('he')}`;
			} else if (event.getCategories()[0] === 'omer') {
				// @ts-ignore: Prperty missing on Event type
				omerDay = event.omer;
			}
		}

		// whether past tzeis to show tomorrow's count or during shkiah and none at all
		const shkiahIndex = tzeisOffset();

		if (!omerDay || omerDay + shkiahIndex >= 50) {
			dayEl.innerText = '[No count today]';
			dateEl.innerHTML = '&nbsp;';
			middosEl.innerHTML = '&nbsp;';
			isLoading = false;
		} else if (shkiahIndex === -1) {
			dayEl.innerHTML = '&nbsp;';
			dateEl.innerHTML = '&nbsp;';
			middosEl.innerHTML = '&nbsp;';
			isLoading = true;
		} else {
			const omer = new OmerEvent(today, omerDay + shkiahIndex).getTodayIs('he');
			const middos = new OmerEvent(today, omerDay + shkiahIndex).sefira('he');

			dayEl.innerText = omer.replace(',', '\n');
			dateEl.innerText = Locale.hebrewStripNikkud(display_date);
			middosEl.innerText = Locale.hebrewStripNikkud(middos);
			isLoading = false;
		}

		// Update every minute
		setTimeout(() => setOmer(), 60000);
	}

	onMount(() => setTimeout(() => setOmer(), 2000));
</script>

<div class="container column">
	<div id="title">ספירת העומר</div>
	<div id="day" class:isLoading bind:this={dayEl}>&nbsp;</div>
	<div id="metadata" class="row">
		<div class:isLoading bind:this={middosEl}>&nbsp;</div>
		<div class:isLoading bind:this={dateEl}>&nbsp;</div>
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
		border-radius: 12px;
		transition: all cubic-bezier(0.6, 0, 0.2, 1) 300ms;
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
		border-radius: 12px;
		transition: all cubic-bezier(0.6, 0, 0.2, 1) 300ms;
	}

	.isLoading {
		background: #bbcbdd;
		/* 98c0e6 */
		background: linear-gradient(315deg, #bbcbdd 30%, #e9f2fc, #bbcbdd 55%);
		background-size: 200% 100%;
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.12),
			0 1px 2px rgba(0, 0, 0, 0.24);
		min-width: 40%;
		animation: shine 5s cubic-bezier(0.6, 0, 0.2, 1) 0ms infinite;
		color: transparent;
		user-select: none;
	}

	@keyframes shine {
		100% {
			background-position-x: -200%;
			box-shadow: none;
		}
	}
</style>
