<script>
    import SecureImg from "$lib/components/SecureImg.svelte";
    let src = "/api/img/folder/public/filename/default-profile-pic.svg"
    let alt = "Default image"
</script>

<h1>Home</h1>
<SecureImg {src} {alt}/>
<SecureImg src="/api/img/folder/public/filename/star.svg" alt="yellow star"/>