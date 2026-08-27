# 📝 BlogHub — Full Stack Blog Application

Module 6 · Final Project & Deployment — Codomax Digital Solutions Internship

A full stack blog platform with JWT authentication, per-user blog management, and a responsive Bootstrap UI. Users can register, log in, publish blogs, and manage only their own posts from a personal dashboard.

**Live demo:** _add your deployed URL here_
**Previous module (backend):** https://github.com/Kashika-cloud/module_5

---

## ✨ Features

- 🔐 Secure registration & login with hashed passwords (bcrypt) and JWT-based sessions
- 📝 Create, view, and delete personal blog posts — users only ever see their own blogs
- 👤 Profile page showing account details
- 📱 Fully responsive UI (mobile, tablet, desktop) with a collapsible navbar
- 🛡️ Security headers via Helmet, input validation, and a custom 404 page
- ❤️ `/api/health` endpoint for uptime monitoring on hosting platforms

## 🛠️ Tech Stack

| Layer      | Technology                              |
|------------|------------------------------------------|
| Backend    | Node.js, Express                         |
| Auth       | JWT (jsonwebtoken), bcryptjs             |
| Frontend   | HTML5, CSS3, vanilla JavaScript, Bootstrap 5 |
| Storage    | JSON file storage (`data/`)              |
| Security   | Helmet, dotenv                           |

## 📂 Project Structure

```
bloghub/
├── data/
│   ├── users.json          # registered users (hashed passwords)
│   └── blogs.json          # blog posts
├── middleware/
│   └── auth.js             # JWT verification middleware
├── routes/
│   ├── auth.js              # /api/auth/register, /api/auth/login
│   ├── blogs.js              # /api/blogs (CRUD, per-user)
│   └── users.js              # /api/users/profile
├── public/
│   ├── index.html, login.html, register.html
│   ├── dashboard.html, profile.html, 404.html
│   ├── css/style.css
│   └── js/ (auth.js, dashboard.js, profile.js)
├── server.js
├── .env.example
├── render.yaml              # Render deploy config
├── vercel.json               # Vercel deploy config
└── package.json
```

## 🚀 Run Locally in VS Code

1. **Clone the repo**
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd <your-repo>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set a real `JWT_SECRET` (any long random string).

4. **Start the server**
   ```bash
   npm start
   ```
   Or, for auto-restart during development:
   ```bash
   npm run dev
   ```

5. **Open the app**
   Visit `http://localhost:3000` in your browser.

## 🔌 API Endpoints

| Method | Endpoint              | Auth required | Description                  |
|--------|------------------------|:-------------:|-------------------------------|
| POST   | `/api/auth/register`   | No            | Create a new account          |
| POST   | `/api/auth/login`      | No            | Log in, receive a JWT         |
| GET    | `/api/blogs`           | Yes           | Get the logged-in user's blogs|
| POST   | `/api/blogs`           | Yes           | Create a new blog post        |
| DELETE | `/api/blogs/:id`       | Yes           | Delete one of your own blogs  |
| GET    | `/api/users/profile`   | Yes           | Get the logged-in user's profile |
| GET    | `/api/health`          | No            | Health check                  |

Authenticated requests need an `Authorization: Bearer <token>` header, using the token returned from `/api/auth/login`.

## ☁️ Deployment

This app is a standard Node/Express server that reads and writes JSON files on disk, so it needs a host that keeps a persistent filesystem — **Render** is the recommended option below. Vercel/Netlify are serverless and reset their filesystem between requests, so data won't reliably persist there; configs are included anyway since they're valid submission options for this module.

### Option A — Render (recommended)
1. Push this repo to GitHub.
2. On [render.com](https://render.com), create a **New Web Service** from the repo (or use the included `render.yaml` via "New from Blueprint").
3. Build command: `npm install` · Start command: `npm start`.
4. Add an environment variable `JWT_SECRET` (Render can auto-generate one via `render.yaml`).
5. Deploy — Render gives you a live `.onrender.com` URL.

### Option B — Vercel
1. Push this repo to GitHub and import it in [vercel.com](https://vercel.com).
2. Add a `JWT_SECRET` environment variable in the project settings.
3. Deploy (the included `vercel.json` routes all traffic to `server.js`).
4. Note: registered users/blogs won't persist between deployments/cold starts, since Vercel's filesystem is ephemeral.

### Option C — Netlify
1. Netlify is best suited to static/JAMstack sites; for this Express app, deploy the frontend as static and wrap the API in a Netlify Function, or use Netlify's Node runtime support.
2. Set `JWT_SECRET` under Site settings → Environment variables.
3. Same persistence caveat as Vercel applies.

## 📸 Screenshots

_Add screenshots of the home page, dashboard, and mobile view here before submitting._

## 📄 License

MIT — see [LICENSE](LICENSE).

## 👩‍💻 Author

**Kashika EnNiS** — Codomax Digital Solutions Internship, Module 6 Final Project
