<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<section>
	<h1>Online Compiler</h1>
	<button on:click={() => goto('/form')}>Switch Account</button>
	<button on:click={() => goto('/run')}>Schedule or Run code</button>
	<button>Access all your runs</button>
</section>
