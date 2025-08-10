<script>
    import { onMount } from 'svelte';
    import { io } from 'socket.io-client';
    
    onMount(()=>{
        const socket = io({
            path: '/api/socketio/'
        })
    })
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
