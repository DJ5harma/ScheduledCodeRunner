<script lang="ts">
	import type { ILanguage, IRun } from '$lib/types';
	import { onMount } from 'svelte';
	import RunCard from '../../components/RunCard.svelte';
	import toast from 'svelte-french-toast';

	let file: File | null = null;
	let language: ILanguage = 'cpp';
	let mode: 'delay' | 'now' | 'everyday' = 'now';
	let delay = '',
		title = '',
		description = '';

	let runResponse: IRun | null = null;
	onMount(() => {
		const storedLanguage = localStorage.getItem('language') as ILanguage;
		const storedMode = localStorage.getItem('mode') as 'delay' | 'now' | 'everyday';
		if (storedLanguage) language = storedLanguage;
		if (storedMode) mode = storedMode;
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!file) return toast.error('File is not selected! please reselect after refresh!');
		toast.loading('Taking your query...');
		const formData = new FormData();
		// console.log({ file, mode, language, delay, title, description });

		if (file) {
			formData.append('file', file);
			formData.append('language', language);
			formData.append('mode', mode);
			formData.append('delay', delay);
			formData.append('title', title);
			formData.append('description', description);
			const response = await fetch(`/api/run/${mode}`, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			toast.dismiss();
			if (result.error) return toast.error(result.error);
			runResponse = result.run;
			toast.success('Query successful');
		}
		localStorage.setItem('language', language);
		localStorage.setItem('mode', mode);
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
		<div style="display: flex; align-items: center; gap:10px">
			<input type="text" placeholder="title" on:change={(e) => (title = e.currentTarget.value)} />
			<textarea
				placeholder="description"
				name="description"
				on:change={(e) => (description = e.currentTarget.value)}
			></textarea>
		</div>
		<div>
			<label for="file">Choose file:</label>
			<input type="file" id="file" on:change={handleFileChange} required />
			<label for="language">Select language:</label>
			<select bind:value={language}>
				<option value="cpp">C++</option>
				<option value="python">Python</option>
				<option value="javascript">JavaScript</option>
				<option value="java">Java</option>
			</select>
		</div>
		{#if mode === 'delay'}
			<input
				type="number"
				value={delay}
				on:change={(e) => (delay = e.currentTarget.value)}
				name="delay"
				placeholder="Enter delay in ms"
			/>
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
