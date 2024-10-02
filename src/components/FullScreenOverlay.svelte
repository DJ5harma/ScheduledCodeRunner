<script lang="ts">
	export let child: any;
</script>

<div
	style="height: 100vh; width: 100vw; display: flex; justify-content: center; align-items: center; position: fixed; top: 0; left: 0;"
>
	<svelte:component this={child} />
</div>
