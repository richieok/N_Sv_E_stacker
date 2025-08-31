<script>
    import { onMount } from "svelte";

    let { socket } = $props();

    let converseViewer;
    let msgForSend;

    let oldScrollHeight = $state(0);
    let conversation = $state([
        { msg: "Start", sender: "No one", recv: true },
        { msg: "Start", sender: "No one", recv: false },
        // { msg: "Start", sender: "No one", recv: true },
        // { msg: "Start", sender: "No one", recv: false },
        // { msg: "Start", sender: "No one", recv: true },
        // { msg: "Start", sender: "No one", recv: false },
        // { msg: "Start", sender: "No one", recv: true },
        // { msg: "Start", sender: "No one", recv: false },
        // { msg: "Start", sender: "No one", recv: true },
        // { msg: "Start", sender: "No one", recv: false },
    ]);

    function submitIO(evt) {
        evt.preventDefault()
        let msg = msgForSend.value;
        if (msg === "") return;
        updateConversation({ msg, sender: "You" });
        updateScrollPos();
        msgForSend.value = "";
        console.log(socket);
        
        socket.emit("private message", msg);
    }

    function updateConversation({ msg, sender, recv = false }) {
        conversation.push({
            sender,
            msg,
            recv,
        });
    }

    function updateScrollPos() {
        if (converseViewer.scrollHeight > oldScrollHeight) {
            converseViewer.scrollTo({
                top: converseViewer.scrollHeight - converseViewer.clientHeight,
                behavior: "smooth",
            });
            console.log(`oldSH = ${oldScrollHeight}`)
            console.log(`newSH = ${converseViewer.scrollHeight}`)
            oldScrollHeight = converseViewer.scrollHeight;
        }
    }
</script>

<div>
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

<style>
    div {
        display: flex;
        flex-direction: column;
        width: 400px;
    }
    ul {
        display: block;
        position: relative;
        list-style: none;
        padding-inline-start: 0;
        max-width: 500px;
        /* margin: 20px auto; */
        padding: 20px;
        border: 1px solid #ddd;
        height: 12rem;
        overflow-y: scroll;
    }

    li {
        position: relative;
        width: 220px;
        background-color: gainsboro;
        margin: 10px 0;
        padding: 10px;
        border-radius: 10px;
        /* Default alignment to the right */
        margin-left: auto;
        margin-right: 0;
    }
    li.recv {
        background-color: black;
        color: white;
        /* Align to the left */
        margin-left: 0;
        margin-right: auto;
    }
    form {
        display: flex;
        flex-direction: column;
        padding-bottom: 1rem;
    }
    form > div {
        flex-direction: row;
        width: auto;
        gap: 0.8em;
        padding: 0.5em;
    }
    textarea {
        resize: vertical;
        min-height: 5em;
        max-height: 10em;
        overflow: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style>
