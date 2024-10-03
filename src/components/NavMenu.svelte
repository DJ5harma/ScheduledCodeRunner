<script lang="ts">
	import { goto } from '$app/navigation';
	import { showMenu } from '../stores';
</script>

<button
	style="display: flex; flex-direction: column; gap: 20px; padding: 40px; background-color: rgb(0,0,0,0.8); width: 100%; height:100%; justify-content: center; align-items: center;"
	on:click={() => ($showMenu = false)}
>
	<div style="display: flex; gap: 20px;">
		<button on:click={() => goto('/run')}> Run some code </button>
		<button on:click={() => goto('/previous_runs')}> Check previous runs</button>
	</div>
	<div style="display: flex; gap: 20px;">
		<button on:click={() => goto('/form')}> Switch account </button>
		<button on:click={() => goto('/')}> Go to home page</button>
	</div>
</button>

<style>
</style>
