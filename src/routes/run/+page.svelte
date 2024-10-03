<script lang="ts">
	import type { ILanguage, IRun } from '$lib/types';
	import { onMount } from 'svelte';
	import RunCard from '../../components/RunCard.svelte';
	import toast from 'svelte-french-toast';
	let file: File | null = null;
	let language: ILanguage = 'cpp';
	let mode: 'delay' | 'now' | 'cron' = 'now';
	let delay = '',
		title = '',
		description = '';

	let runResponse: IRun | null = null;
	let cronArray = ['', '', '', '', '', ''];
	onMount(() => {
		const storedLanguage = localStorage.getItem('language') as ILanguage;
		const storedMode = localStorage.getItem('mode') as 'delay' | 'now' | 'cron';
		if (storedLanguage) language = storedLanguage;
		if (storedMode) mode = storedMode;
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!file) return toast.error('File is not selected! please reselect after refresh!');
		let cronStr = '';
		if (mode === 'cron')
			for (let i = 0; i < cronArray.length; i++)
				if (!cronArray[i]) return toast.error('All scheduled inputs shall be present');
				else cronStr = cronStr + ' ' + cronArray[i];
		cronStr = cronStr.slice(1);

		toast.loading('Taking your query...');
		const formData = new FormData();

		if (file) {
			formData.append('file', file);
			formData.append('language', language);
			formData.append('mode', mode);
			if (mode === 'delay') formData.append('delay', delay);
			formData.append('title', title);
			formData.append('description', description);
			if (mode === 'cron') formData.append('cronStr', cronStr);
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
		<button
			class={mode === 'delay' ? 'selected' : ''}
			on:click={() => {
				mode = 'delay';
				localStorage.setItem('mode', mode);
			}}>Run after delay</button
		>
		<button
			class={mode === 'cron' ? 'selected' : ''}
			on:click={() => {
				mode = 'cron';
				localStorage.setItem('mode', mode);
			}}>🌟Run multiple times with custom settings🌟</button
		>
		<button
			class={mode === 'now' ? 'selected' : ''}
			on:click={() => {
				mode = 'now';
				localStorage.setItem('mode', mode);
			}}>Run now</button
		>
	</div>

	<form>
		<div style="display: flex; align-items: center; gap:10px">
			<input placeholder="title" on:change={(e) => (title = e.currentTarget.value)} />
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
	</form>
	{#if mode === 'cron'}
		<div style="background-color: rgb(0,0,0,0.5); color:white; text-align: center; padding: 10px;">
			<p>: Please provide these values in a comma separated format :</p>
			<p>Tip : let "*" be at where you want to run for all the possible values</p>
		</div>
		<form style="width: 100vw; flex-direction: row;flex-wrap: wrap; justify-content: center;">
			<input
				on:change={(e) => (cronArray[0] = e.currentTarget.value)}
				value={cronArray[0]}
				class="cronInput"
				placeholder="multiple seconds (0-59)"
			/>
			<input
				on:change={(e) => (cronArray[1] = e.currentTarget.value)}
				value={cronArray[1]}
				class="cronInput"
				placeholder="multiple minutes (0-59)"
			/>
			<input
				on:change={(e) => (cronArray[2] = e.currentTarget.value)}
				value={cronArray[2]}
				class="cronInput"
				placeholder="multiple hours (0-23)"
			/>
			<input
				on:change={(e) => (cronArray[3] = e.currentTarget.value)}
				value={cronArray[3]}
				class="cronInput"
				placeholder="multiple month days (1-31)"
			/>
			<input
				on:change={(e) => (cronArray[4] = e.currentTarget.value)}
				value={cronArray[4]}
				class="cronInput"
				placeholder="multiple months (1-12)"
			/>
			<input
				on:change={(e) => (cronArray[5] = e.currentTarget.value)}
				value={cronArray[5]}
				class="cronInput"
				placeholder="multiple week days (1-7)/(Mon - Sun)"
			/>
		</form>
	{/if}
	<button on:click={handleSubmit} style="background-color: black; color:white">Submit!</button>

	<div
		style="background-color: rgba(0,0,0,0.5); border-radius: 20px; color:white; padding: 20px; gap: 10px; display: flex; flex-direction: column; align-items: center;"
	>
		{#if !runResponse}
			<h2>Your response will be shown here...</h2>
		{:else}<RunCard run={runResponse} />
		{/if}
	</div>
</section>

<style>
	.cronInput {
		width: 49%;
		text-align: center;
	}
</style>
