<script>
    import { io } from "socket.io-client";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    let { data } = $props();

    let msgForSend;
    let socket;
    let oldScrollHeight = $state(0);

    let container
    let converseViewer;

    let conversation = $state([
        { msg: "Start", sender: "No one", recv: true },
        // { msg: "Start", sender: "No one", recv: false },
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
        let msg = msgForSend.value;
        if (msg === "") return;
        updateConversation({ msg, sender: "You" });
        updateScrollPos();
        msgForSend.value = "";
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

    onMount(() => {
        oldScrollHeight = converseViewer.scrollHeight;
        updateScrollPos();
        socket = io({
            path: "/api/socketio/",
        });
        socket.on("connect", ()=> console.log(`Connected to ws server.`))
        socket.onAny((event, args)=>{
            console.log(event, args)
        })
        socket.on("private message", (data) => {
            data.recv = true;
            updateConversation(data);
            // converseViewer.scrollTo({
            //     top: converseViewer.scrollHeight,
            //     behaviour: "smooth",
            // });
        });
        updateScrollPos();
        // console.log(converseViewer.scrollHeight);
        // console.log(converseViewer.clientHeight);
        // console.log(converseViewer.scrollTop);
        return () => {
            if (socket){
                socket.disconect()
            }
        };
    });
</script>

<h1>Dashboard</h1>
{#if data.user}
    <h3>{data.user.username}</h3>
{/if}
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
        gap: .8em;
        padding: .5em;
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
