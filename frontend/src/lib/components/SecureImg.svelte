<script>
    import { onMount } from "svelte";

    let defaultSrc = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    let { src = defaultSrc, alt } = $props()
    let s = $state(defaultSrc)

    onMount(async ()=>{
        console.log(src)
        const reponse = await fetch(src, {
            credentials: "include"
        })
        if (reponse.ok){
            src = await reponse.text()
            console.log(src)
            // let text = await reponse.text()
            // console.log(text)
            // src = text
        } else {
            console.log(`Response status: ${reponse.status}`)
        }
    })
</script>

<img {src} {alt}>