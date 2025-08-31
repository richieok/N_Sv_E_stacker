<script>
    import { io } from "socket.io-client";
    import { onMount } from "svelte";
    import ChatUI from "./ChatUI.svelte";

    let { data } = $props();

    let msgForSend;
    let socket = $state();

    let container;
    let converseViewer;

    let src = "/api/img/folder/public/filename/default-profile-pic.svg";

    onMount(() => {
        socket = io({
            path: "/api/socketio/",
        });
        console.log(socket);
        socket.on("connect", () => console.log(`Connected to ws server.`));
        socket.onAny((event, args) => {
            console.log(event, args);
        });
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
            if (socket) {
                // socket.disconect()
            }
        };
    });
</script>

<h1>Dashboard</h1>
{#if data.user}
    <h3>{data.user.username}</h3>
{/if}
<div>
    <ChatUI {socket} />
    <div style="display: block;padding:1em;">
        {#if data.imgUrl}
            <img src={data.imgUrl} alt="aa" />
        {/if}
        <img src="" alt="" />
    </div>
</div>

<style>
    div {
        display: grid;
        grid-template-columns: auto 1fr;
    }
</style>
