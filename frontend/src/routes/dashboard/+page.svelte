<script>
    import { browser } from "$app/environment";
    let { data } = $props();

</script>

<h1>Dashboard</h1>
{#if data.user}
    <h3>{data.user.username}</h3>
{/if}
