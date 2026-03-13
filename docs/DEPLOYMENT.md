# Deployment Guide

This guide covers deploying Randevu to production using **Vercel** (recommended) or any Node.js host.

---

## Prerequisites

- A PostgreSQL database (see [DATABASE.md](./DATABASE.md))
- Node.js 18+ for local builds
- A [Vercel](https://vercel.com) account (free tier works)

---

## Deploy to Vercel

### 1. Push Your Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create randevu --public --push
# or push to an existing repo
```

### 2. Import Project in Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository** and select your repo
3. Framework preset will be detected as **Next.js** automatically
4. Click **Deploy** — the first deploy will fail because env vars are missing; that's expected

### 3. Add Environment Variables

In your Vercel project: **Settings → Environment Variables**

| Variable              | Value                                      | Required |
|-----------------------|--------------------------------------------|----------|
| `DATABASE_URL`        | Your PostgreSQL connection string          | ✅       |
| `JWT_SECRET`          | A random 64-character string (see below)   | ✅       |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app`          | ✅       |
| `ADMIN_CREATION_KEY`  | A secret key for creating admin accounts   | ✅       |

**Generate a strong JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Initialize the Database

Run the schema migration once from your local machine with production env vars:

```bash
DATABASE_URL="your-production-connection-string" node scripts/setup-db.js
```

Or connect to your database directly and run `scripts/scripts.sql`.

### 5. Redeploy

After adding environment variables, trigger a new deployment:
- Go to **Deployments** tab in Vercel
- Click the three dots on the latest deployment → **Redeploy**

### 6. Verify

Visit your deployment URL. You should see the Randevu home page. Sign in with the default admin credentials (see [DATABASE.md](./DATABASE.md)) and change the password immediately.

---

## Deploy to Railway

1. Create a project at [railway.app](https://railway.app)
2. Add a **PostgreSQL** service
3. Add a **GitHub** deployment connected to your repo
4. Set environment variables in Railway's variable panel
5. Railway auto-deploys on push

---

## Deploy to a VPS (Ubuntu/Debian)

### Install Dependencies

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs postgresql nginx
```

### Setup App

```bash
git clone https://github.com/your-username/randevu.git
cd randevu
npm install
cp .env.example .env
# Edit .env with your values
nano .env
```

### Build and Run

```bash
npm run build
npm start
# App runs on port 3000 by default
```

### Setup Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Process Manager (PM2)

```bash
npm install -g pm2
pm2 start npm --name randevu -- start
pm2 startup
pm2 save
```

---

## Custom Domain

### Vercel

1. Go to **Settings → Domains**
2. Add your domain
3. Update your DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` to match your domain and redeploy

### SSL

Vercel and Railway handle SSL automatically. For VPS, use Certbot:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Post-Deployment Checklist

- [ ] Default admin password changed
- [ ] `JWT_SECRET` is a long random string (not the default)
- [ ] `ADMIN_CREATION_KEY` set to a secure value
- [ ] `NEXT_PUBLIC_APP_URL` points to your production URL
- [ ] Database connection is using SSL (`?sslmode=require`)
- [ ] App loads and sign-in works
