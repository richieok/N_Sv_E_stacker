<script>
	import favicon from '$lib/assets/favicon.svg';
    import AuthWidget from './AuthWidget.svelte';
	import Nav from './Nav.svelte';

	let { children } = $props();

	function logout(evt) {
		console.log("logout!!!")
		evt.preventDefault();
		document.cookie = "tokenX=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		// localStorage.clear();
		// window.location.href = '/';
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header>
	<Nav {logout} />
	<AuthWidget/>
</header>
<main>
	{@render children?.()}
</main>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background-color: #333;
		color: white;
	}
	main {
		padding: 1rem;
	}
</style>