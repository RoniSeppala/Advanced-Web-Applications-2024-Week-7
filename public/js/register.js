const errorParagraph = document.getElementById("errorField")

document.getElementById("registerForm").addEventListener("submit", (event) => {
    event.preventDefault();

    errorParagraph.innerHTML = "";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/api/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email:email, password:password }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                errorParagraph.innerHTML="User already exists";
            }
            else {
                errorParagraph.innerHTML="User created successfully";
                window.location.href = "/login.html";
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
})