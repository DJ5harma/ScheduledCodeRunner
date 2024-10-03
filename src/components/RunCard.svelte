<script lang="ts">
	import type { IRun } from '$lib/types';

	export let run: IRun;
</script>

<div
	style="display: flex; flex-direction: column; align-items: center; gap: 10px; background-color; border:black;"
>
	<p>Title: {run.title}</p>
	<p>Description: {run.description}</p>
	<div>
		<span>Extension: {run.extension} | </span>
		<span>Mode: {run.mode} | </span>
		<span>Status: {run.status}</span>
	</div>
	<p>Output: {run.output}</p>
	<p>Time: {new Date(run.time)}</p>
</div>
