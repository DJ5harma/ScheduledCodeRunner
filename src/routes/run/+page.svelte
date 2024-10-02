<script lang="ts">
	import type { IRun } from '$lib/types';
	import { onMount } from 'svelte';
	import RunCard from '../../components/RunCard.svelte';

	let file: File | null = null;
	let language: string = 'cpp';
	let mode: 'delay' | 'now' | 'everyday' = 'now';

	let runResponse: IRun | null = null;
	onMount(() => {
		const storedLanguage = localStorage.getItem('language');
		if (storedLanguage) language = storedLanguage;
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		const formData = new FormData();
		if (file) {
			formData.append('file', file);
			formData.append('language', language);
			formData.append('mode', mode);
			const response = await fetch('/api/run-code', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			runResponse = result.run;
			console.log({ runResponse });
		}
		localStorage.setItem('language', language);
	}

	function handleFileChange(event: Event) {
		const temp = event.target as HTMLInputElement;
		if (temp.files) file = temp.files[0];
	}
</script>

<section>
	<h1>Online Compiler</h1>
	<div>
		<button class={mode === 'delay' ? 'selected' : ''} on:click={() => (mode = 'delay')}
			>Run after delay</button
		>
		<button class={mode === 'everyday' ? 'selected' : ''} on:click={() => (mode = 'everyday')}
			>Run everyday at a specific time</button
		>
		<button class={mode === 'now' ? 'selected' : ''} on:click={() => (mode = 'now')}>Run now</button
		>
	</div>

	<form on:submit={handleSubmit}>
		<div>
			<label for="file">Choose file:</label>
			<input type="file" id="file" on:change={handleFileChange} required />
		</div>

		<div>
			<label for="language">Select language:</label>
			<select bind:value={language}>
				<option value="cpp">C++</option>
				<option value="python">Python</option>
				<option value="javascript">JavaScript</option>
				<option value="java">Java</option>
			</select>
		</div>
		{#if mode === 'delay'}
			<input type="number" name="delay" placeholder="Enter delay in ms" />
		{/if}

		<button style="background-color: black; color:white">Submit!</button>
	</form>

	<div
		style="background-color: rgba(0,0,0,0.5); border-radius: 20px; color:white; padding: 20px; gap: 10px; display: flex; flex-direction: column; align-items: center;"
	>
		{#if !runResponse}
			<h2>Your response will be shown here...</h2>
		{:else}<RunCard run={runResponse} />
		{/if}
	</div>
</section>
