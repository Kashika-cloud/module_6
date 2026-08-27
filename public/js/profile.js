// ==========================================
// CHECK LOGIN
// ==========================================

const token =
    localStorage.getItem("token");


if (!token) {

    window.location.href =
        "login.html";
}


// ==========================================
// LOAD PROFILE
// ==========================================

async function loadProfile() {

    try {

        const response =
            await fetch(
                "/api/users/profile",
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "login.html";

            return;
        }


        document.getElementById(
            "profileName"
        ).textContent =
            data.user.name;


        document.getElementById(
            "profileEmail"
        ).textContent =
            data.user.email;


        document.getElementById(
            "profileDate"
        ).textContent =
            new Date(
                data.user.createdAt
            ).toLocaleDateString();


    } catch (error) {

        console.error(error);

    }
}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "user"
    );


    window.location.href =
        "login.html";
}


// ==========================================
// START
// ==========================================

loadProfile();