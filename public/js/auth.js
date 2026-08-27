const registerForm =
    document.getElementById("registerForm");

const loginForm =
    document.getElementById("loginForm");


// ==========================================
// REGISTER
// ==========================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document.getElementById("name").value;

            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;

            const message =
                document.getElementById("message");


            try {

                const response =
                    await fetch(
                        "/api/auth/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name,
                                email,
                                password
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    message.innerHTML = `
                        <div class="alert alert-danger">
                            ${data.message}
                        </div>
                    `;

                    return;
                }


                message.innerHTML = `
                    <div class="alert alert-success">
                        ${data.message}
                        Redirecting to login...
                    </div>
                `;


                registerForm.reset();


                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    1500
                );


            } catch (error) {

                console.error(error);

                message.innerHTML = `
                    <div class="alert alert-danger">
                        Unable to connect to server.
                    </div>
                `;
            }

        }
    );
}


// ==========================================
// LOGIN
// ==========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;

            const message =
                document.getElementById("message");


            try {

                const response =
                    await fetch(
                        "/api/auth/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                password
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    message.innerHTML = `
                        <div class="alert alert-danger">
                            ${data.message}
                        </div>
                    `;

                    return;
                }


                // Save JWT
                localStorage.setItem(
                    "token",
                    data.token
                );


                // Save user information
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                message.innerHTML = `
                    <div class="alert alert-success">
                        Login successful!
                    </div>
                `;


                setTimeout(
                    function () {

                        window.location.href =
                            "dashboard.html";

                    },
                    500
                );


            } catch (error) {

                console.error(error);

                message.innerHTML = `
                    <div class="alert alert-danger">
                        Unable to connect to server.
                    </div>
                `;
            }

        }
    );
}