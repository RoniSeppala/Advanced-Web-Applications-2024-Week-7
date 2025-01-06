const errorParagraph = document.getElementById("errorField")

document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("running here")
    

    errorParagraph.innerHTML = "";
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email:email, password:password }),
        }); 

        if (!response.ok) {
            errorParagraph.innerText = "Error when trying to login. Please try again."
        } else {
            const data = await response.json();

            if(data.token){
                localStorage.setItem("token", data.token);
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
})