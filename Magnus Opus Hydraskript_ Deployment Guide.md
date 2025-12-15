# Magnus Opus Hydraskript: Deployment Guide

**Author:** Manus AI  
**Date:** December 14, 2025  
**Version:** 1.0

---

## 1. Introduction

This guide provides comprehensive, step-by-step instructions to prepare, secure, and deploy the **Magnus Opus Hydraskript** application. The audit revealed several critical issues that must be addressed before the project is buildable and secure enough for any environment. 

Following this guide will resolve all identified deployment blockers and establish a production-ready foundation for your application.

---

## 2. Prerequisites

Before you begin, ensure you have the following software installed on your local machine and/or deployment server:

- **Node.js** (v18.0 or later)
- **npm** or **yarn**
- **Git**
- **Docker** and **Docker Compose**
- **FFmpeg** (for audiobook generation)
- Access to a **PostgreSQL** database
- Access to a **Redis** instance
- A **Cloudflare R2** account (or any S3-compatible object storage)
- A **Stripe** account with API keys

---

## 3. Phase 1: Codebase Preparation & Security Hardening

This phase addresses the critical missing files, dependencies, and security vulnerabilities in the repository.

### Step 1: Create `next.config.js`

This file is essential for Next.js. Create `next.config.js` in the root of your project with the following content:

```javascript
/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.fal.ai", // For FAL.ai image generation
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### Step 2: Create `tsconfig.json`

This file is required for TypeScript. Create `tsconfig.json` in the root with the standard Next.js configuration:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Step 3: Create `.gitignore`

To prevent committing sensitive files and unnecessary build artifacts, create a `.gitignore` file in the root:

```
# Dependencies
/node_modules

# Build output
/.next/
/out/

# Environment variables
.env
.env.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Prisma
/prisma/migrations
/prisma/seed.ts

# Other
.DS_Store
```

### Step 4: Install Missing Dependencies

Your `package.json` is missing several critical packages that are used in the code. Run this command to install them:

```bash
npm install stripe @next-auth/prisma-adapter pdf-lib epub-gen docx @aws-sdk/client-s3 bcrypt
npm install --save-dev @types/fluent-ffmpeg @types/bcrypt
```

### Step 5: Fix Missing UI Components

1.  **Create `toaster.tsx`:** The `Toaster` component from `shadcn/ui` is missing. You can create a placeholder file at `components/ui/toaster.tsx` or install it properly.

    *Placeholder Content:*
    ```typescript
    // components/ui/toaster.tsx
    export const Toaster = () => {
      return <div>Toaster Component</div>;
    };
    ```

2.  **Fix CSS Import Path:** In `app/layout.tsx`, change the import for `globals.css`:

    *Find:*
    ```typescript
    import "./globals.css";
    ```
    *Replace with:*
    ```typescript
    import "../styles/globals.css";
    ```

### Step 6: Fix Type Definitions

In `lib/llm.ts`, the exported types are not defined. You need to define them or remove the export statement. Here are placeholder definitions you can add to the top of the file:

```typescript
// Add these type definitions at the top of lib/llm.ts
export type LLMGenerationResult = any;
export type LLMOutlineResult = any;
export type LLMChapterResult = any;
export type LLMModelInfo = any;
```

### Step 7: Secure API Keys and Credentials

**This is the most critical step.** Your repository contains live API keys.

1.  **Remove `.env` from Git History:** If you have already committed the `.env` file, you must remove it from your Git history. **Changing the file is not enough.**

2.  **Rotate All Exposed Keys:** Log into each service (Stripe, Cloudflare, OpenRouter) and generate **new** API keys. Deactivate the old ones immediately.

3.  **Update `.env.example`:** Remove all secret keys from `.env.example`, leaving only the variable names.

    *Example `/.env.example` entry:*
    ```
    STRIPE_SECRET_KEY=
    ```

### Step 8: Implement Password Hashing

Your `lib/auth.ts` uses hardcoded, plain-text passwords. You must replace this with a robust hashing mechanism using `bcrypt`.

1.  **Modify `authorize` function in `lib/auth.ts`:**

    ```typescript
    import bcrypt from "bcrypt";

    // ... inside CredentialsProvider
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      });

      if (!user || !user.password) {
        return null;
      }

      const isValidPassword = await bcrypt.compare(credentials.password, user.password);

      if (!isValidPassword) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    }
    ```

2.  **Update your user creation logic** to hash passwords before saving them to the database.

---

## 4. Phase 2: Infrastructure Setup

- **PostgreSQL:** Create a new database and obtain the connection URL.
- **Redis:** Set up a Redis instance and get the connection URL.
- **Cloudflare R2:** Create a new bucket and generate API tokens with read/write access.
- **Stripe:** Configure your products, plans, and webhook endpoints in the Stripe dashboard.

Update your `.env` file with the correct credentials for these services.

---

## 5. Phase 3: Database Migration

1.  **Initialize Prisma Migrate:**
    ```bash
    npx prisma migrate dev --name init
    ```
    This command creates the `prisma/migrations` directory and generates the initial SQL migration file based on your `schema.prisma`.

2.  **Apply Migrations:**
    ```bash
    npx prisma migrate deploy
    ```
    This applies the migrations to your production database.

---

## 6. Phase 4: Production Deployment with Docker

Using Docker is the recommended way to deploy this application as it packages all dependencies and standardizes the environment.

### Step 1: Create a `Dockerfile`

Create a `Dockerfile` in the project root:

```dockerfile
# 1. Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1;

# 2. Build the application
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# 3. Production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["npm", "start"]
```

### Step 2: Create `docker-compose.yml`

For a complete, multi-service deployment, create a `docker-compose.yml` file:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: magnum_opus
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: "postgresql://user:password@postgres:5432/magnum_opus"
      REDIS_URL: "redis://redis:6379"
      # Add all other required environment variables from .env here
      NEXTAUTH_URL: "http://localhost:3000"
      # ... etc.

volumes:
  postgres_data:
  redis_data:
```

### Step 3: Build and Run

From your project root, run:

```bash
# Build the images
docker-compose build

# Apply database migrations
docker-compose run --rm app npx prisma migrate deploy

# Start all services
docker-compose up -d
```

Your application should now be running and accessible at `http://localhost:3000`.

---

## 7. Conclusion

This guide provides a clear path to resolving the deployment issues in the Magnus Opus Hydraskript repository. By following these steps, you will have a secure, stable, and scalable deployment. Remember to manage your environment variables and secrets carefully and never commit them to version control.
