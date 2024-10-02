<script lang="ts">
	import toast, { Toaster } from 'svelte-french-toast';
	import '../app.css';
	import { user } from '../stores';
	import { onMount } from 'svelte';

	onMount(async () => {
		toast.loading('Trying auto login...');
		const response = await fetch(`/api/login`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const result = await response.json();
		toast.dismiss();
		if (result.error) return;
		$user = result.user;
		toast.success('Logged in!');
	});
</script>

<div class="app">
	<main
		style="background-image: linear-gradient(to right, rgb(255, 100,255), rgb(100, 100, 255)); width: 100vw; height: 100vh;"
	>
		<nav
			style="display: flex; justify-content: space-between; padding: 20px; border: solid 2px; background-color: aliceblue;"
		>
			<h1>Scheduled code runner</h1>
			{#if $user}
				<p>
					{$user.username}
				</p>
			{/if}
		</nav>
		<Toaster />
		<slot />
	</main>

	<footer></footer>
</div>
