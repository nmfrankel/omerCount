<script lang="ts">
	import { onMount } from 'svelte';

	let timeEl: HTMLDivElement;

	function toggleFullscreen() {
		const doc = window.document as any;
		const docEl = doc.documentElement as any;

		const requestFullScreen =
			docEl.requestFullscreen ||
			docEl.mozRequestFullScreen ||
			docEl.webkitRequestFullScreen ||
			docEl.msRequestFullscreen;

		const exitFullScreen =
			doc.exitFullscreen ||
			doc.mozCancelFullScreen ||
			doc.webkitExitFullscreen ||
			doc.msExitFullscreen;

		if (
			!doc.fullscreenElement &&
			!doc.mozFullScreenElement &&
			!doc.webkitFullscreenElement &&
			!doc.msFullscreenElement
		) {
			requestFullScreen.call(docEl);
		} else {
			exitFullScreen.call(doc);
		}
	}

	function displayCurrentTime() {
		const now = new Date();
		let hours = now.getHours();
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = now.getSeconds();
		const millis = now.getMilliseconds();
		const meridian = hours >= 12 ? 'PM' : 'AM';

		hours = hours % 12 || 12;

		const formattedTime = `${hours}:${minutes} ${meridian}`;

		if (timeEl) {
			timeEl.innerText = formattedTime;
		} else {
			console.error('Element with id "timeEl" not found.');
		}

		// update every minute on zero seconds accurately
		setTimeout(() => displayCurrentTime(), 60000 - (seconds * 1000 - millis));
		// update every second -> 1000-now.getMilliseconds()
	}

	onMount(() => displayCurrentTime());
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<footer>
	<div id="time" bind:this={timeEl} on:click={toggleFullscreen}>&nbsp;</div>
</footer>

<style>
	footer {
		display: inline-block;
		padding: 0.15rem 0.75rem;
		background-color: rgba(5, 23, 145, 0.9);
	}
	#time {
		text-align: end;
	}
</style>
