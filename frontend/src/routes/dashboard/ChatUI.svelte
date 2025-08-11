<script>
    import { onMount } from "svelte";

    let { io } = $props()

    let socket = io()
    let converseViewer;
    let msgForSend;

    onMount(()=>{

    })

</script>

<div >
    <ul bind:this={converseViewer}>
        {#if conversation.length > 0}
            {#each conversation as bubble}
                <li class={bubble.recv ? "recv" : ""}>{bubble.msg}</li>
            {/each}
        {/if}
    </ul>
    <form action="" onsubmit={submitIO}>
        <span>Contact name</span>
        <textarea bind:this={msgForSend}></textarea>
        <div>
            <button type="submit">Submit</button>
            <button>Out of Order</button>
        </div>
    </form>
    <button onclick={() => console.log(converseViewer.scrollTop)}
        >Scroll Top</button
    >
</div>