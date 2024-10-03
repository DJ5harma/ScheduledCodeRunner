<script lang="ts">
	export let child: any;
</script>

<div>
	<svelte:component this={child} />
</div>

<style>
	div {
		height: 100vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		animation: fadeIn 0.5s forwards;
		z-index: 50;
	}
</style>
