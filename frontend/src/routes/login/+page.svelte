<script>
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";

    let message;
    let user = $state({})

    // if ( browser && form?.success){
    // 	console.log(form.message)
    // 	localStorage.setItem("user", JSON.stringify(form.user))
    // 	goto("/dashboard")
    // }

    async function handleSubmit(evt) {
        evt.preventDefault(); // Prevent the default form submission
        const formData = new FormData(evt.target);

        const response = await fetch("/api/login", {
            method: "POST",
            body: formData,
        });
        if (response.ok) {
            const data = await response.json();
            console.log("Login successful:", data);
            message.textContent = data.message
            
            window.location.href = "/dashboard"; // Redirect to index.html
        } else {
            const errorData = await response.json();
            console.error("Login failed:", errorData.message);
            message.textContent = errorData.message;
        }
    }
</script>

<!-- {#if !message.innerText === ""}
{/if} -->
<div bind:this={message} class="banner-message"></div>
<form method="post" onsubmit={handleSubmit}>
    <h1>Login</h1>
    <label for="username">Username / Email: </label>
    <input
        type="text"
        id="username"
        name="username"
        placeholder="Username / Email"
        value=""
    />
    <br />
    <label for="password" type="password">Password: </label>
    <input
        type="password"
        id="password"
        name="password"
        placeholder="Password"
    />
    <br />
    <button type="submit" id="login">Login</button>
</form>
