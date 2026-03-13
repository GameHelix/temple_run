# Configuration Reference

All configuration is done through environment variables. Copy `.env.example` to `.env` for local development.

```bash
cp .env.example .env
```

---

## Required Variables

### `DATABASE_URL`
PostgreSQL connection string.

```
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
```

- For Neon: copy the connection string from your project dashboard
- For local Postgres: `postgresql://postgres:password@localhost:5432/randevu`
- SSL is required for hosted databases (`?sslmode=require`)

---

### `JWT_SECRET`
Secret key used to sign and verify JSON Web Tokens. Must be a long, random, unguessable string.

```
JWT_SECRET="your-64-character-random-string-here"
```

Generate one:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Never reuse this value across environments. Never commit it to version control.**

---

### `NEXT_PUBLIC_APP_URL`
The public base URL of your application. Used for metadata, redirects, and OG images.

```
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

- Development: `http://localhost:3000`
- Production: your actual domain, e.g. `https://randevu.vercel.app`

---

### `ADMIN_CREATION_KEY`
A secret key required when calling `POST /api/admin/create-admin`. Protects admin account creation from unauthorized users.

```
ADMIN_CREATION_KEY="a-long-random-secret-key"
```

Keep this private. Share only with people who need to create admin accounts.

---

## Optional / Auto-Set Variables

### `NODE_ENV`
Set automatically by hosting platforms:
- `development` — enables dev-mode Next.js features
- `production` — enables production optimizations

You generally do not need to set this manually.

---

## Example `.env` file

```env
DATABASE_URL="postgresql://user:pass@host:5432/randevu?sslmode=require"
JWT_SECRET="b3f2a91c4d7e8f..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_CREATION_KEY="my-secret-admin-key"
```

---

## Vercel Environment Variables

For Vercel deployments, set these under **Project Settings → Environment Variables**.

You can scope variables to specific environments (Production / Preview / Development). At minimum, set all four required variables for **Production**.

After adding or changing environment variables, trigger a redeploy for them to take effect.
