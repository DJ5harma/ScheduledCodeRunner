<script lang="ts">
	let file: File | null = null;
	let language: string = 'cpp';
	let output: string = '';
	let error: string = '';

	async function handleSubmit(e: Event) {
		e.preventDefault();
		const formData = new FormData();
		if (file) {
			formData.append('file', file);
			formData.append('language', language);

			const response = await fetch('/api/run-code', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			output = result.output || '';
			error = result.error || '';
		}
	}

	function handleFileChange(event: Event) {
		const temp = event.target as HTMLInputElement;
		if (temp.files) file = temp.files[0];
	}
</script>

<section
	style="background-image: linear-gradient(to right, rgb(255, 100,255), rgb(100, 100, 255)); width: 100vw; height: 100vh;"
>
	<h1>Online Compiler</h1>

	<form on:submit={handleSubmit}>
		<label for="file">Choose file:</label>
		<input type="file" id="file" on:change={handleFileChange} required />

		<div>
			<label for="language">Select language:</label>
			<select bind:value={language}>
				<option value="cpp">C++</option>
				<option value="python">Python</option>
				<option value="javascript">JavaScript</option>
				<option value="java">Java</option>
			</select>
		</div>
		<button type="submit">Run Code</button>
	</form>

	<div
		style="background-color: rgba(0,0,0,0.5); border-radius: 20px; color:white; padding: 20px; gap: 10px; display: flex; flex-direction: column; align-items: center;"
	>
		<h2>{output ? 'Output' : error ? 'Error!' : 'Your output will be shown here...'}</h2>
		<pre>{output} {error}</pre>
	</div>
</section>
