<script lang="ts">
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';
	import Navbar from '../components/Navbar.svelte';
</script>

<div class="app">
	<main>
		<Navbar />
		<Toaster />
		<slot />
	</main>

	<footer></footer>
</div>
