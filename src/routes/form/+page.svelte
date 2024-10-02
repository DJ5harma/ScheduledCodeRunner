<script lang="ts">
	import toast from 'svelte-french-toast';
	import { user } from '../../stores';
	import { goto } from '$app/navigation';

	let formType: 'Register' | 'Login' = 'Login';
	let formData = {
		username: '',
		password: '',
		email: ''
	};
	let confirmedPassword = '';
	async function handleSubmit() {
		if (formType === 'Register' && confirmedPassword != formData.password)
			return toast.error('Passwords mismatch');
		if (formType === 'Register' && formData.password.length < 6)
			return toast.error('Password too short');

		const response = await fetch(`/api/${formType.toLowerCase()}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		});

		const result = await response.json();
		if (result.error) return toast.error(result.error);
		$user = result.user;
		toast.success(formType + ' action complete!');
		goto('/');
	}
</script>

<section>
	<h1>Form</h1>
	<div>
		<button on:click={() => (formType = 'Login')} class={formType === 'Login' ? 'selected' : ''}
			>Login</button
		>
		<button on:click={() => (formType = 'Register')} class={formType !== 'Login' ? 'selected' : ''}
			>Register</button
		>
	</div>
	<input
		on:change={(e) => (formData.username = e.currentTarget.value)}
		type="text"
		placeholder="username"
		value={formData.username}
	/>
	<input
		on:change={(e) => (formData.email = e.currentTarget.value)}
		type="email"
		placeholder="email"
		value={formData.email}
	/>
	<input
		on:change={(e) => (formData.password = e.currentTarget.value)}
		type="password"
		placeholder="password (min: 6)"
		value={formData.password}
	/>
	{#if formType === 'Register'}
		<input
			on:change={(e) => (confirmedPassword = e.currentTarget.value)}
			type="password"
			placeholder="confirm-password"
			value={confirmedPassword}
		/>
	{/if}
	<button on:click={handleSubmit} style="background-color: black; color:white;">{formType}</button>
</section>
