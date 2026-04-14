<script lang="ts">
	import { options, tzeisOffset } from '$lib/index';
	import { HDate, HebrewCalendar, HebrewDateEvent, OmerEvent, Locale } from '@hebcal/core';
	import { onMount } from 'svelte';

	let count: string,
		middos: string,
		date: string,
		lamnatzeachWord: string,
		lamnatzeachLetter: string,
		anaBekoach: string,
		isLoading = true;

	function getLamnatzeachWord(day: number) {
		if (!day || day < 1 || day > 49) return '';
		const lamnatzeach = [
			"אֱלֹהִים", "יְחָנֵּנוּ", "וִיבָרְכֵנוּ", "יָאֵר", "פָּנָיו", "אִתָּנוּ", "סֶּלָה",
			"לָדַעַת", "בָּאָרֶץ", "דַּרְכֶּךָ", "בְּכָל", "גּוֹיִם", "יְשׁוּעָתֶךָ",
			"יוֹדוּךָ", "עַמִּים", "אֱלֹהִים", "יוֹדוּךָ", "עַמִּים", "כֻּלָּם",
			"יִשְׂמְחוּ", "וִירַנְּנוּ", "לְאֻמִּים", "כִּי", "תִשְׁפֹּט", "עַמִּים", "מִישׁוֹר", "וּלְאֻמִּים", "בָּאָרֶץ", "תַּנְחֵם", "סֶּלָה",
			"יוֹדוּךָ", "עַמִּים", "אֱלֹהִים", "יוֹדוּךָ", "עַמִּים", "כֻּלָּם",
			"אֶרֶץ", "נָתְנָה", "יְבוּלָהּ", "יְבָרְכֵנוּ", "אֱלֹהִים", "אֱלֹהֵינוּ",
			"יְבָרְכֵנוּ", "אֱלֹהִים", "וְיִירְאוּ", "אֹתוֹ", "כָּל", "אַפְסֵי", "אָרֶץ"
		];
		return lamnatzeach[day - 1];
	}

	function getLamnatzeachLetter(day: number) {
		if (!day || day < 1 || day > 49) return '';
		const lamnatzeachLetters = "ישמחו וירננו לאמים כי תשפט עמים מישור ולאמים בארץ תנחם סלה".replaceAll(/\s/g, '');
		return lamnatzeachLetters[day - 1];
	}

	function getAnaBekoachWord(day: number) {
		if (!day || day < 1 || day > 49) return '';
		const anaBekoach = [
			"אָנָּא", "בְּכֹחַ", "גְּדֻלַּת", "יְמִינְךָ", "תַּתִּיר", "צְרוּרָה", "אב\"ג ית\"ץ",
			"קַבֵּל", "רִנַּת", "עַמְּךָ", "שַׂגְּבֵנוּ", "טַהֲרֵנוּ", "נוֹרָא", "קר\"ע שט\"ן",
			"נָא", "גִבּוֹר", "דּוֹרְשֵׁי", "יִחוּדְךָ", "כְּבָבַת", "שָׁמְרֵם", "נג\"ד יכ\"ש",
			"בָּרְכֵם", "טַהֲרֵם", "רַחֲמֵי", "צִדְקָתְךָ", "תָּמִיד", "גָּמְלֵם", "בט\"ר צת\"ג",
			"חֲסִין", "קָדוֹשׁ", "בְּרֹב", "טוּבְךָ", "נַהֵל", "עֲדָתֶךָ", "חק\"ב תנ\"ע",
			"יָחִיד", "גֵּאֶה", "לְעַמְּךָ", "פְּנֵה", "זוֹכְרֵי", "קְדֻשָּׁתֶךָ", "יג\"ל אפ\"ז",
			"שַׁוְעָתֵנוּ", "קַבֵּל", "וּשְׁמַע", "צַעֲקָתֵנוּ", "יוֹדֵעַ", "תַּעֲלוּמוֹת", "שק\"ו צי\"ת"
		];
		return anaBekoach[day - 1];
	}

	function setOmer() {
		const isPastShkiah = tzeisOffset();
		const today = new HDate(options.date).add(isPastShkiah === 1 ? 1 : 0, 'day');
		const hebrewDate = new HebrewDateEvent(today);
		const calendarEvents = HebrewCalendar.calendar({
			omer: true,
			start: today,
			end: today
		});
		const omerEvent = calendarEvents.find(event => event.getCategories()[0] === 'omer') as OmerEvent | undefined;

		if (!omerEvent) {
			isLoading = true;
			return;
		}

		date = hebrewDate.renderBrief('he');
		date = Locale.hebrewStripNikkud(date);

		count = omerEvent ? omerEvent.getTodayIs('he').replace(/\u05BD/g, '').replace(',', '\n').replace(' ו', '\n ו') : 'Loading...';
		middos = omerEvent ? omerEvent.sefira('he') : '\u{A0}';
		anaBekoach = getAnaBekoachWord(omerEvent?.omer) || '\u{A0}';
		lamnatzeachWord = getLamnatzeachWord(omerEvent?.omer) || '\u{A0}';
		lamnatzeachLetter = getLamnatzeachLetter(omerEvent?.omer) || '\u{A0}';

		middos = Locale.hebrewStripNikkud(middos);
		anaBekoach = Locale.hebrewStripNikkud(anaBekoach);
		lamnatzeachWord = Locale.hebrewStripNikkud(lamnatzeachWord);
		lamnatzeachLetter = Locale.hebrewStripNikkud(lamnatzeachLetter);

		if (isPastShkiah === -1) {
			isLoading = true;
			return;
		}		
		isLoading = false;
	}

	onMount(() => setInterval(() => setOmer(), 60000));
	setOmer();
</script>

<div class="container column">
	<div id="day" class="column" class:isLoading>{count}</div>
	<div id="metadata" class="row">
		<div class:isLoading>{middos}</div>
		<div class:isLoading>{lamnatzeachWord}</div>
		<div class:isLoading>{anaBekoach}</div>
		<div class:isLoading>{lamnatzeachLetter}</div>
		<div class:isLoading>{date}</div>
	</div>
</div>

<style>
	.container {
		width: 65%;
		height: 65%;
		gap: 6rem;
		font-family: 'Noa Shalev', 'Calibri', 'david';
	}
	#day {
		min-height: 2.6rem;
		flex-grow: 1;
		font-size: 92px;
		line-height: 1.3;
		/* max-width: 60%; */
		white-space: pre-wrap;
		border-radius: 12px;
		transition: all cubic-bezier(0.6, 0, 0.2, 1) 300ms;
	}
	#metadata {
		height: unset;
		justify-content: space-between;
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.75;
		letter-spacing: 1.3px;
	}
	#metadata div {
		background: #051791;
		color: #bbcbdd;
		line-height: 1;
		padding: 1rem 2.25rem;
		width: fit-content;
		text-align: center;
		border-radius: 12px;
		transition: all cubic-bezier(0.6, 0, 0.2, 1) 300ms;
	}

	.isLoading {
		color: transparent !important;
		background: #bbcbdd;
		/* 98c0e6 */
		background: linear-gradient(315deg, #bbcbdd 30%, #e9f2fc, #bbcbdd 55%);
		background-size: 200% 100%;
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.12),
			0 1px 2px rgba(0, 0, 0, 0.24);
		/* min-width: 40%; */
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
