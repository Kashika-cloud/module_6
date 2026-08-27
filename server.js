const express = require("express");
const path = require("path");
const helmet = require("helmet");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blogs");
const userRoutes = require("./routes/users");

const app = express();

const PORT = process.env.PORT || 3000;

// Fail fast (but don't crash) if JWT secret isn't configured
if (!process.env.JWT_SECRET) {
    console.warn(
        "⚠️  WARNING: JWT_SECRET is not set in your environment. " +
        "Using an insecure fallback for local testing only. " +
        "Set JWT_SECRET in a .env file (see .env.example) before deploying."
    );
    process.env.JWT_SECRET = "dev-only-insecure-secret-change-me";
}

// Security headers
app.use(
    helmet({
        contentSecurityPolicy: false // keep disabled so the Bootstrap CDN keeps working
    })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Health check (useful for Render/Vercel/Netlify uptime checks)
app.get("/api/health", (req, res) => {
    res.json({ success: true, status: "ok", uptime: process.uptime() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API 404
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

// Frontend 404 (any non-API route that didn't match a static file)
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
