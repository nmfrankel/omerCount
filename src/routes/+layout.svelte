<script lang="ts">
	import '../app.css';
	import Clock from '../lib/Clock.svelte';

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
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="column" on:click={toggleFullscreen}>
	<slot />
	<Clock />
</div>
