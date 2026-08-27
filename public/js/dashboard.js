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
// USER INFORMATION
// ==========================================

const storedUser =
    localStorage.getItem("user");


if (storedUser) {

    const user =
        JSON.parse(storedUser);

    document.getElementById(
        "userName"
    ).textContent = user.name;
}


// ==========================================
// LOAD BLOGS
// ==========================================

async function loadBlogs() {

    try {

        const response =
            await fetch(
                "/api/blogs",
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


        // Token invalid
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


        const container =
            document.getElementById(
                "blogsContainer"
            );


        container.innerHTML = "";


        // No blogs
        if (data.blogs.length === 0) {

            container.innerHTML = `
                <div class="alert alert-info">
                    You haven't created any blogs yet.
                </div>
            `;

            return;
        }


        // Display blogs
        data.blogs.forEach(
            function (blog) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "card blog-card mb-4";


                card.innerHTML = `

                    <div class="card-body">

                        <h3 class="blog-title">
                            ${escapeHtml(blog.title)}
                        </h3>

                        <p class="blog-content">
                            ${escapeHtml(blog.content)}
                        </p>

                        <small class="text-muted">
                            Published:
                            ${new Date(
                                blog.createdAt
                            ).toLocaleString()}
                        </small>

                        <br><br>

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="deleteBlog('${blog.id}')"
                        >
                            🗑 Delete
                        </button>

                    </div>

                `;


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(error);

    }
}


// ==========================================
// CREATE BLOG
// ==========================================

document
    .getElementById("blogForm")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const title =
                document.getElementById(
                    "title"
                ).value;


            const content =
                document.getElementById(
                    "content"
                ).value;


            const message =
                document.getElementById(
                    "blogMessage"
                );


            try {

                const response =
                    await fetch(
                        "/api/blogs",
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({
                                title,
                                content
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
                        Blog published successfully!
                    </div>
                `;


                document
                    .getElementById(
                        "blogForm"
                    )
                    .reset();


                loadBlogs();


                setTimeout(
                    function () {

                        message.innerHTML = "";

                    },
                    3000
                );


            } catch (error) {

                console.error(error);

            }

        }
    );


// ==========================================
// DELETE BLOG
// ==========================================

async function deleteBlog(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this blog?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/blogs/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(data.message);

            return;
        }


        alert(
            "Blog deleted successfully!"
        );


        loadBlogs();


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
// HTML SECURITY
// ==========================================

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent = text;


    return div.innerHTML;
}


// ==========================================
// START
// ==========================================

loadBlogs();