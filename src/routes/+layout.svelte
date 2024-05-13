<script lang="ts">
	import '../app.css';
	import Clock from '../lib/Clock.svelte';
</script>

<div class="column">
	<slot />
	<Clock />
</div>
