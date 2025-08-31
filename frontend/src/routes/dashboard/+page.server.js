import { redirect } from '@sveltejs/kit'

async function getUrl({ folder, filename, authToken }) {
    console.log(`http://backend:4000/api/img/folder/${folder}/filename/${filename}`)
    let response = await fetch(`http://backend:4000/api/img/folder/${folder}/filename/${filename}`, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    })
    if (!response.ok) {
        console.log("error: ", response.status)
        return null
    }
    const text = await response.text()
    console.log("text: ", text)
    return text
}

export async function load({ cookies, event }) {
    const tokenX = cookies.get("tokenX")
    console.log("tokenX from dashboard load -> ", tokenX);
    if (!tokenX) {
        redirect(303, "/login")
    }
    const respone = await fetch("http://backend:4000/api/auth", {
        headers: {
            Authorization: `Bearer ${tokenX}`
        }
    })
    console.log("respone -> ", respone.status);
    const apiData = await respone.json()
    console.log("error: ", apiData.error)
    if (!respone.ok) {
        if (respone.status == "401" || respone.status == "403") {
            cookies.delete("tokenX", { path: '/' })
            redirect(303, "/login")
        }
        return
    }
    const user = apiData.user
    const imgUrl = await getUrl({ folder: "public", filename: "default-profile-pic.svg", authToken: tokenX })
    console.log("imgurl: ", imgUrl)
    // imgurl = imgurl ?? "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    console.log("user from load server dashboard: ---> ", user)
    return { user, tokenX, imgUrl }
}