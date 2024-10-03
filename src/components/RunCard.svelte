<script lang="ts">
	import type { IRun } from '$lib/types';

	export let run: IRun;
	const { title, description, extension, mode, output, time, status } = run;
	console.log(time.split(' '));
	console.log(time.replaceAll(' ', '__'));
</script>

<div
	style="display: flex; flex-direction: column; align-items: center; gap: 10px; background-color; border:black;"
>
	<p>Title: {title}</p>
	<p>Description: {description}</p>
	<div>
		<span>Extension: {extension}</span> |
		<span
			style={`color:${mode === 'delay' ? 'rgb(100,255,255)' : mode === 'everyday' ? 'rgb(255,100,255)' : 'rgb(255, 255, 100)'}`}
			>Mode: {mode}
		</span>
		|
		<span
			style={`color:${status === 'success' ? 'rgb(100,255,100)' : status === 'error' ? 'rgb(255,100,100)' : 'gray'}`}
			>Status: {status}</span
		>
	</div>
	<p style="color: black; background-color: white;">Output: {output}</p>
	<p>
		Time: {time.includes(',') || time.includes(' ')
			? 'customTime: ' + time.replaceAll(' ', ' _ ')
			: new Date(parseInt(time))}
	</p>
</div>

<style>
	p,
	span {
		background-color: rgb(0, 0, 0, 0.5);
		padding: 4px 10px;
		border-radius: 5px;
	}
</style>
