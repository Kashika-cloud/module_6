const express = require("express");
const fs = require("fs");
const path = require("path");

const authenticateToken =
    require("../middleware/auth");

const router = express.Router();

const blogsFile =
    path.join(__dirname, "../data/blogs.json");


function getBlogs() {

    return JSON.parse(
        fs.readFileSync(blogsFile, "utf8")
    );
}


function saveBlogs(blogs) {

    fs.writeFileSync(
        blogsFile,
        JSON.stringify(blogs, null, 2)
    );
}


// =========================
// GET MY BLOGS
// =========================

router.get("/", authenticateToken, (req, res) => {

    const blogs = getBlogs();

    // IMPORTANT:
    // Only return blogs belonging to logged-in user

    const userBlogs = blogs.filter(
        blog =>
            blog.userId === req.user.id
    );

    res.json({

        success: true,

        count: userBlogs.length,

        blogs: userBlogs
    });
});


// =========================
// CREATE BLOG
// =========================

router.post("/", authenticateToken, (req, res) => {

    const { title, content } = req.body;

    if (!title || !content) {

        return res.status(400).json({

            success: false,

            message: "Title and content are required"
        });
    }

    const blogs = getBlogs();

    const newBlog = {

        id: Date.now().toString(),

        userId: req.user.id,

        author: req.user.name,

        title: title.trim(),

        content: content.trim(),

        createdAt: new Date().toISOString()
    };

    blogs.push(newBlog);

    saveBlogs(blogs);

    res.status(201).json({

        success: true,

        message: "Blog created successfully",

        blog: newBlog
    });
});


// =========================
// DELETE MY BLOG
// =========================

router.delete(
    "/:id",
    authenticateToken,
    (req, res) => {

        const blogs = getBlogs();

        const blogIndex =
            blogs.findIndex(

                blog =>

                    blog.id === req.params.id &&

                    blog.userId === req.user.id
            );

        if (blogIndex === -1) {

            return res.status(404).json({

                success: false,

                message:
                    "Blog not found or access denied"
            });
        }

        blogs.splice(blogIndex, 1);

        saveBlogs(blogs);

        res.json({

            success: true,

            message: "Blog deleted successfully"
        });
    }
);


module.exports = router;