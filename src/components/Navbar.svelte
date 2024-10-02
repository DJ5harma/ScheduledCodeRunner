<script lang="ts">
	import { showMenu, user } from '../stores';
	import FullScreenOverlay from './FullScreenOverlay.svelte';
	import NavMenu from './NavMenu.svelte';
</script>

<nav
	style="display: flex; justify-content: space-between; padding: 20px; border: solid 2px; background-color: aliceblue; align-items: center;"
>
	<h1>Scheduled code runner</h1>
	<button
		style="border: solid; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center;"
		on:click={() => ($showMenu = !$showMenu)}
	>
		{#if $user}
			<p>
				{$user.username}
			</p>
		{/if}
	</button>
	{#if $showMenu}
		<FullScreenOverlay child={NavMenu} />
	{/if}
</nav>
