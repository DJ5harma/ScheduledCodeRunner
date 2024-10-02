<script>
	import RunCard from '../../components/RunCard.svelte';
	import { runsArray } from '../../stores';
</script>

<div style="display: flex; flex-direction: column; gap:30px;">
	{#each $runsArray as run}
		<div style="background-color: rgb(0,0,0,0.5); color:white; padding:10px;">
			<RunCard {run} />
		</div>
	{/each}
</div>
